import { query } from '@pluginjs/dom'
import Swipe from '@pluginjs/swipe'

const element = query('#multiple .swipe')
Swipe.of(element, {
  /** options **/
  itemNums: 3,
  gutter: 20,
  multiple: true,
  arrows: {
    type: 'solid'
  },
  pagination: {
    type: 'square light'
  }
})
