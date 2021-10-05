import 'phaser'
import Game from './scenes/Game'

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 700,
  height: 350,
  scene: Game,
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200,
      },
      debug: true,
    },
  },
})

