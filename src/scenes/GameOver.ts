import Phaser from 'phaser'

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over')
  }

  preload(): void {
    this.load.image('refresh-circle', 'assets/icons/MdiRefreshCircle.svg')
  }

  create(): void {
    const width = this.scale.width
    const height = this.scale.height

    this.add.text(width * 0.5, height * 0.5, 'Game Over...\n\n\npress SPACE\nor\npress Refresh', {
      // @ts-ignore
      fontSize: 24,
    }).setOrigin(0.5)

    this.add.image(width * 0.5, height * 0.8, 'refresh-circle')
      .setName('left')
      .setScrollFactor(0)
      .setOrigin(0.5, 0)
      .setInteractive()

    this.input.on('gameobjectdown', (pointer: any, gameObject: any) => {
      gameObject.setTintFill(0xff0000, 0xffff00, 0xff0000, 0xff0000)
    })
    this.input.on('gameobjectup', (pointer: any, gameObject: any) => {
      gameObject.clearTint()
      this.scene.start('game')
    })

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('game')
    })
  }
}
