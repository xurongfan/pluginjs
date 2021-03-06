import { setStyle } from '@pluginjs/styled'
import {
  append,
  parseHTML,
  children,
  prepend,
  query,
  setData
} from '@pluginjs/dom'
import Tooltip from '@pluginjs/tooltip'

class Collection {
  constructor(instance, element) {
    this.instance = instance
    this.classes = this.instance.classes
    this.element = element
    this.init()
  }

  init() {
    // init Collection
    this.build()
  }

  build() {
    // create group
    const $scheme = this.instance.createEl('scheme', {
      classes: this.classes
    })

    if(this.instance.options.manageButton) {
      const $manage = this.instance.createEl('manage', {
        classes: this.classes,
        manageText: this.instance.translate('manage')
      })
      this.element.append($scheme, $manage)
    } else {
      this.element.append($scheme)
    }
    
    this.createCollectionItem()

    // init scrollable
    const $scorllWrap = parseHTML(
      `<div class='${
        this.classes.COLLECTIONSCROLLWRAP
      }'><div><div></div></div></div>`
    )
    prepend($scorllWrap, this.element)
    const scrollWrapChildren = children($scorllWrap)
      .filter(el => el.tagName === 'DIV')
      .map(el =>
        children(el)
          .filter(el => el.tagName === 'DIV')
          .reduce((a, b) => a.concat(b))
      )
    scrollWrapChildren.map(append(this.$selectorList))

    return null
  }

  createCollectionItem() {
    this.$selectorList = query(`.${this.classes.SCHEME}`, this.element)
    Object.entries(this.instance.colors).forEach(([i, v]) => {
      const $item = this.instance.createEl('collectionItem', {
        classes: this.classes
      })

      // set tooltip
      Tooltip.of($item, {
        title: i.replace(/^[a-zA-Z]?/g, char => char.toLocaleUpperCase()),
        placement: 'bottom',
        trigger: 'hover'
      })

      // set BgColor and Data val
      setStyle('background', v, $item)
      const info = {
        name: i,
        color: v
      }
      setData('info', info, $item)
      // append to group list
      append($item, this.$selectorList)
    })
  }
}

export default Collection
