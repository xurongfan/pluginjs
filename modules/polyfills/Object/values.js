export default function() {
  /* eslint-disable */
	if(!('values' in Object)) {
		(function () {
			Object.defineProperty(Object, 'values', {
				configurable: true,
				enumerable: false,
				value: function (object) {
					return Object.keys(object).map(function (key) {
						return object[key];
					});
				},
				writable: true
			});
		}());
	}
}