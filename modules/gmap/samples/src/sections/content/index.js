import { query } from '@pluginjs/dom'
import Gmap from '@pluginjs/gmap'

const element = query('#content .gmap')
Gmap.of(element, {
  apiKey: 'AIzaSyDSx-q31rWQKqLwUahg6TrZ3R_5NT0LhFE'
})
