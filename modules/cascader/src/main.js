import Component from '@pluginjs/component'
import templateEngine from '@pluginjs/template'
import {
  eventable,
  register,
  stateable,
  styleable,
  themeable,
  optionable,
  translateable
} from '@pluginjs/decorator'
import {
  classes as CLASSES,
  defaults as DEFAULTS,
  dependencies as DEPENDENCIES,
  translations as TRANSLATIONS,
  events as EVENTS,
  methods as METHODS,
  namespace as NAMESPACE
} from './constant'
import {
  isArray,
  isFunction,
  isPlainObject,
  isEmpty,
  isUndefined
} from '@pluginjs/is'
import Clearable from './clearable'
import Filterable from './filterable'
import { removeEvent } from '@pluginjs/events'
import { addClass, removeClass } from '@pluginjs/classes'
import Dropdown from '@pluginjs/dropdown'
import { arrayEqual } from '@pluginjs/utils'
import {
  insertAfter,
  append,
  appendTo,
  html,
  parseHTML,
  parent,
  detach
} from '@pluginjs/dom'

@translateable(TRANSLATIONS)
@themeable()
@styleable(CLASSES)
@eventable(EVENTS)
@stateable()
@optionable(DEFAULTS, true)
@register(NAMESPACE, {
  methods: METHODS,
  dependencies: DEPENDENCIES
})
class Cascader extends Component {
  constructor(element, options = {}) {
    super(element)

    this.setupOptions(options)
    this.setupClasses()
    this.setupStates()
    this.setupI18n()
    this.initialize()
  }

  initialize() {
    if (!this.value) {
      this.value = []
    }
    if (!this.selected) {
      this.selected = []
    }

    this.placeholder = this.element.getAttribute('placeholder')
    if (!this.placeholder) {
      this.placeholder = this.options.placeholder
    }

    addClass(this.classes.ELEMENT, this.element)

    this.$wrap = insertAfter(
      `<div class="${this.classes.WRAP}"></div>`,
      this.element
    )

    if (this.options.theme) {
      addClass(this.getThemeClass(), this.$wrap)
    }

    this.$trigger = appendTo(
      `<div class="${this.classes.TRIGGER}"></div>`,
      this.$wrap
    )

    this.$label = appendTo(
      templateEngine.render(this.options.templates.label(), {
        classes: this.classes,
        placeholder: this.placeholder
      }),
      this.$trigger
    )

    if (this.options.filterable) {
      this.FILTERABLE = new Filterable(this)
    }

    this.initData()

    this.bind()

    this.setupDropdown()

    if (this.options.clearable) {
      this.CLEARABLE = new Clearable(this)
    }

    if (this.element.disabled || this.options.disabled) {
      this.disable()
    }

    this.enter('initialized')
    this.trigger(EVENTS.READY)
  }

  setupDropdown() {
    this.$dropdown = appendTo(
      `<div class="${this.classes.DROPDOWN}"></div>`,
      this.$wrap
    )

    this.DROPDOWN = Dropdown.of(this.$trigger, {
      ...this.options.dropdown,
      target: this.$dropdown,
      keyboard: this.options.keyboard,
      hideOnSelect: false,
      multiple: true,
      classes: {
        PLACEMENT: `${this.classes.NAMESPACE}-on-{placement}`
      },
      onShow: () => {
        this.onDropdownShow()
        addClass(this.classes.SHOW, this.$wrap)
        this.trigger(EVENTS.SHOW)
      },
      onShown: () => {
        this.trigger(EVENTS.SHOWN)
      },
      onHide: () => {
        this.trigger(EVENTS.HIDE)
      },
      onHided: () => {
        removeClass(this.classes.SHOW, this.$wrap)
        this.trigger(EVENTS.HIDED)
      },
      onSelect: $item => {
        const $menu = parent($item)

        const level = parseInt($menu.dataset.level, 10)
        const option = $item.__option

        this.select(level, option.value)
      },
      onUnselect: $item => {
        const $menu = parent($item)

        const level = parseInt($menu.dataset.level, 10)
        const option = $item.__option
        this.unselect(level, option.value)
      }
    })
  }

  isSelected(level, value) {
    if (
      !isUndefined(this.selected[level]) &&
      this.selected[level].value == value // eslint-disable-line
    ) {
      return true
    }
    return false
  }

  onDropdownShow() {
    if (!this.is('builded')) {
      this.buildDropdown()
      this.DROPDOWN.selectByValue(this.value, false)
    }
  }

  bind() {} // eslint-disable-line

  unbind() {
    removeEvent(this.eventName(), this.element)
  }

  initData() {
    if (isArray(this.options.source) || isPlainObject(this.options.source)) {
      this.resolveData(this.options.source)
    } else if (isFunction(this.options.source)) {
      this.options.source.call(this, this.resolveData.bind(this))
    }
  }

  resolveData(data) {
    this.data = data

    let value = this.getValueFromElement()
    if (isEmpty(value)) {
      value = this.getValueFromData()

      if (isEmpty(value)) {
        value = this.options.value
      }
    }

    if (!isEmpty(value)) {
      this.set(value, false)
    }
  }

  getValueFromData() {
    const selecteds = []

    let selected = this.data.find(item => {
      return item.selected
    })

    if (selected) {
      selecteds.push(selected)

      while (!isUndefined(selected.children)) {
        selected = selected.children.find(item => {
          return item.selected
        })

        if (selected) {
          selecteds.push(selected)
        } else {
          break
        }
      }
    }

    return this.getValueFromSelected(selecteds)
  }

  getValueFromSelected(selected) {
    if (!selected) {
      selected = this.selected
    }
    return selected.map(item => item.value)
  }

  getValueFromElement() {
    return this.options.parse.call(this, this.element.value)
  }

  setValueForElement(value) {
    this.element.value = this.options.process.call(this, value)
  }

  getOptionByValue(level, value) {
    return this.getItems(level).find(option => {
      return option.value == value // eslint-disable-line
    })
  }

  getItems(level) {
    let items = []
    if (level === 0) {
      items = this.data
    } else if (
      this.selected.length >= level &&
      !isUndefined(this.selected[level - 1].children)
    ) {
      items = this.selected[level - 1].children
    }

    return items
  }

  isValidValue(level, val) {
    const found = this.getItems(level).find(item => {
      return item.value == val // eslint-disable-line
    })
    if (found) {
      return true
    }
    return false
  }

  select(level, value, trigger = true, update = true) {
    if (!this.isValidValue(level, value)) {
      return
    }
    if (
      isUndefined(this.selected[level]) ||
      value !== this.selected[level].value
    ) {
      const option = this.getOptionByValue(level, value)
      if (this.selected.length > level) {
        this.unselect(level, this.selected[level].value, trigger, false)
      }

      this.selected[level] = option
      if (option.children) {
        this.showMenu(option, level + 1)
      }

      if (trigger) {
        this.trigger(EVENTS.SELECT, option)
      }
      if (this.DROPDOWN && option.__dom) {
        this.DROPDOWN.selectItem(option.__dom, false)
      }
    }

    if (update) {
      this.set(this.getValueFromSelected(), true, false)
    }
  }

  unselect(level, value, trigger = true, update = true) {
    if (!this.isValidValue(level, value)) {
      return
    }
    if (this.selected.length > level && value === this.selected[level].value) {
      const option = this.getOptionByValue(level, value)

      for (let i = this.selected.length - 1; i > level; i--) {
        this.unselect(i, this.selected[i].value, trigger, false)
      }

      this.selected.splice(level, 1)

      if (option.children) {
        this.hideMenu(option, level + 1)
      }
      if (trigger) {
        this.trigger(EVENTS.UNSELECT, option)
      }
      if (this.DROPDOWN && option.__dom) {
        this.DROPDOWN.unselectItem(option.__dom, false)
      }
    }

    if (update) {
      this.set(this.getValueFromSelected(), true, false)
    }
  }

  showMenu(option, level) {
    if (!option.__menu) {
      option.__menu = this.buildMenu(option.children, level)
    }

    if (parent(option.__menu) !== this.$dropdown) {
      append(option.__menu, this.$dropdown)
    }
  }

  hideMenu(option) {
    if (option.__menu) {
      detach(option.__menu)
    }
  }

  set(value, trigger = true, update = true) {
    value = this.purifyValue(value)
    if (!arrayEqual(value, this.value)) {
      if (update) {
        if (value.length === 0) {
          let level = this.value.length - 1
          this.value.reverse().forEach(v => {
            this.unselect(level, v, trigger, false)
            level--
          })
        } else {
          let level = 0
          value.forEach(v => {
            this.select(level, v, trigger, false)
            level++
          })
        }
      }

      this.value = value
      if (this.value.length > 0) {
        const labels = this.selected.map(option => {
          return this.options.optionLabel(option)
        })
        this.setLabel(this.options.customLabel(labels))
        addClass(this.classes.SELECTED, this.$wrap)
      } else {
        this.setLabel(this.placeholder)
        removeClass(this.classes.SELECTED, this.$wrap)
        if (trigger) {
          this.trigger(EVENTS.CLEAR)
        }
      }

      this.setValueForElement(value)

      if (trigger) {
        this.trigger(EVENTS.CHANGE, value)
      }
    }
  }

  purifyValue(value) {
    if (isArray(value)) {
      return value
    }
    return []
  }

  val(value) {
    if (typeof value === 'undefined') {
      return this.options.process.call(this, this.get())
    }
    return this.set(this.options.parse.call(this, value))
  }

  get() {
    return this.value
  }

  clear() {
    this.set(null)
  }

  getOptionLabel(option) {
    return this.options.customLabel.call(this, option)
  }

  setLabel(label) {
    html(label, this.$label)
  }

  buildDropdown() {
    const $menu = this.buildMenu(this.data, 0)

    this.$dropdown.appendChild($menu)

    this.enter('builded')
  }

  buildMenu(options, level) {
    if (!this.menuTemplate) {
      this.menuTemplate = templateEngine.compile(
        this.options.templates.menu.call(this)
      )
    }

    const $menu = parseHTML(
      this.menuTemplate({
        classes: this.classes,
        level
      })
    )

    options.forEach(o => {
      $menu.appendChild(this.buildOption(o))
    })

    return $menu
  }

  buildOption(option) {
    if (!this.optionTemplate) {
      this.optionTemplate = templateEngine.compile(
        this.options.templates.option.call(this)
      )
    }

    const $option = parseHTML(
      this.optionTemplate({
        classes: this.classes,
        option
      })
    )

    if (option.children) {
      addClass(this.classes.OPTIONEXTENSIBLE, $option)
    }

    if (option.disabled) {
      addClass(this.classes.OPTIONDISABLED, $option)
    }

    $option.__option = option

    option.__dom = $option

    return $option
  }

  enable() {
    if (this.is('disabled')) {
      this.DROPDOWN.enable()
      removeClass(this.classes.DISABLED, this.$wrap)
      this.leave('disabled')
    }
    this.trigger(EVENTS.ENABLE)
  }

  disable() {
    if (!this.is('disabled')) {
      this.DROPDOWN.disable()
      addClass(this.classes.DISABLED, this.$wrap)
      this.enter('disabled')
    }

    this.trigger(EVENTS.DISABLE)
  }

  destroy() {
    if (this.is('initialized')) {
      this.unbind()

      if (this.CLEARABLE) {
        this.CLEARABLE.destroy()
      }
      if (this.options.theme) {
        removeClass(this.getThemeClass(), this.$wrap)
      }
      this.$wrap.remove()
      removeClass(this.classes.ELEMENT, this.element)
      this.leave('initialized')
    }

    this.trigger(EVENTS.DESTROY)
    super.destroy()
  }
}

export default Cascader