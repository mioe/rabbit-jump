import Phaser from 'phaser'

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over')
  }

  create(): void {
    const width = this.scale.width
    const height = this.scale.height

    this.add.text(width * 0.5, height * 0.5, 'Game Over...\n press SPACE', {
      // @ts-ignore
      fontSize: 24,
    }).setOrigin(0.5)

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('game')
    })
  }
}
