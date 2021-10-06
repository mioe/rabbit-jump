import Phaser from 'phaser'
import Game from './scenes/Game'
import GameOver from './scenes/GameOver'

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 393,
  height: 624,
  scene: [Game, GameOver],
  backgroundColor: '#f2c0c0',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200,
      },
      // debug: true,
    },
  },
})

