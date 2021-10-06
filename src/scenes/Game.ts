import Phaser from 'phaser'
import Carrot from './Carrot'

export default class Game extends Phaser.Scene {
  /* Подвижный персонаж которым будем управлять */
  player!: Phaser.Physics.Arcade.Sprite
  /* Статическая платформа */
  platforms!: Phaser.Physics.Arcade.StaticGroup
  /* Счетчик очков */
  carrotsCollected = 0
  carrotsCollectedText!: Phaser.GameObjects.Text
  carrotsCollectedWorldRecord!: Phaser.GameObjects.Text
  goodLuckText!: Phaser.GameObjects.Text
  authorText!: Phaser.GameObjects.Text
  /* Указатель для управления персонажем */
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  /* Объект */
  carrots!: Phaser.Physics.Arcade.Group

  constructor() {
    super('game')
  }

  init(): void {
    console.log('🦕 init')
    this.carrotsCollected = 0
  }

  /**
   * Загрузка статических объектов
   */
  preload(): void {
    console.log('🦕 preload')

    /* Следим за нажатием клавиш */
    this.cursors = this.input.keyboard.createCursorKeys()

    this.load.image('platform', 'assets/textures/ground_cake.png')

    this.load.image('bunny-stand', 'assets/textures/bunny2_stand.png')
    this.load.image('bunny-jump', 'assets/textures/bunny2_jump.png')
    this.load.audio('jump', 'assets/audio/phaseJump1.ogg')

    this.load.image('carrot', 'assets/textures/carrot.png')
  }

  create(): void {
    console.log('🦕 create')

    /* Генерация статических платформ */
    this.platforms = this.physics.add.staticGroup()
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(90, 313)
      const y = 150 * i

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, 'platform')
      platform.scale = 0.5

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body
      body.updateFromGameObject()
    }

    /* Генерация персонажа (начальная точка появления, "196 == x, 312 == y" координаты начального появления) */
    this.player = this.physics.add.sprite(196, 312, 'bunny-stand').setScale(0.5)

    /* Объявляем что персонаж может стоять на платформе */
    this.physics.add.collider(this.platforms, this.player)

    /* Убираем границы персонажа оставляя только down */
    this.player.body.checkCollision.up = false
    this.player.body.checkCollision.left = false
    this.player.body.checkCollision.right = false

    /* Работа с камерой */
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setDeadzone(this.scale.width * 1.5)

    /* Генерируем текст на экране */
    const style = { color: '#000' }
    this.carrotsCollectedText = this.add.text(70, 15, 'Carrots: 0', style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0)

    this.carrotsCollectedWorldRecord = this.add.text(300 , 15, `World Record: ${localStorage.getItem('world-record') || '0'}`, style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0)

    this.goodLuckText = this.add.text(200 , 300, 'GL && HF', style)
      .setOrigin(0.5, 0)

    this.authorText = this.add.text(315 , 595, 'by mioe 2021', style)
      .setOrigin(0.5, 0)

    /* Инициализация объекта и правило что объект может стоять на платформе */
    this.carrots = this.physics.add.group({
      classType: Carrot,
    })
    this.physics.add.collider(this.platforms, this.carrots)

    /* Логика сбора объектов */
    this.physics.add.overlap(
      this.player,
      this.carrots,
      // @ts-ignore
      this.handleCollectCarrot, // called on overlap
      undefined,
      this,
    )
  }

  update(t: any, dt: any): void {
    /* Касание платформы */
    const touchingDown = this.player.body.touching.down
    if (touchingDown) {
      this.player.setVelocityY(-300)
      this.player.setTexture('bunny-jump')
      // play jump sound
      this.sound.play('jump')
    }
    /* Когда персонаж начнет падать вниз вернуть ему состояние stand */
    const vy = this.player.body.velocity.y
    if (vy > 0 && this.player.texture.key !== 'bunny-stand') {
      this.player.setTexture('bunny-stand')
    }

    /* Обработка зажатых клавиш */
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200)
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200)
    } else {
      this.player.setVelocityX(0)
    }

    /* Телепортация персонажа когда он выходит за рамки экрана */
    this.horizontalWrap(this.player)

    /* Генерация новых платформ и генерация объекта на платформе */
    // @ts-ignore
    this.platforms.children.iterate((child: Phaser.Physics.Arcade.Sprite) => {
      const platform = child
      const scrollY = this.cameras.main.scrollY
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100)
        platform.body.updateFromGameObject()
        this.addCarrotAbove(platform)
      }
    })

    /* Поиск последний платформы и смена сцены */
    const bottomPlatform = this.findBottomMostPlatform()
    if (this.player.y > bottomPlatform.y + 200) {
      if (localStorage.getItem('world-record')) {
        if (this.carrotsCollected > Number(localStorage.getItem('world-record'))) {
          localStorage.setItem('world-record', String(this.carrotsCollected))
        }
      } else {
        localStorage.setItem('world-record', String(this.carrotsCollected))
      }
      this.scene.start('game-over')
    }
  }

  horizontalWrap(sprite: Phaser.GameObjects.Sprite): void {
    const halfWidth = sprite.displayWidth * 0.5
    const gameWidth = this.scale.width
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth
    }
  }

  addCarrotAbove(sprite: Phaser.GameObjects.Sprite): Phaser.GameObjects.Sprite {
   const y = sprite.y - sprite.displayHeight
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, 'carrot')
    // set active and visible
    carrot.setActive(true)
    carrot.setVisible(true)
    this.add.existing(carrot)
    carrot.body.setSize(carrot.width, carrot.height)
    // make sure body is enabed in the physics world
    this.physics.world.enable(carrot)
    return carrot
  }

  handleCollectCarrot(player: Phaser.GameObjects.Sprite, carrot: Phaser.GameObjects.Sprite): void {
    // hide from display
    this.carrots.killAndHide(carrot)
    // disable from physics world
    // @ts-ignore
    this.physics.world.disableBody(carrot.body)
    // increment by 1
    this.carrotsCollected++
    // create new text value and set it
    const value = `Carrots: ${this.carrotsCollected}`
    this.carrotsCollectedText.text = value
  }

  findBottomMostPlatform(): any {
    const platforms = this.platforms.getChildren()
    let bottomPlatform = platforms[0]
    for (let i = 1; i < platforms.length; ++i){
      const platform = platforms[i]
      // discard any platforms that are above current
      // @ts-ignore
      if (platform.y < bottomPlatform.y) {
        continue
      }
      bottomPlatform = platform
    }
    return bottomPlatform
  }
}
