import Phaser from 'phaser'

export default class Carrot extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    this.setScale(0.5)
  }
}
