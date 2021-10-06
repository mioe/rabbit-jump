import 'phaser'

export default class Game extends Phaser.Scene {
  /* Подвижный персонаж которым будем управлять */
  player: Phaser.Physics.Arcade.Sprite | undefined
  /* Статическая платформа */
  platforms: Phaser.Physics.Arcade.StaticGroup | undefined
  /* Счетчик очков */
  carrotsCollectedText: Phaser.GameObjects.Text | undefined

  constructor() {
    super('game')
  }

  init(): void {
    console.log('🦕 init')
  }

  /**
   * Загрузка статических объектов
   */
  preload(): void {
    console.log('🦕 preload')

    this.load.image('platform', 'src/assets/textures/ground_cake.png')

    this.load.image('bunny-stand', 'src/assets/textures/bunny2_stand.png')
    this.load.image('bunny-jump', 'src/assets/textures/bunny2_jump.png')
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
    this.carrotsCollectedText = this.add.text(70, 20, 'Carrots: 0', style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0)
  }
}
