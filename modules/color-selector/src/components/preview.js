import { isString } from '@pluginjs/is'
import { query } from '@pluginjs/dom'
import { bindEvent } from '@pluginjs/events'
import { setStyle } from '@pluginjs/styled'

class Preview {
  constructor(instance, element) {
    this.instance = instance
    this.element = element
    this.$color = query(`.${this.instance.classes.PREVIEWCOLOR}`, this.element)

    this.bind()
  }

  bind() {
    bindEvent(
      this.instance.selfEventName('changeColor'),
      (e, el, color) => {
        this.update(color)
      },
      this.instance.element
    )
  }

  update(color) {
    if (
      this.instance.module === 'gradient' &&
      this.instance.is('noSelectedMarker')
    ) {
      return false
    }

    if (isString(color)) {
      setStyle('background', color, this.$color)
    } else {
      setStyle('background', color.toRGBA(), this.$color)
    }
    return null
  }

  remove() {
    this.element.remove()
  }
}

export default Preview
