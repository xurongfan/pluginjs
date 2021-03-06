import { query } from '@pluginjs/dom'
import Swipe from '@pluginjs/swipe'

const element = query('#loop .swipe')
Swipe.of(element, {
  /** options **/
  itemNums: 1,
  loop: true,
  arrows: {
    type: 'solid'
  },
  pagination: {
    type: 'square light'
  }
})
