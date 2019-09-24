import anime from 'animejs'
import { text } from '@pluginjs/dom'

export default class Zoom {
  constructor(instance) {
    this.instance = instance
    this.options = this.instance.options
    this.element = this.instance.element
    this.initialize()
    this.setupAnime()
  }

  initialize() {
    this.text = text(this.element)
    text('', this.element)
    this.instance.splitWord(this.text)
  }

  setupAnime() {
    const options = {
      targets: this.element,
      scale: [0, 1],
      opacity: [0, 1],
      duration: this.options.duration,
      loop: this.options.loop,
      easing: 'easeInOutQuart',
      endDelay: 1000
    }

    anime(options)
  }
}
