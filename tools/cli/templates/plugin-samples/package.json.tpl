{
	"name": "{{moduleName}}-samples",
	"version": "1.0.0",
	"description": "Simple {{moduleName}} example",
	"main": "index.html",
	"scripts": {
		"start": "parcel index.html --open",
		"build": "parcel build index.html"
	},
	"devDependencies": {
		"babel-core": "^6.26.3",
		"babel-preset-env": "1.7.0",
		"babel-plugin-transform-html-import-to-string": "^0.0.1",
		"parcel-bundler": "^1.6.1"
	},
	"dependencies": {
		"@pluginjs/{{moduleName}}": "^{{moduleVersion}}",
		"@pluginjs/dom": "^0.0.15"
	},
	"license": "UNLICENSED"
}