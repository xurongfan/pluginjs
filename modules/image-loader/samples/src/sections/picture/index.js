import { queryAll } from '@pluginjs/dom'
import ImageLoader from '@pluginjs/image-loader'

const elements = queryAll('#picture .image')
elements.forEach(el => {
  window.el = el
  ImageLoader.of(el)
    .on('loaded', el => {
      el.classList.add('loaded')
    })
    .on('error', el => {
      el.classList.add('error')
    })
})
