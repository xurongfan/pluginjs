import { isString, isObject, isNumber, isFunction } from '@pluginjs/is'
import { addClass, removeClass } from '@pluginjs/classes'
import { setStyle } from '@pluginjs/styled'
import { bindEvent } from '@pluginjs/events'
import { append, parseHTML } from '@pluginjs/dom'

class Tip {
  constructor(instance) {
    this.defaults = { active: 'always' }
    this.init(instance)
  }

  init(instance) {
    const opts = Object.assign({}, this.defaults, instance.options.tip)

    this.opts = opts
    this.classes = {
      tip: instance.classes.TIP,
      show: instance.classes.SHOW
    }

    instance.pointer.forEach((p, i) => {
      const tip = parseHTML('<span></span>')
      append(tip, instance.pointer[i].element)

      addClass(this.classes.tip, tip)
      if (this.opts.active === 'onMove') {
        setStyle('display', 'none', tip)
        bindEvent(
          instance.selfEventName('moveEnd'),
          () => {
            this.hide(tip)
            return false
          },
          p.element
        )
        bindEvent(
          instance.selfEventName('moveStart'),
          () => {
            this.show(tip)
            return false
          },
          p.element
        )
      }

      bindEvent(
        instance.selfEventName('move'),
        () => {
          let value
          if (instance.options.isRange) {
            value = instance.getPointerVal()[i]
          } else {
            value = instance.getPointerVal()
          }
          if (isFunction(instance.options.format)) {
            if (instance.options.replaceFirst && !isNumber(value)) {
              if (isString(instance.options.replaceFirst)) {
                value = instance.options.replaceFirst
              }
              if (isObject(instance.options.replaceFirst)) {
                for (const key in instance.options.replaceFirst) {
                  if (
                    Object.prototype.hasOwnProperty.call(
                      instance.options.replaceFirst,
                      key
                    )
                  ) {
                    value = instance.options.replaceFirst[key]
                  }
                }
              }
            } else if (!instance.is('units') && !instance.options.isRange) {
              value = instance.options.format(value)
            }
          }
          tip.textContent = value
          // return false
        },
        p.element
      )
    })
  }

  show(tip) {
    addClass(this.classes.show, tip)
    setStyle('display', 'block', tip)
  }

  hide(tip) {
    removeClass(this.classes.show, tip)
    setStyle('display', 'none', tip)
  }

  static init(instance) {
    return new Tip(instance)
  }
}

export default Tip
