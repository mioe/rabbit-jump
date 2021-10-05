import 'phaser'

export default class Game extends Phaser.Scene {
  platforms: Phaser.Physics.Arcade.StaticGroup | undefined

  constructor() {
    super('game')
  }

  init(): void {
    console.log('🦕 init')
  }

  create(): void {
    console.log('🦕 create')
    this.platforms = this.physics.add.staticGroup()
  }
}
