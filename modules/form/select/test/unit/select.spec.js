import $ from 'jquery'
import '@pluginjs/dropdown'
import Select from '../../src/main'
import { defaults as DEFAULTS } from '../../src/constant'

describe('Select', () => {
  describe('Select()', () => {
    it('should have Select', () => {
      expect(Select).to.be.an('function')
    })

    it('should have defaults', () => {
      expect(Select.defaults).to.be.an('object')
    })

    it('should have events', () => {
      expect(Select.events).to.be.an('object')
    })

    it('should have classes', () => {
      expect(Select.classes).to.be.an('object')
    })

    it('should have methods', () => {
      expect(Select.methods).to.be.an('array')
    })
  })

  describe('constructor()', () => {
    it('should work with element', () => {
      const element = document.createElement('div')
      const select = new Select(element)

      expect(select).to.be.an('object')
      expect(select.options).to.be.an('object')
    })

    it('should have options', () => {
      const element = document.createElement('div')
      const select = new Select(element)

      expect(select.options).to.be.an('object')
      expect(select.options).to.be.eql(DEFAULTS)
    })
  })

  describe('jquery constructor', () => {
    it('should works with jquery fn', () => {
      const element = document.createElement('div')
      const $element = $(element)

      expect($element.asSelect()).to.be.equal($element)

      const api = $element.data('select')

      expect(api).to.be.an('object')
      expect(api.options).to.be.an('object')
    })
  })

  describe('api call', () => {
    it('should not call bind', () => {
      const $element = $(document.createElement('div')).asSelect()
      expect($element.asSelect('bind')).to.be.undefined
    })

    it('should call destroy', () => {
      const $element = $(document.createElement('div')).asSelect()
      expect($element.asSelect('destroy')).to.be.equal($element)
    })
  })

  describe('initialize()', () => {
    let $element

    beforeEach(() => {
      $element = $(document.createElement('div'))
    })

    it('should trigger ready event', () => {
      let called = 0

      $element.on('select:ready', (event, api) => {
        expect(api.is('initialized')).to.be.true
        called++
      })

      $element.asSelect()
      expect(called).to.be.equal(1)
    })
  })

  describe('destroy()', () => {
    let $element
    let api

    beforeEach(() => {
      $element = $(document.createElement('div')).asSelect()
      api = $element.data('select')
    })

    it('should trigger destroy event', () => {
      let called = 0

      $element.on('select:destroy', (event, api) => {
        expect(api.is('initialized')).to.be.false
        called++
      })

      $element.asSelect('destroy')

      expect(called).to.be.equal(1)
    })
  })

  describe('enable()', () => {
    let $element
    let api

    beforeEach(() => {
      $element = $(document.createElement('div')).asSelect()
      api = $element.data('select')
    })

    it('should enable the plugin', () => {
      $element.asSelect('disable')
      $element.asSelect('enable')

      expect(api.is('disabled')).to.be.false
    })

    it('should trigger enable event', () => {
      let called = 0

      $element.on('select:enable', (event, api) => {
        expect(api.is('disabled')).to.be.false
        called++
      })

      $element.asSelect('enable')
      expect(called).to.be.equal(1)
    })
  })

  describe('disable()', () => {
    let $element
    let api

    beforeEach(() => {
      $element = $(document.createElement('div')).asSelect()
      api = $element.data('select')
    })

    it('should disable the plugin', () => {
      $element.asSelect('disable')

      expect(api.is('disabled')).to.be.true
    })

    it('should trigger disable event', () => {
      let called = 0

      $element.on('select:disabled', (event, api) => {
        expect(api.is('disabled')).to.be.true
        called++
      })

      $element.asSelect('disable')
      expect(called).to.be.equal(1)
    })
  })
})
