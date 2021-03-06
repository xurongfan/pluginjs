{
  "name": "@pluginjs/{{moduleName}}",
  "description": "A flexible modern {{moduleName}} js plugin.",
  "license": "GPL-3.0",
  "author": "Creation Studio Limited",
  "homepage": "https://pluginjs.com",
  "repository": {
    "url": "git@github.com:pluginjs/pluginjs.git",
    "type": "git"
  },
  "bugs": {
    "url": "https://github.com/pluginjs/pluginjs/issues"
  },
  "version": "0.0.1",
  "category": "ui",
  "main": "dist/{{moduleName}}.common.js",
  "module": "dist/{{moduleName}}.esm.js",
  "umd": "dist/{{moduleName}}.js",
  "unpkg": "dist/{{moduleName}}.js",
  "jsdelivr": "dist/{{moduleName}}.js",
  "source": "src/main.js",
  "style": "dist/{{moduleName}}.css",
  "sass": "src/css/{{moduleName}}.scss",
  "files": [
    "dist",
    "src"
  ],
  "scripts": {
    "build": "npm run build:js & npm run build:scss",
    "build:js": "plugin script build-js",
    "build:md": "plugin script build-md",
    "build:scss": "plugin script build-scss",
    "lint": "npm run lint:js && npm run lint:scss",
    "lint:js": "eslint ./src/**/*.js --fix",
    "lint:scss": "stylelint ./src/**/*.scss --fix",
    "prepublishOnly": "npm run build",
    "test": "jest"
  },
  "dependencies": {
    "@pluginjs/classes": "*",
    "@pluginjs/component": "*",
    "@pluginjs/dom": "*",
    "@pluginjs/events": "*",
    "@pluginjs/is": "*",
    "@pluginjs/decorator": "*"
  },
  "devDependencies": {
    "@babel/core": "^7.6.0",
    "@pluginjs/browserslist-config": "^1.2.10",
    "@pluginjs/cli": "^0.7.13",
    "babel-jest": "*",
    "jest": "*",
    "jest-extended": "*",
    "rename": "^1.0.4",
    "rollup": "*",
    "rollup-plugin-babel": "*",
    "rollup-plugin-commonjs": "*",
    "rollup-plugin-node-resolve": "*",
    "rollup-plugin-terser": "*"
  },
  "engines": {
    "node": ">= 8",
    "npm": ">= 5"
  },
  "jest": {
    "setupTestFrameworkScriptFile": "jest-extended",
    "verbose": true,
    "testURL": "http://localhost",
    "testPathIgnorePatterns": [
      "fixtures"
    ]
  },
  "browserslist": [
    "extends @pluginjs/browserslist-config"
  ]
}
