import { query } from '@pluginjs/dom'
import Thumbnails from '@pluginjs/thumbnails'

const element = query('#dark .thumbnails')
Thumbnails.of(element, {
  loader: {
    color: '#fff'
  }
})
