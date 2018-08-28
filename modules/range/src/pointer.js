import { addClass, removeClass } from '@pluginjs/classes'
import { setStyle, offset as getOffset } from '@pluginjs/styled'
import { bindEvent, removeEvent, trigger } from '@pluginjs/events'

class Pointer {
  constructor(element, id, instance) {
    this.element = element
    this.uid = id
    this.instance = instance
    this.options = this.instance.options
    this.direction = this.options.direction
    this.value = null
    this.classes = { active: this.instance.classes.POINTERACTIVE }
  }

  mousedown(event) {
    const axis = this.instance.direction.axis
    const position = this.instance.direction.position
    const offset = getOffset(this.instance.$control)

    trigger(this.instance.selfEventName('moveStart'), this, this.element)

    this.data = {}
    this.data.start = event[axis]
    this.data.position = event[axis] - offset[position]

    const value = this.instance.getValueFromPosition(this.data.position)
    this.set(value)

    this.instance.pointer.map(p => p.deactive())

    this.active()

    this.mousemove = function(event) {
      const value = this.instance.getValueFromPosition(
        this.data.position + (event[axis] || this.data.start) - this.data.start
      )
      this.set(value)
      event.preventDefault()
      return false
    }

    this.mouseup = function() {
      removeEvent(this.instance.eventNameWithId('mousemove'), document.body)
      removeEvent(this.instance.eventNameWithId('mouseup'), document.body)
      removeEvent(this.instance.eventNameWithId('touchmove'), document.body)
      removeEvent(this.instance.eventNameWithId('touchend'), document.body)
      trigger(`${this.instance.plugin}:moveEnd`, this, this.element)
      // this.element.trigger(`${this.instance.plugin}:moveEnd`, this)
      this.element.blur()
      return false
    }

    bindEvent(
      this.instance.eventNameWithId('touchmove'),
      this.mousemove.bind(this),
      document.body
    )
    bindEvent(
      this.instance.eventNameWithId('mousemove'),
      this.mousemove.bind(this),
      document.body
    )
    bindEvent(
      this.instance.eventNameWithId('touchend'),
      this.mouseup.bind(this),
      document.body
    )
    bindEvent(
      this.instance.eventNameWithId('mouseup'),
      this.mouseup.bind(this),
      document.body
    )
    return false
  }

  active() {
    addClass(this.classes.active, this.element)
  }

  deactive() {
    removeClass(this.classes.active, this.element)
  }

  set(value) {
    if (this.value === value) {
      return
    }
    if (this.instance.step) {
      value = this.matchStep(value)
    }
    if (this.options.limit === true) {
      value = this.matchLimit(value)
    } else {
      if (value <= this.instance.min) {
        value = this.instance.min
      }
      if (value >= this.instance.max) {
        value = this.instance.max
      }
    }
    this.value = value

    this.updatePosition()
    this.element.focus()
    // this.instance.trigger('move', value)
    trigger(`${this.instance.plugin}:move`, this, this.element)
    // this.element.trigger(`${this.instance.plugin}:move`, this)
  }

  updatePosition() {
    setStyle(
      this.instance.direction.position,
      `${this.getPercent()}%`,
      this.element
    )
  }

  getPercent() {
    return ((this.value - this.instance.min) / this.instance.interval) * 100
  }

  get() {
    return this.value
  }

  matchStep(value) {
    const step = this.instance.step
    const decimal = step.toString().split('.')[1]

    value = Math.round(value / step) * step

    if (decimal) {
      value = value.toFixed(decimal.length)
    }

    return parseFloat(value)
  }

  matchLimit(value) {
    let left
    let right
    const pointer = this.instance.pointer

    if (this.uid === 1) {
      left = this.instance.min
    } else {
      left = pointer[this.uid - 2].value
    }

    if (
      pointer[this.uid] &&
      pointer[this.uid].value !== null &&
      !this.instance.is('units')
    ) {
      right = pointer[this.uid].value
    } else {
      right = this.instance.max
    }
    if (value <= left) {
      value = left
    }
    if (value >= right) {
      value = right
    }
    return value
  }

  destroy() {
    removeEvent(this.instance.eventName(), this.element)
    removeEvent(this.instance.eventNameWithId(), document.body)
    this.element.remove()
  }
}

export default Pointer
