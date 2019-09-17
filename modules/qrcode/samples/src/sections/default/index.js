import { query } from '@pluginjs/dom'
import Qrcode from '@pluginjs/qrcode'

const element = query('#default .qrcode')
Qrcode.of(element, {
  text: 'hello world'
})
