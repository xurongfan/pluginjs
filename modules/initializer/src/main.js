import { deepMerge } from '@pluginjs/utils'
import { attr, queryAll } from '@pluginjs/dom'

const PLUGINS = {}
const DEFAULTS = {}

function getDefaults(name) {
  if (Object.prototype.hasOwnProperty.call(DEFAULTS, name)) {
    return DEFAULTS[name]
  }
  return {}
}

function setDefaults(name, defaults = {}) {
  DEFAULTS[name] = defaults
}

function getPlugin(name) {
  if (Object.prototype.hasOwnProperty.call(PLUGINS, name)) {
    return PLUGINS[name]
  }

  /* eslint-disable-next-line no-undef */
  if (window.Pj && window.Pj.has(name)) {
    const Plugin = window.Pj.get(name)

    return function(element, options) {
      Plugin.of(element, options)
    }
  }

  return null
}

function hasPlugin(name) {
  const Plugin = getPlugin(name)

  if (Plugin !== null) {
    return true
  }

  return false
}

function initializePlugin(name, element, options = {}) {
  const Plugin = getPlugin(name)

  options = deepMerge(getDefaults(name), options)

  return Plugin(element, options)
}

export default {
  of(selector, attrKey = 'data-plugin') {
    let elements = []

    if (typeof selector === 'string') {
      elements = queryAll(selector)
    } else if (
      selector instanceof NodeList ||
      selector instanceof HTMLCollection
    ) {
      elements = Array.from(selector)
    } else if (selector instanceof Node) {
      elements = Array.of(selector)
    } else if (selector instanceof Array) {
      elements = selector;
    }

    if (elements.length > 0) {
      elements.map(el => initializePlugin(attr(attrKey, el), el))
    }
  },

  register(plugin, callback, defaults = null) {
    if (
      toString.call(callback) === '[object Function]' ||
      typeof callback === 'function'
    ) {
      PLUGINS[plugin] = callback
    }

    if (defaults) {
      setDefaults(plugin, defaults)
    }
  },

  defaults(plugin, defaults = null) {
    if (defaults) {
      return setDefaults(plugin, defaults)
    }
    return getDefaults(plugin)
  },

  initialize(plugin, element, options = {}) {
    return initializePlugin(plugin, element, options)
  },

  get(plugin) {
    if (hasPlugin(plugin)) {
      return function(element, options = {}) {
        initializePlugin(plugin, element, options)
      }
    }
    return null
  },

  has(plugin) {
    return hasPlugin(plugin)
  }
}