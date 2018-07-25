import Component from '@pluginjs/component'
import {
  eventable,
  register,
  stateable,
  styleable,
  optionable
} from '@pluginjs/decorator'
import {
  classes as CLASSES,
  defaults as DEFAULTS,
  events as EVENTS,
  methods as METHODS,
  namespace as NAMESPACE
} from './constant'

@styleable(CLASSES)
@eventable(EVENTS)
@stateable()
@optionable(true)
@register(NAMESPACE, {
  defaults: DEFAULTS,
  methods: METHODS
})
class ImageLoader extends Component {
  constructor(element, options = {}) {
    super(NAMESPACE, element)
    this.initOptions(DEFAULTS, options)
    this.initClasses(CLASSES)
    this.history = []
    this.imgLoadAll = []
    this.selector = this.options.selector || 'img'
    this.initStates()
    this.initialize()
  }

  initialize() {
    this.$imgs = Array.from(this.getImgs())
    this.loading()
    this.bind()
    this.enter('initialized')
    this.trigger(EVENTS.READY)
  }

  bind() {
    this.observer = new MutationObserver(mutationsList => {
      const observer = mutationsList.find(
        mutation => mutation.attributeName === 'src'
      )
      if (observer) {
        this.imageLoadHandler(observer.target)
          .then(imgs => {
            this.onCompleteHandler(imgs)
            return imgs
          })
          .finally(this.onFinallyHandler)
      }
    })
    const observeImageChange = config => element => {
      this.observer.observe(element, config)
    }
    this.$imgs.map(observeImageChange({ attributes: true }))
  }
  unbind() {
    this.observer.disconnect()
  }
  /*
   * When an img loading success.
   */
  onLoaded(onLoadHandler) {
    this.onLoadHandler = onLoadHandler
    return this
  }

  onError(onErrorHandler) {
    this.onErrorHandler = onErrorHandler
    return this
  }
  /*
   * When all of imgs loading success.
   */
  onComplete(onCompleteHandler) {
    this.onCompleteHandler = onCompleteHandler
    return this
  }

  finally(onFinallyHandler) {
    this.onFinallyHandler = onFinallyHandler
    return this
  }

  getImgs() {
    return this.element.querySelectorAll(this.selector)
  }

  imageLoadHandler($img) {
    const imgLoad = new Promise((resolve, reject) => {
      if ($img.complete) {
        this.done += 1
        resolve($img)
      }

      $img.addEventListener('load', () => {
        this.done += 1
        resolve($img)
      })

      $img.addEventListener('error', () => {
        this.fail += 1
        reject($img)
      })
    })
    return imgLoad
      .then(img => {
        this.onLoadHandler(img)
        return img
      })
      .catch(img => {
        if (this.onErrorHandler) {
          this.onErrorHandler(img)
        }
        return img
      })
  }

  loading() {
    this.history = [].concat([this.history, this.$imgs])
    this.imgLoadAll = this.imgLoadAll.concat(
      this.$imgs.map(this.imageLoadHandler.bind(this))
    )
    Promise.all(this.imgLoadAll)
      .then(imgs => {
        if (this.onCompleteHandler) {
          this.onCompleteHandler(imgs)
        }
        return imgs
      })
      .finally(this.onFinallyHandler)
  }

  enable() {
    if (this.is('disabled')) {
      this.leave('disabled')
    }
    this.trigger(EVENTS.ENABLE)
  }

  disable() {
    if (!this.is('disabled')) {
      this.enter('disabled')
    }

    this.trigger(EVENTS.DISABLE)
  }

  destroy() {
    if (this.is('initialized')) {
      this.leave('initialized')
    }
    this.unbind()
    this.trigger(EVENTS.DESTROY)
    super.destroy()
  }
}

export default ImageLoader
