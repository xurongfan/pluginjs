import jsdom from 'mocha-jsdom'
import $ from 'jquery'
import ScrollSpy from '../../src/main'
import { defaults as DEFAULTS } from '../../src/constant'

describe('ScrollSpy', () => {
  describe('ScrollSpy()', () => {
    it('should have ScrollSpy', () => {
      expect(ScrollSpy).to.be.an('function')
    })

    it('should have defaults', () => {
      expect(ScrollSpy.defaults).to.be.an('object')
    })

    it('should have events', () => {
      expect(ScrollSpy.events).to.be.an('object')
    })

    it('should have methods', () => {
      expect(ScrollSpy.methods).to.be.an('array')
    })
  })

  describe('constructor()', () => {
    it('should work with element', () => {
      const element = document.createElement('div')
      const scrollSpy = new ScrollSpy(element)

      expect(scrollSpy).to.be.an('object')
      expect(scrollSpy.options).to.be.eql(DEFAULTS)
    })

    it('should have options', () => {
      const element = document.createElement('div')
      const scrollSpy = new ScrollSpy(element)

      expect(scrollSpy.options).to.be.an('object')
    })
  })

  describe('jquery constructor', () => {
    it('should works with jquery fn', () => {
      const element = document.createElement('div')
      const $element = $(element)

      expect($element.asScrollSpy()).to.be.equal($element)

      const api = $element.data('scrollSpy')

      expect(api).to.be.an('object')
      expect(api.options).to.be.an('object')
    })
  })

  describe('api call', () => {
    it('should not call bind', () => {
      const $element = $(document.createElement('div')).asScrollSpy()
      expect($element.asScrollSpy('bind')).to.be.undefined
    })

    it('should call destroy', () => {
      const $element = $(document.createElement('div')).asScrollSpy()
      expect($element.asScrollSpy('destroy')).to.be.equal($element)
    })
  })

  describe('initialize()', () => {
    let $element

    beforeEach(() => {
      $element = $(document.createElement('div'))
    })

    it('should trigger ready event', () => {
      let called = 0

      $element.on('scrollSpy:ready', (event, api) => {
        expect(api.is('initialized')).to.be.true
        called++
      })

      $element.asScrollSpy()
      expect(called).to.be.equal(1)
    })
  })

  describe('destroy()', () => {
    let $element
    let api

    beforeEach(() => {
      $element = $(document.createElement('div')).asScrollSpy()
      api = $element.data('scrollSpy')
    })

    it('should trigger destroy event', () => {
      let called = 0

      $element.on('scrollSpy:destroy', (event, api) => {
        expect(api.is('initialized')).to.be.false
        called++
      })

      $element.asScrollSpy('destroy')

      expect(called).to.be.equal(1)
    })
  })

  describe('enable()', () => {
    let $element
    let api

    beforeEach(() => {
      $element = $(document.createElement('div')).asScrollSpy()
      api = $element.data('scrollSpy')
    })

    it('should enable the plugin', () => {
      $element.asScrollSpy('disable')
      $element.asScrollSpy('enable')

      expect(api.is('disabled')).to.be.false
    })

    it('should trigger enable event', () => {
      let called = 0

      $element.on('scrollSpy:enable', (event, api) => {
        expect(api.is('disabled')).to.be.false
        called++
      })

      $element.asScrollSpy('enable')
      expect(called).to.be.equal(1)
    })
  })

  describe('disable()', () => {
    let $element
    let api

    beforeEach(() => {
      $element = $(document.createElement('div')).asScrollSpy()
      api = $element.data('scrollSpy')
    })

    it('should disable the plugin', () => {
      $element.asScrollSpy('disable')

      expect(api.is('disabled')).to.be.true
    })

    it('should trigger disable event', () => {
      let called = 0

      $element.on('scrollSpy:disable', (event, api) => {
        expect(api.is('disabled')).to.be.true
        called++
      })

      $element.asScrollSpy('disable')
      expect(called).to.be.equal(1)
    })
  })
})
