import { query } from '@pluginjs/dom'
import Units from '@pluginjs/units'

const element = query('#default .example-default')
window.api = Units.of(element, {
  units: ['px', '%']
})
