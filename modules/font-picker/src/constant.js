export const namespace = 'fontPicker'

export const events = {
  READY: 'ready',
  ENABLE: 'enable',
  DISABLE: 'disable',
  DESTROY: 'destroy',
  CHANGE: 'change',
  SEARCHING: 'searching'
}

export const packageClass = {
  PACKAGE: '{namespace}-package',
  PACKAGESWRAP: '{namespace}-package-wrap',
  PACKAGETITLE: '{namespace}-package-title',
  PACKAGEOPEN: '{namespace}-package-open',
  PACKAGEHIDE: '{namespace}-package-hide'
}

export const searchClass = {
  SEARCH: '{namespace}-search',
  SEARCHING: '{namespace}-searching',
  SEARCHED: '{namespace}-searched',
  SEARCHLIST: '{namespace}-search-list',
  SEARCHREADY: '{namespace}-search-ready'
}

export const controllerClass = {
  CONTROLLER: '{namespace}-controller',
  SELECTOR: '{namespace}-selector',
  SELECTORPANEL: '{namespace}-selector-panel',
  MANAGE: '{namespace}-manage'
}

export const baseClass = {
  NAMESPACE: `pj-${namespace}`,
  THEME: '{namespace}--{theme}',
  ELEMENT: '{namespace}',
  TRIGGER: '{namespace}-trigger',
  FONT: '{namespace}-font',
  FONTFOCUS: '{namespace}-font-focus',
  WRAP: '{namespace}-wrap',
  PANEL: '{namespace}-panel',
  ACTIVE: '{namespace}-active',
  DISABLED: '{namespace}-disabled',
  SOURCES: '{namespace}-sources',
  SOURCEICON: '{namespace}-source-icon',
  ACTIVATED: '{namespace}-activated',
  FONTWRAP: '{namespace}-font-wrap'
}

export const emptyClass = {
  EMPTY: '{namespace}-empty',
  EMPTYLINK: '{namespace}-empty-link'
}

export const classes = {
  ...baseClass,
  ...packageClass,
  ...searchClass,
  ...controllerClass,
  ...emptyClass
}

export const methods = ['get', 'set', 'val', 'enable', 'disable', 'destroy']

export const defaults = {
  theme: null,
  locale: 'en',
  // data: null,
  activated: null,
  disabled: false,
  // sources: null,
  manage: true,
  lazyNumber: 12, // [Number][Int]
  delay: 250,
  keyboard: true,
  placeholder: 'choose a font',
  // sourcelist: ['google', 'typekit', 'fontsquirrel', 'custom', 'system'],
  templates: {
    empty() {
      return `<div class='{classes.EMPTY}'>{title}<a href="#" class='{classes.EMPTYLINK}'>{linkTitle}</a>
      </div>`
    },
    trigger() {
      return `<div class={classes.ELEMENT}><span class="pj-dropdown-trigger"></span><div></div></i>
      </div>`
    },
    font() {
      return `<li class="{classes.FONT}" data-value="{fontName}">{fontName}
      </li>`
    },
    categories() {
      return `<div class='pj-dropdown-item {classes.PACKAGE}' data-value='{categoriesName}'><div class={classes.PACKAGETITLE}>{title}<i class='icon-chevron-down'></i></div>
      </div>`
    },
    controller() {
      return `<div class={classes.CONTROLLER}><div class={classes.SELECTOR}><span class="pj-dropdown-trigger"></span><div></div></div>
      </div>`
    },
    search() {
      return `<form class={classes.SEARCH} action="#"><i class='{classes.SEARCH}-icon icon-search'></i><input type="text" name='search' placeholder={placeholder} /><i class="{classes.SEARCH}-close icon-close"></i>
      </form>`
    }
  },
  process(value) {
    if (value && typeof value !== 'undefined') {
      return JSON.stringify(value)
    }
    return ''
  },
  parse(val) {
    return JSON.parse(val.replace(/\'/g, '"'))/* eslint-disable-line */
    // const values = val.split(':');
    // return {
    //   source: values[0],
    //   value: values[1]
    // };
  }
}

export const dependencies = ['dropdown', 'scrollable']

export const translations = {
  en: {
    searchText: 'Search...',
    manage: 'manage',
    activatedFonts: 'activated',
    emptyTitle: 'Befor using font, you need add fonts. ',
    emptyLinkTitle: 'Go add now'
  },
  zh: {
    searchText: '搜索...',
    manage: '管理',
    activatedFonts: '已选字体',
    emptyTitle: '使用字体之前，请先添加。',
    emptyLinkTitle: '现在添加'
  }
}
