define('app',['exports', 'aurelia-fetch-client', 'aurelia-framework', 'aurelia-dependency-injection', 'aurelia-i18n', 'aurelia-auth', 'aurelia-event-aggregator', './resources/flash/flash-error-message', './config/app-settings', './services/session'], function (exports, _aureliaFetchClient, _aureliaFramework, _aureliaDependencyInjection, _aureliaI18n, _aureliaAuth, _aureliaEventAggregator, _flashErrorMessage, _appSettings, _session) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.App = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaI18n.I18N, _aureliaAuth.FetchConfig, _aureliaAuth.AuthService, _aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator, _session.Session), _dec(_class = function () {
        function App(i18n, fetchConfig, authService, httpClient, aggregator, session) {
            _classCallCheck(this, App);

            this.i18n = i18n;
            this.fetchConfig = fetchConfig;
            this.authService = authService;
            this.httpClient = httpClient;
            this.ea = aggregator;
            this.session = session;
        }

        App.prototype.activate = function activate() {

            var ea = this.ea;
            var i18n = this.i18n;

            this.httpClient.configure(function (config) {
                config.useStandardConfiguration().withBaseUrl(_appSettings2.default.baseUrl).withDefaults({
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'Fetch'
                    }
                }).withInterceptor({
                    request: function request(_request) {
                        return _request;
                    },
                    response: function response(_response) {
                        return _response;
                    },
                    responseError: function responseError(response) {
                        console.log(response);
                        return new Error(response.statusText);
                    }
                }).withInterceptor({
                    request: function request(_request2) {
                        _request2.headers.append('Authorization', 'Basic ' + localStorage.getItem('aurelia_token'));
                        return _request2;
                    }
                });
            });
        };

        App.prototype.configureRouter = function configureRouter(config, router) {
            config.title = 'Timeflies';

            config.addPipelineStep('authorize', _aureliaAuth.AuthorizeStep);
            var userApp = {
                route: ['app'],
                name: 'home',
                moduleId: 'components/user-app-router',
                nav: false,
                title: 'Home',
                auth: true
            };

            var loggedIn = {
                route: ['loggedIn'],
                name: 'Logged',
                moduleId: 'pages/user/logged-redirect',
                nav: false,
                title: 'Logged',
                auth: true
            };

            config.map([{ route: ['login'], name: 'login', moduleId: 'pages/user/login', nav: false, title: 'Login', authRoute: true }, { route: '', redirect: 'loggedIn' }].concat(userApp, loggedIn));

            this.router = router;
        };

        return App;
    }()) || _class);
});
define('blur-image',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BlurImageCustomAttribute = undefined;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _dec, _class;

	var BlurImageCustomAttribute = exports.BlurImageCustomAttribute = (_dec = (0, _aureliaFramework.inject)(Element), _dec(_class = function () {
		function BlurImageCustomAttribute(element) {
			_classCallCheck(this, BlurImageCustomAttribute);

			this.element = element;
		}

		BlurImageCustomAttribute.prototype.valueChanged = function valueChanged(newImage) {
			var _this = this;

			if (newImage.complete) {
				drawBlur(this.element, newImage);
			} else {
				newImage.onload = function () {
					return drawBlur(_this.element, newImage);
				};
			}
		};

		return BlurImageCustomAttribute;
	}()) || _class);


	var mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];

	var shg_table = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];

	var BLUR_RADIUS = 40;

	function stackBlurCanvasRGBA(canvas, top_x, top_y, width, height, radius) {
		if (isNaN(radius) || radius < 1) return;
		radius |= 0;

		var context = canvas.getContext("2d");
		var imageData;

		try {
			imageData = context.getImageData(top_x, top_y, width, height);
		} catch (e) {
			throw new Error("unable to access image data: " + e);
		}

		var pixels = imageData.data;

		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;

		var div = radius + radius + 1;
		var w4 = width << 2;
		var widthMinus1 = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1 = radius + 1;
		var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

		var stackStart = new BlurStack();
		var stack = stackStart;
		for (i = 1; i < div; i++) {
			stack = stack.next = new BlurStack();
			if (i == radiusPlus1) var stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;

		yw = yi = 0;

		var mul_sum = mul_table[radius];
		var shg_sum = shg_table[radius];

		for (y = 0; y < height; y++) {
			r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

			r_out_sum = radiusPlus1 * (pr = pixels[yi]);
			g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
			a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;

			stack = stackStart;

			for (i = 0; i < radiusPlus1; i++) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}

			for (i = 1; i < radiusPlus1; i++) {
				p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
				r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
				g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
				b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
				a_sum += (stack.a = pa = pixels[p + 3]) * rbs;

				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;

				stack = stack.next;
			}

			stackIn = stackStart;
			stackOut = stackEnd;
			for (x = 0; x < width; x++) {
				pixels[yi + 3] = pa = a_sum * mul_sum >> shg_sum;
				if (pa != 0) {
					pa = 255 / pa;
					pixels[yi] = (r_sum * mul_sum >> shg_sum) * pa;
					pixels[yi + 1] = (g_sum * mul_sum >> shg_sum) * pa;
					pixels[yi + 2] = (b_sum * mul_sum >> shg_sum) * pa;
				} else {
					pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
				}

				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;

				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;

				p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;

				r_in_sum += stackIn.r = pixels[p];
				g_in_sum += stackIn.g = pixels[p + 1];
				b_in_sum += stackIn.b = pixels[p + 2];
				a_in_sum += stackIn.a = pixels[p + 3];

				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				a_sum += a_in_sum;

				stackIn = stackIn.next;

				r_out_sum += pr = stackOut.r;
				g_out_sum += pg = stackOut.g;
				b_out_sum += pb = stackOut.b;
				a_out_sum += pa = stackOut.a;

				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;

				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}

		for (x = 0; x < width; x++) {
			g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

			yi = x << 2;
			r_out_sum = radiusPlus1 * (pr = pixels[yi]);
			g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
			a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;

			stack = stackStart;

			for (i = 0; i < radiusPlus1; i++) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}

			yp = width;

			for (i = 1; i <= radius; i++) {
				yi = yp + x << 2;

				r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
				g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
				b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
				a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;

				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;

				stack = stack.next;

				if (i < heightMinus1) {
					yp += width;
				}
			}

			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for (y = 0; y < height; y++) {
				p = yi << 2;
				pixels[p + 3] = pa = a_sum * mul_sum >> shg_sum;
				if (pa > 0) {
					pa = 255 / pa;
					pixels[p] = (r_sum * mul_sum >> shg_sum) * pa;
					pixels[p + 1] = (g_sum * mul_sum >> shg_sum) * pa;
					pixels[p + 2] = (b_sum * mul_sum >> shg_sum) * pa;
				} else {
					pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
				}

				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;

				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;

				p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;

				r_sum += r_in_sum += stackIn.r = pixels[p];
				g_sum += g_in_sum += stackIn.g = pixels[p + 1];
				b_sum += b_in_sum += stackIn.b = pixels[p + 2];
				a_sum += a_in_sum += stackIn.a = pixels[p + 3];

				stackIn = stackIn.next;

				r_out_sum += pr = stackOut.r;
				g_out_sum += pg = stackOut.g;
				b_out_sum += pb = stackOut.b;
				a_out_sum += pa = stackOut.a;

				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;

				stackOut = stackOut.next;

				yi += width;
			}
		}

		context.putImageData(imageData, top_x, top_y);
	}

	function BlurStack() {
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 0;
		this.next = null;
	}

	function drawBlur(canvas, image) {
		var w = canvas.width;
		var h = canvas.height;
		var canvasContext = canvas.getContext('2d');
		canvasContext.drawImage(image, 0, 0, w, h);
		stackBlurCanvasRGBA(canvas, 0, 0, w, h, BLUR_RADIUS);
	};
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', 'aurelia-fetch-client', 'aurelia-event-aggregator', 'aurelia-i18n', 'semantic', 'semantic-calendar/calendar', 'resources/flash/flash-error-message', 'lib/form/semantic-form-validation-renderer', './config/app-settings', 'pouchdb', 'aurelia-framework', 'aurelia-logging-console'], function (exports, _aureliaFetchClient, _aureliaEventAggregator, _aureliaI18n, _semantic, _calendar, _flashErrorMessage, _semanticFormValidationRenderer, _appSettings, _pouchdb, _aureliaFramework, _aureliaLoggingConsole) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.configure = configure;

    var _semantic2 = _interopRequireDefault(_semantic);

    var _calendar2 = _interopRequireDefault(_calendar);

    var _appSettings2 = _interopRequireDefault(_appSettings);

    var _pouchdb2 = _interopRequireDefault(_pouchdb);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    _aureliaFramework.LogManager.addAppender(new _aureliaLoggingConsole.ConsoleAppender());
    _aureliaFramework.LogManager.setLevel(_aureliaFramework.LogManager.logLevel.debug);

    function configure(aurelia) {
        aurelia.use.standardConfiguration().developmentLogging().plugin("aurelia-dialog").plugin('aurelia-i18n', function (instance) {
            instance.i18next.options.load = 'currentOnly';
            instance.i18next.options.lowerCaseLng = false;
            instance.i18next.options.cleanCode = false;

            return instance.setup({
                lngs: ['en-US', 'km-KH'],
                fallbackLng: _appSettings2.default.default_locale,
                debug: false,
                ns: ['translation'],
                defaultNs: 'translation'
            });
        }).plugin('aurelia-validation');

        configureContainer(aurelia.container);

        aurelia.start().then(function () {
            aurelia.setRoot();
        });
    }

    function configureContainer(container) {
        var http = new _aureliaFetchClient.HttpClient();

        container.registerInstance(_aureliaFetchClient.HttpClient, http);


        container.registerHandler('semantic-form', function (container) {
            return container.get(_semanticFormValidationRenderer.SemanticFormValidationRenderer);
        });
    }
});
define('components/top-bar',['exports', 'aurelia-framework', '../services/session', 'aurelia-i18n', '../services/db-service', 'aurelia-dialog', '../resources/confirmation/confirmation', '../config/app-settings', 'aurelia-router', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _session, _aureliaI18n, _dbService, _aureliaDialog, _confirmation, _appSettings, _aureliaRouter, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TopBar = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _class;

    var TopBar = exports.TopBar = (_dec = (0, _aureliaFramework.inject)(_session.Session, _aureliaI18n.I18N, _dbService.DBService, _aureliaDialog.DialogService, _aureliaEventAggregator.EventAggregator, _aureliaRouter.Router), _dec(_class = function () {
        function TopBar(session, i18n, db, dialogService, ea, router) {
            _classCallCheck(this, TopBar);

            this.title = 'Timeflies';
            this.error = false;

            this.session = session;
            this.i18n = i18n;
            this.db = db;
            this.dialogService = dialogService;
            this.ea = ea;
            this.router = router;
            this.title = this.i18n.tr('site_title');
        }

        TopBar.prototype.logout = function logout() {
            var _this = this;

            if (this.db.hasUnsyncedUpdate()) {
                this.dialogService.open({
                    viewModel: _confirmation.Confirmation,
                    model: this.i18n.tr('unsync-warning')
                }).then(function (result) {
                    if (result.wasCancelled) return;
                    _this.clearData();
                });
                return;
            }

            this.clearData();
        };

        TopBar.prototype.clearData = function clearData() {
            var _this2 = this;

            this.db.removeDBs().then(function () {
                return _this2.session.invalidate();
            });
        };

        TopBar.prototype.attached = function attached() {
            var _this3 = this;

            $('.language-switch').dropdown();

            var me = this;
            this.ea.subscribe('dberr', function (response) {
                _this3.error = true;
            });
        };

        TopBar.prototype.navigateToPlanning = function navigateToPlanning() {
            this.navigate('app/timesheets/planning');
        };

        TopBar.prototype.switchLocale = function switchLocale(locale) {
            this.session.switchLocale(locale);
        };

        _createClass(TopBar, [{
            key: 'isAdmin',
            get: function get() {
                return this.session.userHasRole('admin');
            }
        }, {
            key: 'isSynced',
            get: function get() {
                return !this.db.hasUnsyncedUpdate();
            }
        }]);

        return TopBar;
    }()) || _class);
});
define('components/user-app-router',['exports', 'aurelia-framework', '../services/session', 'aurelia-i18n', '../config/app-settings'], function (exports, _aureliaFramework, _session, _aureliaI18n, _appSettings) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserAppRouter = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var UserAppRouter = exports.UserAppRouter = (_dec = (0, _aureliaFramework.inject)(_session.Session, _aureliaI18n.I18N), _dec(_class = function () {
        function UserAppRouter(session, i18n) {
            _classCallCheck(this, UserAppRouter);

            this.session = session;
            this.i18n = i18n;

            if (!this.session.isStarted()) {
                this.session.start();
            }
        }

        UserAppRouter.prototype.configureRouter = function configureRouter(config, router) {

            var timesheets = {
                route: ['timesheets'],
                name: 'timesheets',
                moduleId: 'pages/timesheets/timesheets-router',
                nav: true,
                title: 'nav.timesheets',
                settings: { 'icon': 'feed' },
                auth: true
            };

            var planning = {
                route: ['planning'],
                name: 'planning',
                moduleId: 'pages/timesheets/planning-router',
                nav: true,
                title: 'nav.planning',
                settings: { 'icon': 'calendar' },
                auth: true
            };

            var adminPlanning = {
                route: ['admin'],
                name: 'admin-planning',
                moduleId: 'pages/admin/admin-router',
                nav: true,
                title: 'nav.planning',
                settings: { 'icon': 'percent' },
                auth: true
            };

            var user = {
                route: ['user'],
                name: 'user',
                moduleId: 'pages/user/user-router',
                nav: false,
                title: 'nav.user',
                settings: { 'icon': 'users' },
                auth: true
            };

            var error = {
                route: ['user'],
                name: 'user',
                moduleId: 'pages/user/user-router',
                nav: false,
                title: 'nav.user',
                settings: { 'icon': 'users' },
                auth: true
            };

            var routes = [timesheets, planning, adminPlanning, user, error];

            config.map(routes);

            this.router = router;
        };

        UserAppRouter.prototype.configureFakeRouter = function configureFakeRouter(config, router) {

            var announcements = {
                route: ['announcements'],
                name: 'announcements',
                moduleId: 'pages/announcements/announcements-router',
                nav: true,
                title: 'nav.announcements',
                settings: { 'icon': 'feed' },
                auth: true
            };

            var organizations = {
                route: ['organizations'],
                name: 'organizations',
                moduleId: 'pages/organizations/organizations-router',
                nav: false,
                title: 'nav.organizations',
                settings: { 'icon': 'users' },
                auth: true
            };

            return [].concat(announcements, organizations);
        };

        UserAppRouter.prototype.configureCommonRouter = function configureCommonRouter(config, router) {

            var announcements = {
                route: ['announcements'],
                name: 'announcements',
                moduleId: 'pages/announcements/announcements-router',
                nav: true,
                title: 'nav.announcements',
                settings: { 'icon': 'feed' },
                auth: true
            };

            var organizations = {
                route: ['organizations'],
                name: 'organizations',
                moduleId: 'pages/organizations/organizations-router',
                nav: false,
                title: 'nav.organizations',
                settings: { 'icon': 'users' },
                auth: true
            };

            var user = {
                route: ['user'],
                name: 'user',
                moduleId: 'pages/user/user-router',
                nav: false,
                title: 'nav.user',
                settings: { 'icon': 'users' },
                auth: true
            };

            return [].concat(announcements, organizations, user);
        };

        UserAppRouter.prototype.configureFORouter = function configureFORouter(config, router) {

            return this.configureCommonRouter(config, router);
        };

        UserAppRouter.prototype.configureMillerRouter = function configureMillerRouter(config, router) {

            var routes = this.configureCommonRouter(config, router);

            var userFilters = {
                route: ['user-filters'],
                name: 'userFilters',
                moduleId: 'pages/user-filters/filters-router',
                nav: true,
                title: 'nav.filters',
                settings: { 'icon': 'filter' },
                auth: true
            };

            var notifications = {
                route: ['notifications'],
                name: 'notifications',
                moduleId: 'pages/notifications/notifications-router',
                nav: true,
                title: 'nav.notifications',
                settings: { 'icon': 'mail outline' },
                auth: true
            };

            return [].concat(routes, [userFilters], notifications);
        };

        UserAppRouter.prototype.configureFFORouter = function configureFFORouter(config, router) {

            return this.configureFORouter(config, router);
        };

        UserAppRouter.prototype.configurePublicRouter = function configurePublicRouter(config, router) {

            return this.configureFORouter(config, router);
        };

        return UserAppRouter;
    }()) || _class);
});
define('config/app-settings',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var settings = {
        remoteUrls: ['http://ruelle1.mykampot.com/', 'http://ruelle2.mykampot.com/'],
        default_locale: 'fr-FR',
        debug: false,

        calendar_text: {
            days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            today: 'Today',
            now: 'Now',
            am: 'AM',
            pm: 'PM'
        }
    };

    settings.debug = true;

    exports.default = settings;
});
define('config/auth-config',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var config = {

        loginUrl: 'https://proacti.cloudant.com/_session',

        tokenName: 'token',

        loginRedirect: '#/loggedIn'

    };

    exports.default = config;
});
define('services/accounting-service',['exports', 'aurelia-framework', './session', 'pouchdb', 'moment', 'aurelia-event-aggregator', 'aurelia-fetch-client', './log', './db-service', 'decimal'], function (exports, _aureliaFramework, _session, _pouchdb, _moment, _aureliaEventAggregator, _aureliaFetchClient, _log, _dbService, _decimal) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AccountingService = undefined;

    var _pouchdb2 = _interopRequireDefault(_pouchdb);

    var _moment2 = _interopRequireDefault(_moment);

    var _decimal2 = _interopRequireDefault(_decimal);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _class;

    var AccountingService = exports.AccountingService = (_dec = (0, _aureliaFramework.inject)(_session.Session, _dbService.DBService, _aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec2 = (0, _aureliaFramework.singleton)(), _dec(_class = _dec2(_class = function () {
        function AccountingService(session, db, http, ea) {
            _classCallCheck(this, AccountingService);

            this.rules = new Map();

            this.session = session;
            this.db = db;
            this.http = http;
            this.ea = ea;
        }

        AccountingService.prototype.retrieveRules = function retrieveRules(accountingRuleEndKey) {
            var _this = this;

            if (accountingRuleEndKey === undefined) {
                return;
            }

            return this.db.view('accounting', 'accounting/rules', accountingRuleEndKey, '', false, true, 1).then(function (rows) {

                var row = rows[0];
                _this.rules.set(row.key, {
                    charges: new _decimal2.default(row.value[0]),
                    provision_cp_brut: new _decimal2.default(row.value[1]),
                    provision_cp_charges: new _decimal2.default(row.value[2]),
                    prime_precarite_brut: new _decimal2.default(row.value[3]),
                    net_payable: new _decimal2.default(row.value[4]),
                    ursaff: new _decimal2.default(row.value[5])
                });
            });
        };

        AccountingService.prototype.provisionAccounts = function provisionAccounts(accountingRuleEndKey, salarySlip) {

            var me = this;
            if (!this.rules.has(accountingRuleEndKey)) {
                return this.retrieveRules(accountingRuleEndKey).then(function () {
                    return me.doProvision(me.rules.get(accountingRuleEndKey), salarySlip);
                });
            }

            return new Promise(function (resolve) {
                return resolve(me.doProvision(me.rules.get(accountingRuleEndKey), salarySlip));
            });
        };

        AccountingService.prototype.doProvision = function doProvision(rules, salarySlip) {

            var accounts = {
                salary: salarySlip.salary,
                charges: salarySlip.salary.mul(rules.charges),
                provisionCPBrut: salarySlip.salary.mul(rules.provision_cp_brut),
                netPayable: salarySlip.salary.mul(rules.net_payable),
                ursaff: salarySlip.salary.mul(rules.ursaff)
            };

            accounts.provisionCPCharges = accounts.charges.mul(rules.provision_cp_charges);
            accounts.provisionCP = accounts.provisionCPBrut.add(accounts.provisionCPCharges);

            if (salarySlip.precarite) {
                accounts.primePrecariteBrut = salarySlip.salary.mul(rules.prime_precarite_brut);
                accounts.primePrecariteCharges = accounts.primePrecariteBrut.mul(rules.provision_cp_charges);
                accounts.provisionPrecarite = accounts.primePrecariteBrut.add(accounts.primePrecariteCharges);
            } else {
                accounts.primePrecariteBrut = new _decimal2.default(0);
                accounts.primePrecariteCharges = new _decimal2.default(0);
                accounts.provisionPrecarite = new _decimal2.default(0);
            }

            salarySlip.accounts = accounts;

            return salarySlip;
        };

        return AccountingService;
    }()) || _class) || _class);
});
define('services/db-service',['exports', 'aurelia-framework', './session', 'pouchdb', 'pouchdb-upsert', 'moment', 'aurelia-event-aggregator', 'aurelia-fetch-client', './log', '../config/app-settings', './sharding-service'], function (exports, _aureliaFramework, _session, _pouchdb, _pouchdbUpsert, _moment, _aureliaEventAggregator, _aureliaFetchClient, _log, _appSettings, _shardingService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DBService = undefined;

    var _pouchdb2 = _interopRequireDefault(_pouchdb);

    var _pouchdbUpsert2 = _interopRequireDefault(_pouchdbUpsert);

    var _moment2 = _interopRequireDefault(_moment);

    var _appSettings2 = _interopRequireDefault(_appSettings);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _class;

    var DBService = exports.DBService = (_dec = (0, _aureliaFramework.inject)(_session.Session, _shardingService.ShardingService, _aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec2 = (0, _aureliaFramework.singleton)(), _dec(_class = _dec2(_class = function () {
        function DBService(session, sharding, http, ea) {
            _classCallCheck(this, DBService);

            this.dbs = new Map();
            this.syncHandlers = new Map();
            this.lastUpdates = new Map();
            this.lastSyncs = new Map();

            this.session = session;
            this.sharding = sharding;
            this.http = http;
            this.ea = ea;

            this.restoreCheckpoints();

            _pouchdb2.default.plugin(_pouchdbUpsert2.default);
        }

        DBService.prototype.getDB = function getDB(dbName) {

            if (!this.dbs.has(dbName)) {
                var db = this.setupDB(dbName);
                this.dbs.set(dbName, db);
            }
            return this.dbs.get(dbName);
        };

        DBService.prototype.setupDB = function setupDB(dbName) {

            var me = this;

            var db = new _pouchdb2.default(dbName, { skip_setup: true });

            this.addUpdateCheckpoint(dbName);

            var handler = db.sync(this.sharding.getRemoteUrl() + dbName, me.getSyncOptions()).on('change', function (change) {

                me.addSyncCheckpoint(dbName);

                if (change.direction === 'pull') {
                    me.ea.publish('dbsync', { dbName: dbName });
                }
            }).on('paused', function (err) {
                me.addSyncCheckpoint(dbName);
            }).on('error', function (err) {
                me.handleSyncError(db, err);
            });

            this.syncHandlers.set(dbName, handler);

            return db;
        };

        DBService.prototype.getSyncOptions = function getSyncOptions() {
            return {
                live: true,
                retry: true,
                ajax: {
                    "headers": {
                        "Authorization": "Basic " + localStorage.getItem('aurelia_token')
                    }
                }
            };
        };

        DBService.prototype.handleSyncError = function handleSyncError(db, err) {
            if (err.status === 403 || err.status === 404) {

                this.syncHandlers.get(db.name).cancel();
                this.syncHandlers.delete(db.name);
                db.destroy();
                this.dbs.delete(db.name);
            } else if (err.status === 401) {
                this.session.invalidate();
            } else {
                this.ea.publish('dberr', { dbName: db.name, err: err });
            }
        };

        DBService.prototype.handleUpdateError = function handleUpdateError(db, doc, err) {
            var _this = this;

            if (err.status === 409 && err.name === 'conflict') {
                db.upsert(doc._id, function () {
                    return doc;
                }).catch(function (err) {
                    _log.log.error(err);
                    _this.ea.publish('dberr', { dbName: db.name, doc: doc, err: err });
                });
            }
        };

        DBService.prototype.removeDBs = function removeDBs() {
            var me = this;
            var promises = [];

            this.dbs.forEach(function (db, dbName) {
                if (me.syncHandlers.has(dbName)) {
                    me.syncHandlers.get(dbName).cancel();
                    me.syncHandlers.delete(dbName);
                }
                me.dbs.delete(dbName);
                promises.push(db.destroy());
            });

            window.indexedDB.webkitGetDatabaseNames().onsuccess = function (event) {
                Array.prototype.forEach.call(event.target.result, indexedDB.deleteDatabase.bind(indexedDB));
            };

            localStorage.removeItem('last-updates');
            localStorage.removeItem('last-syncs');
            this.lastUpdates.clear();
            this.lastSyncs.clear();

            return Promise.all(promises);
        };

        DBService.prototype.listUsers = function listUsers() {
            var _this2 = this;

            if (!this.dbs.has('staff')) {
                var _db = new _pouchdb2.default('staff', { skip_setup: true });
                this.dbs.set('staff', _db);
            }

            var db = this.dbs.get('staff');

            var me = this;
            var promises = [];

            return this.http.fetch(this.sharding.getRemoteUrl() + '_users/_all_docs?include_docs=true').then(function (response) {
                return response.json();
            }).then(function (users) {

                return Promise.all(users.rows.filter(function (user) {
                    return user.id.match(/^org\.couchdb\.user/);
                }).map(function (user) {

                    var localUser = {
                        id: user.doc._id,
                        doc: {
                            _id: user.doc._id,
                            name: user.doc.name,
                            originRev: user.doc._rev,
                            roles: user.doc.roles
                        }
                    };

                    return _this2.createOrReplaceLocalUser(localUser);
                }));
            }).then(function (filteredUsers) {
                return filteredUsers;
            }).catch(function (err) {
                return db.allDocs({ include_docs: true }).then(function (result) {
                    return result.rows;
                }).catch(function (err) {
                    _log.log.error(err);
                });
            });
        };

        DBService.prototype.createOrReplaceLocalUser = function createOrReplaceLocalUser(user) {

            var db = this.dbs.get('staff');

            var me = this;

            return db.get(user.id).then(function (doc) {

                if (doc.originRev === user.doc.originRev) {
                    return new Promise(function (resolve) {
                        return resolve(user);
                    });
                }

                user.doc._rev = doc._rev;
                return db.put(user.doc).then(function () {
                    return user;
                }).catch(function (err) {
                    return me.handleUpdateError(db, user.doc, err);
                });
            }).then(function (r) {
                return user;
            }).catch(function (err) {
                if (err.status === 404) {
                    return db.put(user.doc).then(function () {
                        return user;
                    }).catch(function (err) {
                        return me.handleUpdateError(db, user.doc, err);
                    });
                }
            });
        };

        DBService.prototype.list = function list(dbName) {
            var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var descending = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


            var options = {
                include_docs: true
            };
            if (limit) {
                options.limit = limit;
            }
            if (descending) {
                options.descending = descending;
            }

            var firstRequestOptions = Object.assign({}, options);
            var secondRequestOptions = Object.assign({}, options);

            if (descending) {
                firstRequestOptions.endkey = '_design\uFFFF';
                secondRequestOptions.startkey = '_design';
            } else {
                firstRequestOptions.endkey = '_design';
                secondRequestOptions.startkey = '_design\uFFFF';
            }

            var me = this;

            return this.getDB(dbName).allDocs(firstRequestOptions).then(function (results) {

                return me.getDB(dbName).allDocs(secondRequestOptions).then(function (endResults) {

                    return [].concat(results.rows, endResults.rows);
                }).catch(function (err) {
                    _log.log.error(err);
                });
            }).catch(function (err) {
                _log.log.error(err);
            });
        };

        DBService.prototype.get = function get(dbName, id) {

            return this.getDB(dbName).get(id, {}).then(function (result) {
                return result;
            }).catch(function (err) {
                _log.log.error(err);
            });
        };

        DBService.prototype.view = function view(dbName, viewName) {
            var startKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
            var endKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
            var group = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
            var descending = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
            var limit = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;


            var options = {
                start_key: startKey,
                end_key: endKey,
                group: group,
                descending: descending
            };

            if (limit > 0) {
                options.limit = limit;
            }

            return this.getDB(dbName).query(viewName, options).then(function (response) {
                return response.rows;
            }).catch(function (err) {
                _log.log.error(err);
            });
        };

        DBService.prototype.save = function save(dbName, doc) {

            this.addUpdateCheckpoint(dbName);

            var db = this.getDB(dbName);
            var me = this;

            return db.put(doc).then(function (response) {
                return response;
            }).catch(function (err) {
                me.handleUpdateError(db, doc, err);
            });
        };

        DBService.prototype.create = function create(dbName, doc) {

            this.addUpdateCheckpoint(dbName);

            var db = this.getDB(dbName);
            var me = this;

            return db.post(doc).then(function (response) {
                return response;
            }).catch(function (err) {
                me.handleUpdateError(db, doc, err);
            });
        };

        DBService.prototype.addUpdateCheckpoint = function addUpdateCheckpoint(dbName) {

            this.lastUpdates.set(dbName, Date.now());

            var storage = [];
            this.lastUpdates.forEach(function (value, key) {
                return storage = [].concat(storage, [[key, value]]);
            });
            localStorage.setItem('last-updates', JSON.stringify(storage));
        };

        DBService.prototype.addSyncCheckpoint = function addSyncCheckpoint(dbName) {
            this.lastSyncs.set(dbName, Date.now());

            var storage = [];
            this.lastSyncs.forEach(function (value, key) {
                return storage = [].concat(storage, [[key, value]]);
            });
            localStorage.setItem('last-syncs', JSON.stringify(storage));
        };

        DBService.prototype.restoreCheckpoints = function restoreCheckpoints() {
            if (localStorage.getItem('last-updates') !== null) {
                this.lastUpdates = new Map(JSON.parse(localStorage.getItem('last-updates')));
            }
            if (localStorage.getItem('last-syncs') !== null) {
                this.lastSyncs = new Map(JSON.parse(localStorage.getItem('last-syncs')));
            }
        };

        DBService.prototype.hasUnsyncedUpdate = function hasUnsyncedUpdate() {

            var hasUnsynced = false;
            var me = this;

            this.lastUpdates.forEach(function (lastUpdate, dbName) {

                if (!me.lastSyncs.has(dbName) || me.lastUpdates.get(dbName) > me.lastSyncs.get(dbName)) {
                    hasUnsynced = true;
                }
            });

            return hasUnsynced;
        };

        return DBService;
    }()) || _class) || _class);
});
define('services/http-service',['exports', 'aurelia-framework', './session', 'pouchdb', 'moment', 'aurelia-event-aggregator', 'aurelia-fetch-client', '../config/app-settings'], function (exports, _aureliaFramework, _session, _pouchdb, _moment, _aureliaEventAggregator, _aureliaFetchClient, _appSettings) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.HTTPService = undefined;

    var _pouchdb2 = _interopRequireDefault(_pouchdb);

    var _moment2 = _interopRequireDefault(_moment);

    var _appSettings2 = _interopRequireDefault(_appSettings);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _class;

    var HTTPService = exports.HTTPService = (_dec = (0, _aureliaFramework.inject)(_session.Session, _aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec2 = (0, _aureliaFramework.singleton)(), _dec(_class = _dec2(_class = function () {
        function HTTPService(session, http, ea) {
            _classCallCheck(this, HTTPService);

            this.session = session;
            this.http = http;
            this.ea = ea;

            this.configure();
        }

        HTTPService.prototype.configure = function configure() {
            this.http.configure(function (config) {
                config.useStandardConfiguration().withBaseUrl(_appSettings2.default.baseUrl).withDefaults({
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'Fetch'
                    }
                }).withInterceptor({
                    request: function request(_request) {
                        return _request;
                    },
                    response: function response(_response) {
                        return _response;
                    },
                    responseError: function responseError(response) {
                        console.log(response);
                        ea.publish(new FlashErrorMessage(i18n.tr(response.statusText)));
                        return new Error(response.statusText);
                    }
                }).withInterceptor({
                    request: function request(_request2) {
                        var authHeader = fakeAuthService.getAuthHeaderValue(_request2.url);
                        _request2.headers.append('Authorization', authHeader);
                        return _request2;
                    }
                });
            });
        };

        HTTPService.prototype.fetch = function fetch(url) {
            return this.http.fetch(url).then(function (response) {
                return response.json();
            }).then(function (users) {
                return users;
            });
        };

        return HTTPService;
    }()) || _class) || _class);
});
define('services/log',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.log = undefined;
  var log = exports.log = _aureliaFramework.LogManager.getLogger('timesheet');
});
define('services/route-loader',['exports', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaFetchClient) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RouteLoader = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _class;

    var RouteLoader = exports.RouteLoader = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec2 = (0, _aureliaFramework.singleton)(), _dec(_class = _dec2(_class = function () {
        function RouteLoader(httpClient) {
            _classCallCheck(this, RouteLoader);

            this.cache = new Map();

            this.http = httpClient;
        }

        RouteLoader.prototype.invalidateCache = function invalidateCache() {
            this.cache.clear();
        };

        RouteLoader.prototype.load = function load(route, parentRoute, parentId, bypassCache) {

            if (!route) {
                return new Promise(function (resolve) {});
            }

            if (parentRoute && !parentId) {
                return new Promise(function (resolve) {});
            }

            if (parentId) {
                if (Array.isArray(parentId)) {
                    route = route + '?';
                    parentId.forEach(function (value) {
                        route += parentRoute + '[]=' + value + '&';
                    });
                } else {
                    route = parentRoute + '/' + parentId + '/' + route;
                }
            }

            var loader = this;

            if (!bypassCache && this.cache.has(route)) {
                return new Promise(function (resolve) {
                    resolve(loader.cache.get(route));
                });
            }

            return this.http.fetch(route).then(function (response) {
                return response.json();
            }).then(function (entities) {
                loader.cache.set(route, entities);
                return entities;
            });
        };

        return RouteLoader;
    }()) || _class) || _class);
});
define('services/session',['exports', 'aurelia-framework', './route-loader', 'aurelia-router', 'aurelia-auth', 'aurelia-i18n', '../config/app-settings', 'aurelia-fetch-client', 'pouchdb', './log', './sharding-service'], function (exports, _aureliaFramework, _routeLoader, _aureliaRouter, _aureliaAuth, _aureliaI18n, _appSettings, _aureliaFetchClient, _pouchdb, _log, _shardingService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Session = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    var _pouchdb2 = _interopRequireDefault(_pouchdb);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _class;

    var Session = exports.Session = (_dec = (0, _aureliaFramework.singleton)(), _dec2 = (0, _aureliaFramework.inject)(_routeLoader.RouteLoader, _aureliaRouter.Router, _aureliaAuth.AuthService, _shardingService.ShardingService, _aureliaI18n.I18N, _aureliaFetchClient.HttpClient), _dec(_class = _dec2(_class = function () {
        function Session(loader, router, auth, sharding, i18n, http) {
            _classCallCheck(this, Session);

            this.loader = loader;
            this.router = router;
            this.auth = auth;
            this.sharding = sharding;
            this.i18n = i18n;
            this.http = http;

            this.loadFromStorage();
            this.locale = this.getLocale();
            this.i18n.setLocale(this.locale);

            this.started = false;

            this.setBaseUrl();
        }

        Session.prototype.start = function start() {
            var me = this;

            return this.loadUserFromBackend().then(function () {

                me.started = true;
                return true;
            }).catch(function (err) {
                console.log(err);
            });
        };

        Session.prototype.setBaseUrl = function setBaseUrl() {
            _appSettings2.default.baseUrl = _appSettings2.default.rootUrl + _appSettings2.default.envUrlPrefix + '/' + this.locale + '/' + 'api/';
        };

        Session.prototype.isStarted = function isStarted() {
            return this.started;
        };

        Session.prototype.loadFromStorage = function loadFromStorage() {
            if (localStorage.getItem('session') !== null) {
                var session = JSON.parse(localStorage.getItem('session'));
                this.user = session.user;
                this.locale = session.locale;
            }
        };

        Session.prototype.persistToStorage = function persistToStorage() {
            var session = {
                'user': this.user,
                'locale': this.locale
            };

            localStorage.setItem('session', JSON.stringify(session));
        };

        Session.prototype.setUser = function setUser(user) {
            this.user = user;
            this.persistToStorage();
        };

        Session.prototype.getUser = function getUser() {
            return this.user;
        };

        Session.prototype.userHasRole = function userHasRole(role) {
            return this.user !== undefined && this.user !== null && this.user.roles.includes(role);
        };

        Session.prototype.loadUserFromBackend = function loadUserFromBackend() {

            if (localStorage.getItem('aurelia_token') === null) {
                return new Promise(function (resolve) {});
            }

            var userInfo = atob(localStorage.getItem('aurelia_token')).split(':');
            var username = userInfo[0];
            var password = userInfo[1];

            var db = new _pouchdb2.default(this.sharding.getRemoteUrl() + '_users', {
                skipSetup: true,
                auth: {
                    "username": username,
                    "password": password
                },
                ajax: {
                    "withCredentials": false
                }
            });

            var me = this;

            return db.get('org.couchdb.user:' + username, {
                include_docs: true
            }).then(function (result) {
                me.user = result;
                me.persistToStorage();
                return result;
            }).catch(function (err) {
                _log.log.error(err);
            });
        };

        Session.prototype.invalidate = function invalidate() {
            this.user = null;
            localStorage.setItem('session', '{}');
            this.auth.logout('#/login');
        };

        Session.prototype.getLocale = function getLocale() {

            if (this.locale !== undefined) {
                return this.locale;
            }

            if (this.user !== undefined && this.user.preferred_locale !== undefined) {
                return this.user.preferred_locale;
            }

            return _appSettings2.default.default_locale;
        };

        Session.prototype.switchLocale = function switchLocale(locale) {
            this.locale = locale;
            this.setBaseUrl();
            this.i18n.setLocale(this.locale);
            this.http.configure(function (config) {
                config.withBaseUrl(_appSettings2.default.baseUrl);
            });
            this.persistToStorage();

            this.loader.invalidateCache();

            this.router.navigate(this.router.history.fragment, { replace: true });
        };

        Session.prototype.getToken = function getToken() {
            return localStorage.getItem('aurelia_token');
        };

        Session.prototype.isGranted = function isGranted(role) {
            if (this.user === undefined || this.user === null) {
                return false;
            }
            return this.user.roles.includes(role);
        };

        return Session;
    }()) || _class) || _class);
});
define('lib/form/semantic-form-validation-renderer',['exports', 'aurelia-dependency-injection', 'aurelia-validation'], function (exports, _aureliaDependencyInjection, _aureliaValidation) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SemanticFormValidationRenderer = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var SemanticFormValidationRenderer = exports.SemanticFormValidationRenderer = (_dec = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class = function () {
        function SemanticFormValidationRenderer(boundaryElement) {
            _classCallCheck(this, SemanticFormValidationRenderer);

            this.boundaryElement = boundaryElement;
        }

        SemanticFormValidationRenderer.prototype.render = function render(instruction) {
            for (var _iterator = instruction.unrender, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref2;

                if (_isArray) {
                    if (_i >= _iterator.length) break;
                    _ref2 = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) break;
                    _ref2 = _i.value;
                }

                var _ref5 = _ref2;
                var result = _ref5.result,
                    elements = _ref5.elements;

                for (var _iterator3 = elements, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
                    var _ref6;

                    if (_isArray3) {
                        if (_i3 >= _iterator3.length) break;
                        _ref6 = _iterator3[_i3++];
                    } else {
                        _i3 = _iterator3.next();
                        if (_i3.done) break;
                        _ref6 = _i3.value;
                    }

                    var element = _ref6;

                    this.remove(element, result);
                }
            }

            for (var _iterator2 = instruction.render, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                var _ref4;

                if (_isArray2) {
                    if (_i2 >= _iterator2.length) break;
                    _ref4 = _iterator2[_i2++];
                } else {
                    _i2 = _iterator2.next();
                    if (_i2.done) break;
                    _ref4 = _i2.value;
                }

                var _ref7 = _ref4;
                var result = _ref7.result,
                    elements = _ref7.elements;

                for (var _iterator4 = elements, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
                    var _ref8;

                    if (_isArray4) {
                        if (_i4 >= _iterator4.length) break;
                        _ref8 = _iterator4[_i4++];
                    } else {
                        _i4 = _iterator4.next();
                        if (_i4.done) break;
                        _ref8 = _i4.value;
                    }

                    var _element = _ref8;

                    this.add(_element, result);
                }
            }
        };

        SemanticFormValidationRenderer.prototype.add = function add(target, result) {

            if (result.valid) {
                return;
            }

            target.errors = target.errors || new Map();
            target.errors.set(result);

            var field = target.querySelector('.field') || target.closest('.field');
            field.classList.add('error');

            var message = document.createElement('div');
            message.classList.add('ui');
            message.classList.add('error');
            message.classList.add('message');
            message.classList.add('visible');
            message.classList.add('validation-error');
            message.textContent = result.message;
            message.error = result;
            field.appendChild(message);
        };

        SemanticFormValidationRenderer.prototype.remove = function remove(target, result) {

            if (result.valid) {
                return;
            }

            target.errors.delete(result);

            var field = target.querySelector('.field') || target.closest('.field');
            field.classList.remove('error');

            var messages = field.querySelectorAll('.validation-error');
            var i = messages.length;
            while (i--) {
                var message = messages[i];
                if (message.error !== result) {
                    continue;
                }
                message.result = null;
                message.remove();
            }
        };

        return SemanticFormValidationRenderer;
    }()) || _class);

    (function (ELEMENT) {
        ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;

        ELEMENT.closest = ELEMENT.closest || function closest(selector) {
            var element = this;

            while (element) {
                if (element.matches(selector)) {
                    break;
                }

                element = element.parentElement;
            }

            return element;
        };
    })(Element.prototype);
});
define('pages/admin/admin-panel',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AdminPanel = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var AdminPanel = exports.AdminPanel = function () {
        function AdminPanel() {
            _classCallCheck(this, AdminPanel);
        }

        AdminPanel.prototype.attached = function attached() {
            $('.admin.panel.menu .item').tab({
                'onLoad': function onLoad(tab, param) {
                    document.querySelector('admin-reports').au.controller.viewModel.refresh();
                }
            });
        };

        AdminPanel.prototype.activate = function activate(params) {
            this.month = params.month;
        };

        return AdminPanel;
    }();
});
define('pages/admin/admin-report',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AdminReport = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _desc, _value, _class, _descriptor, _descriptor2;

    var AdminReport = exports.AdminReport = (_class = function AdminReport() {
        _classCallCheck(this, AdminReport);

        _initDefineProp(this, 'entries', _descriptor, this);

        _initDefineProp(this, 'totals', _descriptor2, this);
    }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'entries', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'totals', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class);
});
define('pages/admin/admin-reports',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './admin-router', '../../services/session', '../../services/db-service', '../../services/accounting-service', '../../config/app-settings', 'moment', 'aurelia-i18n', 'decimal', '../../services/log'], function (exports, _aureliaFramework, _aureliaEventAggregator, _adminRouter, _session, _dbService, _accountingService, _appSettings, _moment, _aureliaI18n, _decimal, _log) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AdminReports = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    var _moment2 = _interopRequireDefault(_moment);

    var _decimal2 = _interopRequireDefault(_decimal);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor;

    var AdminReports = exports.AdminReports = (_dec = (0, _aureliaFramework.inject)(_session.Session, _dbService.DBService, _accountingService.AccountingService, _aureliaI18n.I18N, _aureliaEventAggregator.EventAggregator, _aureliaFramework.TaskQueue, _adminRouter.AdminRouter), _dec(_class = (_class2 = function () {
        function AdminReports(session, db, accounting, i18n, ea, taskQueue, router) {
            _classCallCheck(this, AdminReports);

            _initDefineProp(this, 'month', _descriptor, this);

            this.users = new Map();
            this.allocations = new Map();
            this.allocationUserReports = new Map();
            this.allocationReports = [];
            this.showMonthAggregate = false;

            this.session = session;
            this.db = db;
            this.accounting = accounting;
            this.i18n = i18n;
            this.ea = ea;
            this.router = router;
            this.taskQueue = taskQueue;
        }

        AdminReports.prototype.attached = function attached() {
            var me = this;
            $('#showMonthAggregate').checkbox({
                onChange: function onChange() {
                    me.showMonthAggregate = $('#showMonthAggregate').hasClass('checked');
                }
            });

            this.loadReports();

            this.ea.subscribe('dbsync', function (response) {
                if (response.dbName.match(/^timesheet\-/)) {
                    me.loadReports();
                }
            });
        };

        AdminReports.prototype.refresh = function refresh() {
            this.loadReports();
        };

        AdminReports.prototype.getNextMonth = function getNextMonth() {

            var monthArr = this.month.split('-');
            if (parseInt(monthArr[1]) === 12) {
                return parseInt(monthArr[0]) + 1 + '-01';
            }

            var next = parseInt(monthArr[1]) + 1;

            return monthArr[0] + '-' + (next < 10 ? '0' : '') + next;
        };

        AdminReports.prototype.loadReports = function loadReports() {
            var _this = this;

            this.retrieveUsers().then(function () {
                _this.retrieveAllocations().then(function () {
                    _this.retrieveAllocationReports().then(function () {
                        _this.taskQueue.queueMicroTask(function () {
                            _this.generateUsersExportLinks();
                            _this.aggregateReports();
                        });
                    });
                });
            });
        };

        AdminReports.prototype.retrieveUsers = function retrieveUsers() {
            var me = this;

            return this.db.listUsers().then(function (response) {
                response.forEach(function (user) {
                    me.users.set(user.doc.name, user);
                });
                return new Promise(function (resolve) {
                    resolve();
                });
            });
        };

        AdminReports.prototype.retrieveAllocations = function retrieveAllocations() {
            var me = this;
            return this.db.list('allocation').then(function (response) {

                if (response) {

                    response.forEach(function (allocation) {
                        me.allocations.set(allocation.id, allocation.doc.name);
                    });
                }

                return new Promise(function (resolve) {
                    resolve();
                });
            });
        };

        AdminReports.prototype.retrieveAllocationReports = function retrieveAllocationReports() {

            var me = this;

            var promises = [];
            this.users.forEach(function (user) {

                promises.push(me.db.view('timesheet-' + user.doc.name, 'allocations/stats', me.month, me.getNextMonth(), false).then(function (entries) {

                    if (entries === undefined) {
                        return new Promise(function (resolve) {
                            return resolve([]);
                        });
                    }

                    var allocationUserReports = [];
                    var reportsPromises = [];

                    return Promise.all(entries.map(function (entry) {

                        var allocation = entry.key.split(':')[1];

                        var report = {
                            allocation: allocation,
                            allocationName: me.allocations.get(allocation),
                            ratio: new _decimal2.default(parseFloat(entry.value[0])).mul(100),
                            duration: new _decimal2.default(entry.value[1]),
                            salary: new _decimal2.default(entry.value[2]).mul(parseFloat(entry.value[0])),
                            precarite: entry.value[3]
                        };

                        return me.accounting.provisionAccounts(me.accountingRuleEndKey, report);
                    }));
                }).then(function (allocationUserReports) {

                    me.allocationUserReports.set(user.doc.name, me.groupReportsByAllocation(allocationUserReports));
                }));
            });

            return Promise.all(promises);
        };

        AdminReports.prototype.groupReportsByAllocation = function groupReportsByAllocation(reports) {

            var totals = {};

            var nbrReports = 0;

            var grouped = new Map();
            for (var reportIdx in reports) {

                var report = Object.assign({}, reports[reportIdx]);

                if (!grouped.has(report.allocation)) {

                    grouped.set(report.allocation, Object.assign({}, report));
                    totals = this.addReportsData(totals, report);
                    continue;
                }

                var current = grouped.get(report.allocation);

                grouped.set(report.allocation, this.addReportsData(current, report));
                totals = this.addReportsData(totals, report);
            }

            return {
                entries: Array.from(grouped.values()),
                totals: totals
            };
        };

        AdminReports.prototype.addReportsData = function addReportsData(target, source) {

            var result = {};

            for (var _iterator = Object.getOwnPropertyNames(source), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;

                if (_isArray) {
                    if (_i >= _iterator.length) break;
                    _ref = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) break;
                    _ref = _i.value;
                }

                var prop = _ref;


                if (_typeof(source[prop]) === 'object') {
                    if (source[prop] instanceof _decimal2.default) {
                        result[prop] = new _decimal2.default(0);
                        if (target[prop] === undefined) {
                            target[prop] = new _decimal2.default(0);
                        }
                        result[prop] = target[prop].add(source[prop]);
                    }
                }
            }

            if (source.accounts !== undefined) {
                result.accounts = {};
                if (target.accounts === undefined) {
                    target.accounts = {};
                }
                result.accounts = this.addReportsData(target.accounts, source.accounts);
            }

            return result;
        };

        AdminReports.prototype.aggregateReports = function aggregateReports() {

            var allReports = [];
            var nbrReports = 0;

            for (var _iterator2 = this.allocationUserReports.values(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                var _ref2;

                if (_isArray2) {
                    if (_i2 >= _iterator2.length) break;
                    _ref2 = _iterator2[_i2++];
                } else {
                    _i2 = _iterator2.next();
                    if (_i2.done) break;
                    _ref2 = _i2.value;
                }

                var allocationUserReportObjects = _ref2;

                allReports = [].concat(allReports, allocationUserReportObjects.entries);
                nbrReports++;
            }
            this.allocationReports = this.groupReportsByAllocation(allReports);

            for (var _iterator3 = this.allocationReports.entries, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
                var _ref3;

                if (_isArray3) {
                    if (_i3 >= _iterator3.length) break;
                    _ref3 = _iterator3[_i3++];
                } else {
                    _i3 = _iterator3.next();
                    if (_i3.done) break;
                    _ref3 = _i3.value;
                }

                var entry = _ref3;

                entry.ratio = entry.ratio.div(nbrReports);
            }
            if (this.allocationReports.totals.ratio !== undefined) {
                this.allocationReports.totals.ratio = this.allocationReports.totals.ratio.div(nbrReports);
            }

            this.generateExportLink();
        };

        AdminReports.prototype.generateUsersExportLinks = function generateUsersExportLinks() {

            var me = this;
            this.users.forEach(function (user) {
                if (me.allocationUserReports.has(user.doc.name)) {
                    me.generateExportLink(user.doc.name);
                }
            });
        };

        AdminReports.prototype.generateExportLink = function generateExportLink() {
            var user = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;


            var me = this;
            var csvContent = this.month + '\n' + this.i18n.tr('allocation') + ';' + this.i18n.tr('ratio') + ';' + this.i18n.tr('duration') + ';' + this.i18n.tr('salary') + ';' + this.i18n.tr('charges') + ';' + this.i18n.tr('provisionCP-brut') + ';' + this.i18n.tr('provisionCP-charges') + ';' + this.i18n.tr('primeprecarite-brut') + ';' + this.i18n.tr('primeprecarite-charges') + '\n';

            var reports = this.allocationReports;
            var fileName = me.month + '.csv';
            var lnk = document.getElementById('csv-export-link');
            if (user !== null) {
                reports = this.allocationUserReports.get(user);
                fileName = user + "-" + me.month + '.csv';
                lnk = document.getElementById(user + '-csv-export-link');
            }

            if (lnk === null || reports.entries.length === 0) {
                return;
            }

            for (var reportIdx in reports.entries) {
                var report = reports.entries[reportIdx];
                csvContent += report.allocationName + ';' + report.ratio + ';' + report.duration + ';' + report.salary + ';' + report.accounts.charges + ';' + report.accounts.provisionCPBrut + ';' + report.accounts.provisionCPCharges + ';' + report.accounts.primePrecariteBrut + ';' + report.accounts.primePrecariteCharges + '\n';
            };

            csvContent += ';' + reports.totals.ratio + ';' + reports.totals.duration + ';' + reports.totals.salary + ';' + reports.totals.accounts.charges + ';' + reports.totals.accounts.provisionCPBrut + ';' + reports.totals.accounts.provisionCPCharges + ';' + reports.totals.accounts.primePrecariteBrut + ';' + reports.totals.accounts.primePrecariteCharges + '\n' + this.i18n.tr('netpayable') + ';' + reports.totals.accounts.netPayable + '\n' + this.i18n.tr('ursaaf') + ';' + reports.totals.accounts.ursaff + '\n' + this.i18n.tr('provisionCP') + ';' + reports.totals.accounts.provisionCP + '\n' + this.i18n.tr('provisionprecarite') + ';' + reports.totals.accounts.provisionPrecarite + '\n';

            lnk.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvContent));
            lnk.setAttribute('download', fileName);
        };

        return AdminReports;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'month', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class2)) || _class);
});
define('pages/admin/admin-router',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaRouter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AdminRouter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var AdminRouter = exports.AdminRouter = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = function () {
        function AdminRouter(router) {
            _classCallCheck(this, AdminRouter);

            this.router = router;
        }

        AdminRouter.prototype.configureRouter = function configureRouter(config) {

            config.map([{
                route: ['/', 'planning'],
                name: 'planning',
                moduleId: './planning',
                nav: false,
                title: 'Planning',
                auth: true
            }, {
                route: ':month',
                name: 'panel',
                moduleId: './admin-panel',
                nav: false,
                title: 'Timesheet',
                auth: true
            }]);
        };

        AdminRouter.prototype.navigateToRoute = function navigateToRoute(route, params) {
            this.router.navigate(route);
        };

        return AdminRouter;
    }()) || _class);
});
define('pages/admin/planning',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-event-aggregator', './admin-router', '../../services/session', '../../services/db-service', '../../config/app-settings', 'moment', 'aurelia-i18n'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaEventAggregator, _adminRouter, _session, _dbService, _appSettings, _moment, _aureliaI18n) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Planning = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Planning = exports.Planning = (_dec = (0, _aureliaFramework.inject)(Element, _session.Session, _dbService.DBService, _aureliaI18n.I18N, _adminRouter.AdminRouter), _dec(_class = function () {
        function Planning(element, session, db, i18n, router) {
            _classCallCheck(this, Planning);

            this.element = element;
            this.session = session;
            this.db = db;
            this.i18n = i18n;
            this.router = router;
        }

        Planning.prototype.attached = function attached() {
            var me = this;
            $(this.element).find('.ui.calendar').calendar({
                type: 'month',
                inline: true,
                text: _appSettings2.default.calendar_text,
                onChange: function onChange(date, text) {
                    var timesheetId = (0, _moment2.default)(date).format('YYYY-MM');
                    me.router.navigateToRoute('admin/' + timesheetId);
                }
            });
        };

        return Planning;
    }()) || _class);
});
define('pages/admin/user-timesheet',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './admin-router', '../../services/session', '../../services/db-service', '../../config/app-settings', 'moment', 'aurelia-i18n', 'aurelia-validation', 'decimal'], function (exports, _aureliaFramework, _aureliaEventAggregator, _adminRouter, _session, _dbService, _appSettings, _moment, _aureliaI18n, _aureliaValidation, _decimal) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserTimesheet = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    var _moment2 = _interopRequireDefault(_moment);

    var _decimal2 = _interopRequireDefault(_decimal);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

    var UserTimesheet = exports.UserTimesheet = (_dec = (0, _aureliaFramework.inject)(Element, _session.Session, _dbService.DBService, _aureliaI18n.I18N, _aureliaEventAggregator.EventAggregator, _aureliaFramework.BindingEngine, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController), _adminRouter.AdminRouter), _dec(_class = (_class2 = function () {
        function UserTimesheet(element, session, db, i18n, ea, bindingEngine, controller, router) {
            _classCallCheck(this, UserTimesheet);

            _initDefineProp(this, 'timesheet', _descriptor, this);

            _initDefineProp(this, 'userName', _descriptor2, this);

            _initDefineProp(this, 'purposes', _descriptor3, this);

            _initDefineProp(this, 'unallocatedOnly', _descriptor4, this);

            _initDefineProp(this, 'accountingRules', _descriptor5, this);

            this.element = element;
            this.session = session;
            this.db = db;
            this.i18n = i18n;
            this.ea = ea;
            this.bindingEngine = bindingEngine;
            this.controller = controller;
            this.router = router;
        }

        UserTimesheet.prototype.attached = function attached() {

            $('.' + this.userName + ' .precarite.checkbox').checkbox();
            if (this.timesheet.precarite) {
                $('.' + this.userName + ' .precarite.checkbox').checkbox('set checked');
            }

            _aureliaValidation.ValidationRules.ensure('salary').required().matches(/^[\d]+[\.|]?[\d]*$/).withMessage(this.i18n.tr('error_number')).ensure('charges').required().matches(/^[\d]+[\.|]?[\d]*$/).withMessage(this.i18n.tr('error_number')).on(this.timesheet);
        };

        UserTimesheet.prototype.allocationSelected = function allocationSelected(dropdown) {
            var userName = dropdown.element.dataset.username;

            this.timesheet.entries.forEach(function (entry) {
                if (entry.id === dropdown.element.dataset.entryid) {
                    entry.allocation = dropdown.selectedEntry;
                }
            });

            this.calculateRatios();

            this.saveTimesheet(userName);
        };

        UserTimesheet.prototype.allocationAdded = function allocationAdded(dropdown) {
            $('.user.timesheet dropdown').each(function () {
                this.au.controller.viewModel.entries = dropdown.entries;
            });
        };

        UserTimesheet.prototype.calculateRatios = function calculateRatios() {

            var totalHours = 0;
            this.timesheet.entries.forEach(function (entry) {
                return totalHours += entry.duration;
            });
            this.timesheet.entries.forEach(function (entry) {
                entry.ratio = new _decimal2.default(entry.duration).div(new _decimal2.default(totalHours)).toJSON();
            });
        };

        UserTimesheet.prototype.saveTimesheet = function saveTimesheet(userName) {
            var _this = this;

            var errors = this.controller.validate().then(function (result) {

                if (!result.valid) {
                    return;
                }

                _this.timesheet.precarite = $('.' + userName + ' .precarite.checkbox').checkbox('is checked');

                _this.db.save('timesheet-' + _this.userName, _this.timesheet).then(function () {
                    _this.db.get('timesheet-' + _this.userName, _this.timesheet._id).then(function (response) {
                        _this.timesheet._rev = response._rev;
                    });
                });
            });
        };

        UserTimesheet.prototype.openEntry = function openEntry(id) {
            this.router.navigateToRoute('timesheets/' + this.timesheet._id + '/' + id + '?r=admin/' + this.timesheet._id);
        };

        return UserTimesheet;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'timesheet', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return {};
        }
    }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'userName', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'purposes', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return new Map();
        }
    }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'unallocatedOnly', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'accountingRules', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class2)) || _class);
});
define('pages/admin/users-timesheets',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './admin-router', '../../services/session', '../../services/db-service', '../../config/app-settings', 'moment', 'aurelia-i18n', '../../services/log'], function (exports, _aureliaFramework, _aureliaEventAggregator, _adminRouter, _session, _dbService, _appSettings, _moment, _aureliaI18n, _log) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UsersTimesheets = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor;

    var UsersTimesheets = exports.UsersTimesheets = (_dec = (0, _aureliaFramework.inject)(Element, _session.Session, _dbService.DBService, _aureliaI18n.I18N, _aureliaEventAggregator.EventAggregator, _aureliaFramework.BindingEngine, _adminRouter.AdminRouter), _dec(_class = (_class2 = function () {
        function UsersTimesheets(element, session, db, i18n, ea, bindingEngine, router) {
            _classCallCheck(this, UsersTimesheets);

            _initDefineProp(this, 'month', _descriptor, this);

            this.timesheets = new Map();
            this.users = new Map();
            this.purposes = new Map();
            this.unallocatedOnly = true;

            this.element = element;
            this.session = session;
            this.db = db;
            this.i18n = i18n;
            this.ea = ea;
            this.bindingEngine = bindingEngine;
            this.router = router;
        }

        UsersTimesheets.prototype.attached = function attached() {

            var me = this;
            $('#showAll').checkbox({
                onChange: function onChange() {
                    me.unallocatedOnly = !$('#showAll').hasClass('checked');
                }
            });

            this.retrieveData();

            this.ea.subscribe('dbsync', function (response) {
                if (response.dbName.match(/^timesheet\-/)) {
                    me.retrieveTimesheets();
                }
            });
        };

        UsersTimesheets.prototype.retrieveData = function retrieveData() {
            var _this = this;

            this.retrieveUsers().then(function () {
                _this.retrievePurposes().then(function () {
                    _this.retrieveTimesheets();
                });
            });
        };

        UsersTimesheets.prototype.retrieveUsers = function retrieveUsers() {
            var me = this;

            return this.db.listUsers().then(function (response) {
                response.forEach(function (user) {
                    me.users.set(user.doc.name, user);
                });
                return new Promise(function (resolve) {
                    resolve();
                });
            });
        };

        UsersTimesheets.prototype.retrievePurposes = function retrievePurposes() {
            var me = this;
            return this.db.list('purpose').then(function (response) {

                if (response) {

                    response.forEach(function (purpose) {
                        me.purposes.set(purpose.id, purpose.doc.name);
                    });
                }

                return new Promise(function (resolve) {
                    resolve();
                });
            });
        };

        UsersTimesheets.prototype.retrieveTimesheets = function retrieveTimesheets() {
            var me = this;

            this.users.forEach(function (user) {

                me.db.get('timesheet-' + user.doc.name, me.month).then(function (timesheet) {
                    if (timesheet) {
                        me.timesheets.set(user.doc.name, timesheet);
                    }
                });
            });
        };

        return UsersTimesheets;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'month', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class2)) || _class);
});
define('pages/timesheets/monthly-timesheet',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-event-aggregator', './timesheets-router', '../../services/session', '../../services/db-service', '../../config/app-settings', 'moment', 'aurelia-i18n'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaEventAggregator, _timesheetsRouter, _session, _dbService, _appSettings, _moment, _aureliaI18n) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.MonthlyTimesheet = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor;

    var MonthlyTimesheet = exports.MonthlyTimesheet = (_dec = (0, _aureliaFramework.inject)(Element, _session.Session, _dbService.DBService, _aureliaI18n.I18N, _aureliaEventAggregator.EventAggregator, _timesheetsRouter.TimesheetsRouter), _dec(_class = (_class2 = function () {
        function MonthlyTimesheet(element, session, db, i18n, ea, router) {
            _classCallCheck(this, MonthlyTimesheet);

            _initDefineProp(this, 'entity', _descriptor, this);

            this.purposes = new Map();
            this.interprets = new Map();

            this.element = element;
            this.session = session;
            this.db = db;
            this.i18n = i18n;
            this.ea = ea;
            this.router = router;
        }

        MonthlyTimesheet.prototype.activate = function activate(params) {

            this.timesheetId = params.id;

            this.retrieveData();

            this.ea.subscribe('dbsync', function (response) {
                me.retrieveData();
            });
        };

        MonthlyTimesheet.prototype.retrieveData = function retrieveData() {
            this.listPurposes().then(this.listInterprets().then(this.getTimesheet()));
        };

        MonthlyTimesheet.prototype.listPurposes = function listPurposes() {
            var me = this;
            return this.db.list('purpose').then(function (response) {

                if (response) {

                    response.forEach(function (purpose) {
                        me.purposes.set(purpose.id, purpose.doc.name);
                    });
                }

                return new Promise(function (resolve) {
                    resolve();
                });
            });
        };

        MonthlyTimesheet.prototype.listInterprets = function listInterprets() {
            var me = this;
            return this.db.list('interpret').then(function (response) {

                if (response) {

                    response.forEach(function (interpret) {
                        me.interprets.set(interpret.id, interpret.doc.name);
                    });
                }

                return new Promise(function (resolve) {
                    resolve();
                });
            });
        };

        MonthlyTimesheet.prototype.getTimesheet = function getTimesheet() {
            var me = this;

            return this.db.get('timesheet-' + this.session.getUser().name, this.timesheetId).then(function (response) {
                me.entity = response;
                return new Promise(function (resolve) {
                    resolve();
                });
            });
        };

        MonthlyTimesheet.prototype.openEntry = function openEntry(id) {
            this.router.navigateToRoute('timesheets/' + this.entity._id + '/' + id + '?r=timesheets/' + this.entity._id);
        };

        return MonthlyTimesheet;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'entity', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return {};
        }
    })), _class2)) || _class);
});
define('pages/timesheets/planning-router',['exports', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaFetchClient) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PlanningRouter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var PlanningRouter = exports.PlanningRouter = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
        function PlanningRouter() {
            _classCallCheck(this, PlanningRouter);
        }

        PlanningRouter.prototype.configureRouter = function configureRouter(config, router) {

            config.map([{
                route: ['/'],
                name: 'planning',
                moduleId: './planning',
                nav: false,
                title: 'Planning',
                auth: true
            }]);
            this.router = router;
        };

        PlanningRouter.prototype.navigateToRoute = function navigateToRoute(route, params) {
            this.router.navigate(route);
        };

        return PlanningRouter;
    }()) || _class);
});
define('pages/timesheets/planning',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-event-aggregator', './timesheets-router', '../../services/session', '../../services/db-service', '../../config/app-settings', 'moment', 'aurelia-i18n'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaEventAggregator, _timesheetsRouter, _session, _dbService, _appSettings, _moment, _aureliaI18n) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Planning = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Planning = exports.Planning = (_dec = (0, _aureliaFramework.inject)(Element, _session.Session, _dbService.DBService, _aureliaI18n.I18N, _timesheetsRouter.TimesheetsRouter), _dec(_class = function () {
        function Planning(element, session, db, i18n, router) {
            _classCallCheck(this, Planning);

            this.element = element;
            this.session = session;
            this.db = db;
            this.i18n = i18n;
            this.router = router;
        }

        Planning.prototype.attached = function attached() {
            var me = this;
            $(this.element).find('.ui.calendar').calendar({
                type: 'month',
                inline: true,
                text: _appSettings2.default.calendar_text,
                onChange: function onChange(date, text) {
                    var timesheetId = (0, _moment2.default)(date).format('YYYY-MM');
                    me.router.navigateToRoute('app/timesheets/' + timesheetId);
                }
            });
        };

        return Planning;
    }()) || _class);
});
define('pages/timesheets/timesheet-entry',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-event-aggregator', './timesheets-router', '../../services/session', '../../services/db-service', '../../config/app-settings', 'aurelia-validation', 'moment', 'aurelia-i18n', '../../resources/flash/flash-success-message'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaEventAggregator, _timesheetsRouter, _session, _dbService, _appSettings, _aureliaValidation, _moment, _aureliaI18n, _flashSuccessMessage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TimesheetEntry = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

    var TimesheetEntry = exports.TimesheetEntry = (_dec = (0, _aureliaFramework.inject)(Element, _session.Session, _dbService.DBService, _aureliaI18n.I18N, _aureliaEventAggregator.EventAggregator, _timesheetsRouter.TimesheetsRouter, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = (_class2 = function () {
        function TimesheetEntry(element, session, db, i18n, ea, router, controller) {
            _classCallCheck(this, TimesheetEntry);

            _initDefineProp(this, 'entity', _descriptor, this);

            _initDefineProp(this, 'create', _descriptor2, this);

            _initDefineProp(this, 'saveAction', _descriptor3, this);

            this.element = element;
            this.session = session;
            this.db = db;
            this.i18n = i18n;
            this.ea = ea;
            this.router = router;
            this.controller = controller;
        }

        TimesheetEntry.prototype.activate = function activate(params, routeConfig, navigationInstruction) {
            if (params.timesheetId && params.entryId) {
                this.getTimesheetEntry(params.timesheetId, params.entryId);
            }

            this.redirectTo = navigationInstruction.queryParams.r;
        };

        TimesheetEntry.prototype.attached = function attached() {

            if (!this.entity.id) {
                this.entity.date = new Date();
                this.entity.hours = 0;
                this.entity.minutes = 0;
                this.entity.interpret_hours = 0;
                this.entity.interpret_minutes = 0;
            }
            this.setDate();
            this.setupValidation();
        };

        TimesheetEntry.prototype.setDate = function setDate() {
            var me = this;

            $(this.element).find('.date.ui.calendar').each(function () {
                $(this).calendar({
                    type: 'date',
                    formatInput: false,
                    text: _appSettings2.default.calendar_text
                });

                $(this).calendar('set date', new Date(me.entity.date));
            });
        };

        TimesheetEntry.prototype.setupValidation = function setupValidation() {

            _aureliaValidation.ValidationRules.customRule('timeIsSet', function (value, obj) {
                return parseInt(obj.minutes) > 0 || parseInt(value) > 0;
            }, this.i18n.tr('time_not_set'));

            var me = this;
            if (!this.create) {
                _aureliaValidation.ValidationRules.customRule('monthUnchanged', function (value, obj) {
                    return me.isMonthUnChanged();
                }, this.i18n.tr('month_changed'));

                _aureliaValidation.ValidationRules.ensure('dateInput').satisfiesRule('monthUnchanged').ensure('date').satisfiesRule('monthUnchanged').on(this);
            }

            _aureliaValidation.ValidationRules.ensure('date').required().ensure('purpose').required().ensure('hours').required().matches(/^[\d]+$/).withMessage(this.i18n.tr('error_number')).then().satisfiesRule('timeIsSet').when(function (entry) {
                return parseInt(entry.minutes) === 0;
            }).ensure('minutes').required().matches(/^[\d]+$/).withMessage(this.i18n.tr('error_number')).ensure('interpret_hours').matches(/^[\d]*$/).withMessage(this.i18n.tr('error_number')).ensure('interpret_minutes').matches(/^[\d]*$/).withMessage(this.i18n.tr('error_number')).on(this.entity);
        };

        TimesheetEntry.prototype.isMonthUnChanged = function isMonthUnChanged() {
            return this.entity.date === null || this.entity.date === undefined || new Date(this.entity.date).getMonth() === this.getCalendarDate().getMonth();
        };

        TimesheetEntry.prototype.getCalendarDate = function getCalendarDate() {
            return new Date($(this.element).find('.date.ui.calendar').calendar('get date'));
        };

        TimesheetEntry.prototype.getTimesheetEntry = function getTimesheetEntry(timesheetId, entryId) {
            var me = this;

            return this.db.get('timesheet-' + this.session.getUser().name, timesheetId).then(function (response) {

                response.entries.forEach(function (entry) {
                    if (entry.id === entryId) {
                        me.entity = entry;
                    }
                });

                me.setDate();
                return new Promise(function (resolve) {
                    resolve();
                });
            });
        };

        TimesheetEntry.prototype.doSave = function doSave(event) {
            var _this = this;

            var errors = this.controller.validate().then(function (result) {
                if (!_this.isEditable) {
                    return;
                }

                if (!result.valid) {
                    return;
                }

                _this.entity.date = _this.getCalendarDate();

                if (_this.create) {
                    _this.entity.id = _this.entity.purpose + ':' + Date.now();
                }

                _this.entity.duration = parseInt(_this.entity.hours) + parseFloat(parseInt(_this.entity.minutes) / 60);
                _this.entity.interpret_duration = parseInt(_this.entity.interpret_hours) + parseFloat(parseInt(_this.entity.interpret_minutes) / 60);

                var timesheetId = (0, _moment2.default)(_this.entity.date).format('YYYY-MM');

                _this.db.get('timesheet-' + _this.session.getUser().name, timesheetId).then(function (timesheet) {

                    if (!timesheet) {
                        timesheet = {
                            _id: timesheetId,
                            entries: []
                        };
                    }

                    var entry = _this.entity;
                    timesheet.entries.slice().reverse().forEach(function (item, index, object) {
                        if (item.id === entry.id) {
                            timesheet.entries.splice(object.length - 1 - index, 1);
                        }
                    });

                    timesheet.entries = [_this.entity].concat(timesheet.entries);

                    _this.db.save('timesheet-' + _this.session.getUser().name, timesheet).then(function () {
                        return _this.ea.publish(new _flashSuccessMessage.FlashSuccessMessage(_this.i18n.tr('success')));
                    });

                    if (_this.create) {
                        _this.entity = {
                            purpose: _this.entity.purpose,
                            hours: 0,
                            minutes: 0,
                            interpret_hours: 0,
                            interpret_minutes: 0
                        };
                    }

                    if (_this.saveAction) {
                        _this.saveAction({ entity: _this.entity });
                    }

                    if (_this.redirectTo) {
                        _this.router.navigateToRoute(_this.redirectTo);
                    }
                });
            });
        };

        _createClass(TimesheetEntry, [{
            key: 'isEditable',
            get: function get() {
                return this.session.isGranted('admin') || this.entity.allocation === undefined || this.entity.allocation === null;
            }
        }]);

        return TimesheetEntry;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'entity', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return {};
        }
    }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'create', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return false;
        }
    }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'saveAction', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class2)) || _class);
});
define('pages/timesheets/timesheets-router',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaRouter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TimesheetsRouter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var TimesheetsRouter = exports.TimesheetsRouter = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = function () {
        function TimesheetsRouter(router) {
            _classCallCheck(this, TimesheetsRouter);

            this.router = router;
        }

        TimesheetsRouter.prototype.configureRouter = function configureRouter(config) {

            config.map([{
                route: ['/'],
                name: 'list',
                moduleId: './timesheets',
                nav: false,
                title: 'List',
                auth: true
            }, {
                route: [':id'],
                name: 'timesheet',
                moduleId: './monthly-timesheet',
                nav: false,
                title: 'Timesheet',
                auth: true
            }, {
                route: ':timesheetId/:entryId',
                name: 'timesheetEntry',
                moduleId: './timesheet-entry',
                nav: false,
                title: 'Timesheet',
                auth: true
            }]);
        };

        TimesheetsRouter.prototype.navigateToRoute = function navigateToRoute(route, params) {
            this.router.navigate(route);
        };

        return TimesheetsRouter;
    }()) || _class);
});
define('pages/timesheets/timesheets',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-event-aggregator', 'aurelia-validation', './timesheets-router', '../../services/session', '../../services/db-service', '../../config/app-settings', 'moment', '../../resources/flash/flash-success-message', 'aurelia-i18n', '../../services/log'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaEventAggregator, _aureliaValidation, _timesheetsRouter, _session, _dbService, _appSettings, _moment, _flashSuccessMessage, _aureliaI18n, _log) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Timesheets = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Timesheets = exports.Timesheets = (_dec = (0, _aureliaFramework.inject)(_session.Session, _dbService.DBService, _aureliaEventAggregator.EventAggregator, _aureliaI18n.I18N), _dec(_class = function () {
        function Timesheets(session, db, ea, i18n) {
            _classCallCheck(this, Timesheets);

            this.purposes = new Map();
            this.lastTimesheet = {
                doc: {
                    entries: []
                }
            };

            this.session = session;
            this.db = db;
            this.ea = ea;
            this.i18n = i18n;
        }

        Timesheets.prototype.activate = function activate(params) {
            var me = this;

            this.retrieveData();

            this.ea.subscribe('dbsync', function (response) {
                me.retrieveData();
            });
        };

        Timesheets.prototype.retrieveData = function retrieveData() {
            var _this = this;

            this.listPurposes().then(function (response) {
                _this.getLastTimesheet();
            });
        };

        Timesheets.prototype.listPurposes = function listPurposes() {
            var me = this;
            return this.db.list('purpose').then(function (response) {

                if (response) {

                    response.forEach(function (purpose) {
                        me.purposes.set(purpose.id, purpose.doc.name);
                    });
                }

                return new Promise(function (resolve) {
                    resolve();
                });
            });
        };

        Timesheets.prototype.getLastTimesheet = function getLastTimesheet() {
            var me = this;

            return this.db.list('timesheet-' + this.session.getUser().name, 1, true).then(function (response) {

                me.lastTimesheet = {
                    doc: {
                        entries: []
                    }
                };

                if (response.length > 0) {
                    me.lastTimesheet = response[0];
                }

                return new Promise(function (resolve) {
                    resolve();
                });
            });
        };

        Timesheets.prototype.attached = function attached() {
            $('.ui.accordion').accordion({
                exclusive: true
            });
        };

        Timesheets.prototype.saveEntry = function saveEntry(entry) {
            this.getLastTimesheet();
        };

        Timesheets.prototype.edit = function edit($event, entity) {
            this.editing = entity;
        };

        Timesheets.prototype.cancel = function cancel() {
            this.editing = { id: -1 };
            this.creating = false;
        };

        Timesheets.prototype.create = function create() {
            this.creating = true;
        };

        return Timesheets;
    }()) || _class);
});
define('pages/user/logged-redirect',['exports', 'aurelia-framework', 'aurelia-router', '../../services/session'], function (exports, _aureliaFramework, _aureliaRouter, _session) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.LoggedRedirect = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var LoggedRedirect = exports.LoggedRedirect = (_dec = (0, _aureliaFramework.inject)(_session.Session, _aureliaRouter.Router), _dec(_class = function () {
        function LoggedRedirect(session, router) {
            _classCallCheck(this, LoggedRedirect);

            this.session = session;
            this.router = router;
        }

        LoggedRedirect.prototype.activate = function activate() {
            var router = this.router;
            this.session.start().then(function () {
                router.navigate('app/timesheets');
            }).catch(function (err) {
                console.log(err);
            });
        };

        return LoggedRedirect;
    }()) || _class);
});
define('pages/user/login',['exports', 'aurelia-framework', 'aurelia-auth', 'aurelia-router', '../../services/session', '../../config/app-settings', 'pouchdb', 'pouchdb-authentication', '../../services/log', '../../services/sharding-service'], function (exports, _aureliaFramework, _aureliaAuth, _aureliaRouter, _session, _appSettings, _pouchdb, _pouchdbAuthentication, _log, _shardingService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Login = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    var _pouchdb2 = _interopRequireDefault(_pouchdb);

    var _pouchdbAuthentication2 = _interopRequireDefault(_pouchdbAuthentication);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_aureliaAuth.AuthService, _shardingService.ShardingService, _aureliaRouter.Router, _session.Session), _dec(_class = function () {
        function Login(auth, sharding, router, session) {
            _classCallCheck(this, Login);

            this.auth = auth;
            this.sharding = sharding;
            this.router = router;
            this.session = session;
            this.settings = _appSettings2.default;
        }

        Login.prototype.login = function login() {

            var login = this;

            _pouchdb2.default.plugin(_pouchdbAuthentication2.default);

            var db = new _pouchdb2.default(this.sharding.getRemoteUrl() + '_users', { skipSetup: true });
            db.login(this.username, this.password, function (err, response) {

                if (err) {
                    _log.log.error(err);
                    login.loginError = err.name;
                    $('.ui.form .login.error.message').show();
                    return;
                }

                localStorage.setItem('aurelia_token', btoa(login.username + ':' + login.password));
                login.router.navigate('loggedIn');
            });
        };

        return Login;
    }()) || _class);
});
define('pages/user/password',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-event-aggregator', 'aurelia-validation', 'aurelia-i18n', './user-router', '../../services/session', '../../config/app-settings', '../../resources/flash/flash-success-message'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaEventAggregator, _aureliaValidation, _aureliaI18n, _userRouter, _session, _appSettings, _flashSuccessMessage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Password = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Password = exports.Password = (_dec = (0, _aureliaFramework.inject)(Element, _session.Session, _aureliaI18n.I18N, _aureliaFetchClient.HttpClient, _userRouter.UserRouter, _aureliaEventAggregator.EventAggregator, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = function () {
        function Password(element, session, i18n, http, router, ea, controller) {
            _classCallCheck(this, Password);

            this.form = {};

            this.element = element;
            this.session = session;
            this.i18n = i18n;
            this.http = http;
            this.router = router;
            this.ea = ea;
            this.controller = controller;

            this.form = {
                current_password: null,
                plain_password: {
                    first: null,
                    second: null
                }
            };
        }

        Password.prototype.activate = function activate() {

            this.rules = _aureliaValidation.ValidationRules.ensure('current_password').required({ message: "required" }).on(this.form);

            this.newrules = _aureliaValidation.ValidationRules.ensure('first').required().length({ minimum: 6 }).ensure('second').required().ensure('first').equality('second').on(this.form.plain_password);
        };

        Password.prototype.save = function save(event) {
            var _this = this;

            var errors = this.controller.validate();

            if (errors.length > 0) {
                return;
            }

            $(event.target).addClass('loading');

            return this.http.fetch('users/' + this.session.user.id + '/password', {
                method: 'PUT',
                body: (0, _aureliaFetchClient.json)(this.form)
            }).then(function (response) {

                $(event.target).removeClass('loading');

                if (response instanceof Error) {
                    Promise.reject(response);
                    return response;
                }

                _this.ea.publish(new _flashSuccessMessage.FlashSuccessMessage(_this.i18n.tr('success')));
                _this.form = {
                    current_password: null,
                    plain_password: {
                        first: null,
                        second: null
                    }
                };
                return new Promise(function (resolve) {
                    resolve();
                });
            }).catch(function () {});
        };

        return Password;
    }()) || _class);
});
define('pages/user/user-router',['exports', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaFetchClient) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserRouter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var UserRouter = exports.UserRouter = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
        function UserRouter() {
            _classCallCheck(this, UserRouter);
        }

        UserRouter.prototype.configureRouter = function configureRouter(config, router) {

            config.map([{
                route: ['/password'],
                name: 'password',
                moduleId: './password',
                nav: true,
                title: 'user:change_password',
                settings: { 'icon': 'unlock' }
            }]);
            this.router = router;
        };

        UserRouter.prototype.navigateToRoute = function navigateToRoute(route, params) {
            this.router.navigate(route);
        };

        return UserRouter;
    }()) || _class);
});
define('resources/confirmation/confirmation',['exports', 'aurelia-framework', 'aurelia-dialog'], function (exports, _aureliaFramework, _aureliaDialog) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Confirmation = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Confirmation = exports.Confirmation = (_dec = (0, _aureliaFramework.inject)(_aureliaDialog.DialogController), _dec(_class = function () {
        function Confirmation(dialogController) {
            _classCallCheck(this, Confirmation);

            this.dialogController = dialogController;
        }

        Confirmation.prototype.activate = function activate(data) {
            this.message = data;
        };

        return Confirmation;
    }()) || _class);
});
define('resources/confirmation/delete-button',["exports", "aurelia-framework", "aurelia-dialog", "./confirmation"], function (exports, _aureliaFramework, _aureliaDialog, _confirmation) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DeleteButton = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2;

    var DeleteButton = exports.DeleteButton = (_dec = (0, _aureliaFramework.inject)(_aureliaDialog.DialogService), _dec(_class = (_class2 = function (_BaseViewModel) {
        _inherits(DeleteButton, _BaseViewModel);

        function DeleteButton(dialogService) {
            _classCallCheck(this, DeleteButton);

            for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                rest[_key - 1] = arguments[_key];
            }

            var _this = _possibleConstructorReturn(this, _BaseViewModel.call.apply(_BaseViewModel, [this].concat(rest)));

            _initDefineProp(_this, "action", _descriptor, _this);

            _initDefineProp(_this, "message", _descriptor2, _this);

            _this.dialogService = dialogService;
            _this.message = _this.i18n.tr('delete_sure');
            return _this;
        }

        DeleteButton.prototype.do = function _do($event) {
            var _this2 = this;

            $event.stopPropagation();
            this.dialogService.open({
                viewModel: _confirmation.Confirmation,
                model: this.message
            }).then(function (result) {
                if (result.wasCancelled) return;
                _this2.action();
            });
        };

        return DeleteButton;
    }(BaseViewModel), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "action", [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return function () {};
        }
    }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "message", [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return "Are you sure ?";
        }
    })), _class2)) || _class);
});
define('resources/confirmation/ui-confirmation',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UIConfirmationAttribute = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _dec2, _class, _desc, _value, _class2, _descriptor;

    var UIConfirmationAttribute = exports.UIConfirmationAttribute = (_dec = (0, _aureliaFramework.customAttribute)('ui-confirmation'), _dec2 = (0, _aureliaFramework.inject)(Element), _dec(_class = _dec2(_class = (_class2 = function () {
        function UIConfirmationAttribute(element) {
            _classCallCheck(this, UIConfirmationAttribute);

            _initDefineProp(this, 'approveCallback', _descriptor, this);

            alert(element);
            this.element = element;
        }

        UIConfirmationAttribute.prototype.attached = function attached() {
            $(this.element).modal({
                onApprove: function (element) {
                    return function () {
                        var confirmEvent = new CustomEvent('confirm', {
                            detail: {
                                value: 1
                            },
                            bubbles: true
                        });
                        element.dispatchEvent(confirmEvent);
                    };
                }(this.element)
            });
        };

        UIConfirmationAttribute.prototype.activeChanged = function activeChanged(newValue) {
            if (newValue) {
                $(this.element).modal('show');
            } else {
                $(this.element).modal('hide');
            }
        };

        UIConfirmationAttribute.prototype.bind = function bind($arg) {
            this.approveCallback = $arg.approveCallback;
        };

        return UIConfirmationAttribute;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'approveCallback', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class2)) || _class) || _class);
});
define('resources/dropdown/dropdown',['exports', 'aurelia-framework', '../../services/db-service', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _dbService, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DropDownCustomElement = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12;

    var DropDownCustomElement = exports.DropDownCustomElement = (_dec = (0, _aureliaFramework.customElement)('dropdown'), _dec2 = (0, _aureliaFramework.inject)(Element, _dbService.DBService, _aureliaEventAggregator.EventAggregator), _dec(_class = _dec2(_class = (_class2 = function () {
        function DropDownCustomElement(element, db, ea) {
            _classCallCheck(this, DropDownCustomElement);

            _initDefineProp(this, 'entries', _descriptor, this);

            _initDefineProp(this, 'selectedEntry', _descriptor2, this);

            _initDefineProp(this, 'parentId', _descriptor3, this);

            _initDefineProp(this, 'route', _descriptor4, this);

            _initDefineProp(this, 'parentRoute', _descriptor5, this);

            _initDefineProp(this, 'name', _descriptor6, this);

            _initDefineProp(this, 'required', _descriptor7, this);

            _initDefineProp(this, 'multiple', _descriptor8, this);

            _initDefineProp(this, 'allowAdd', _descriptor9, this);

            _initDefineProp(this, 'bypassCache', _descriptor10, this);

            _initDefineProp(this, 'selectAction', _descriptor11, this);

            _initDefineProp(this, 'addAction', _descriptor12, this);

            this.element = element;
            this.db = db;
            this.ea = ea;
        }

        DropDownCustomElement.prototype.attached = function attached() {
            var dropdown = this;
            $(this.element).find('.ui.dropdown').dropdown({
                'forceSelection': false,
                'allowAdditions': dropdown.allowAdd,
                'hideAdditions': !dropdown.allowAdd,
                'onChange': function onChange(value, text, $choice) {
                    if (typeof $choice !== 'undefined' && $($choice[0]).hasClass('addition')) {
                        dropdown.save(text);
                    } else {
                        dropdown.selectedEntry = value;
                    }
                }
            });
            this.load();

            this.ea.subscribe('dbsync', function (response) {
                if (response.dbName === dropdown.route) {
                    dropdown.load();
                }
            });
        };

        DropDownCustomElement.prototype.parentIdChanged = function parentIdChanged(newEntry, oldEntry) {
            if (newEntry == oldEntry) {
                return;
            }
            if (oldEntry) {
                this.selectedEntry = undefined;
            }
            this.restoreDefaults();
            this.load();
        };

        DropDownCustomElement.prototype.selectedEntryChanged = function selectedEntryChanged() {
            if (this.isSelectedEntryNew()) {
                return;
            }

            var selected = $(this.element).find('.dropdown').dropdown('get value');

            if (selected[0] !== null && (this.selectedEntry === undefined || this.selectedEntry === '' || this.selectedEntry === [])) {
                $(this.element).find('.dropdown').dropdown('clear');
            }
            this.setEntryName();

            this.selectAction({ dropdown: this });
        };

        DropDownCustomElement.prototype.isSelectedEntryNew = function isSelectedEntryNew() {
            if (this.entries === null) {
                return true;
            }

            var me = this;
            var isNew = true;
            this.entries.forEach(function (entry) {
                if (entry.id === me.selectedEntry) {
                    isNew = false;
                }
            });

            return isNew;
        };

        DropDownCustomElement.prototype.restoreDefaults = function restoreDefaults() {
            $(this.element).find('.text').addClass('default');
            this.selectedEntryName = this.getPlaceHolder();
        };

        DropDownCustomElement.prototype.getPlaceHolder = function getPlaceHolder() {
            return $(this.element).find('.text').data('default');
        };

        DropDownCustomElement.prototype.setEntryName = function setEntryName() {
            if (this.multiple) {
                return;
            }

            if (!this.entries) {
                return;
            }

            for (var _iterator = this.entries, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;

                if (_isArray) {
                    if (_i >= _iterator.length) break;
                    _ref = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) break;
                    _ref = _i.value;
                }

                var entry = _ref;

                if (entry.id == this.selectedEntry) {
                    this.selectedEntryName = entry.doc.name;
                }
            }

            if (this.selectedEntryName && this.selectedEntryName != this.getPlaceHolder()) {
                $(this.element).find('.text').removeClass('default');
            } else {
                this.restoreDefaults();
            }
        };

        DropDownCustomElement.prototype.load = function load() {
            var _this = this;

            this.db.list(this.route).then(function (entries) {

                _this.entries = entries;

                if (_this.entries && _this.required && (_this.selectedEntry === undefined || _this.selectedEntry === '') && _this.entries.length > 0) {
                    _this.selectedEntry = _this.entries[0].id;
                }

                _this.setEntryName();
            });
        };

        DropDownCustomElement.prototype.save = function save(newEntry) {
            var doc = {
                name: newEntry
            };

            var me = this;
            this.db.create(this.route, doc).then(function (response) {
                doc._id = response.id;
                me.entries = [{ id: response.id, doc: doc }].concat(me.entries);
                me.selectedEntry = doc._id;
                $(me.element).find('.dropdown').dropdown('set value', doc._id);
                me.addAction({ dropdown: me });
            });
        };

        return DropDownCustomElement;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'entries', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'selectedEntry', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'parentId', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'route', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'parentRoute', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'name', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'required', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return false;
        }
    }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'multiple', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return false;
        }
    }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'allowAdd', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return false;
        }
    }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'bypassCache', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return false;
        }
    }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'selectAction', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return function () {};
        }
    }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'addAction', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return function () {};
        }
    })), _class2)) || _class) || _class);
});
define('resources/flash/animateonchange',['exports', 'aurelia-framework', 'aurelia-animator-css'], function (exports, _aureliaFramework, _aureliaAnimatorCss) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AnimateOnChangeCustomAttribute = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _dec2, _class;

    var AnimateOnChangeCustomAttribute = exports.AnimateOnChangeCustomAttribute = (_dec = (0, _aureliaFramework.customAttribute)('animateonchange'), _dec2 = (0, _aureliaFramework.inject)(Element, _aureliaAnimatorCss.CssAnimator), _dec(_class = _dec2(_class = function () {
        function AnimateOnChangeCustomAttribute(element, animator) {
            _classCallCheck(this, AnimateOnChangeCustomAttribute);

            this.element = element;
            this.animator = animator;
            this.initialValueSet = false;
        }

        AnimateOnChangeCustomAttribute.prototype.valueChanged = function valueChanged(newValue) {
            var _this = this;

            if (this.initialValueSet) {
                this.animator.addClass(this.element, 'background-animation').then(function () {
                    _this.animator.removeClass(_this.element, 'background-animation');
                });
            }
            this.initialValueSet = true;
        };

        return AnimateOnChangeCustomAttribute;
    }()) || _class) || _class);
});
define('resources/flash/flash-error-message',['exports', './flash-message'], function (exports, _flashMessage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FlashErrorMessage = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var FlashErrorMessage = exports.FlashErrorMessage = function (_FlashMessage) {
        _inherits(FlashErrorMessage, _FlashMessage);

        function FlashErrorMessage(message) {
            _classCallCheck(this, FlashErrorMessage);

            return _possibleConstructorReturn(this, _FlashMessage.call(this, message));
        }

        return FlashErrorMessage;
    }(_flashMessage.FlashMessage);
});
define('resources/flash/flash-message',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var FlashMessage = exports.FlashMessage = function FlashMessage(message) {
        _classCallCheck(this, FlashMessage);

        this.message = message;
    };
});
define('resources/flash/flash-success-message',['exports', './flash-message'], function (exports, _flashMessage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FlashSuccessMessage = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var FlashSuccessMessage = exports.FlashSuccessMessage = function (_FlashMessage) {
        _inherits(FlashSuccessMessage, _FlashMessage);

        function FlashSuccessMessage(message) {
            _classCallCheck(this, FlashSuccessMessage);

            return _possibleConstructorReturn(this, _FlashMessage.call(this, message));
        }

        return FlashSuccessMessage;
    }(_flashMessage.FlashMessage);
});
define('resources/flash/flash',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-animator-css', './flash-message', './flash-success-message', './flash-error-message'], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaAnimatorCss, _flashMessage, _flashSuccessMessage, _flashErrorMessage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Flash = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Flash = exports.Flash = (_dec = (0, _aureliaFramework.inject)(Element, _aureliaEventAggregator.EventAggregator, _aureliaAnimatorCss.CssAnimator), _dec(_class = function () {
        function Flash(element, eventAggregator, cssAnimator) {
            _classCallCheck(this, Flash);

            this.message = '';

            this.element = element;
            this.ea = eventAggregator;
            this.animator = cssAnimator;
        }

        Flash.prototype.attached = function attached() {
            var _this = this;

            var messageElement = this.element.querySelectorAll('.message')[0];
            this.subscriber = this.ea.subscribe(_flashMessage.FlashMessage, function (event) {

                _this.message = event.message;

                $(messageElement).removeClass('positive');
                $(messageElement).removeClass('negative');
                $(messageElement).removeClass('background-animation-add');
                $(messageElement).removeClass('background-animation-remove');

                var flashType = 'positive';
                if (event instanceof _flashErrorMessage.FlashErrorMessage) {
                    flashType = 'negative';
                }

                window.scrollTo(0, 0);
                _this.animator.addClass(messageElement, flashType).then(function () {
                    _this.animator.addClass(messageElement, 'background-animation').then(function () {
                        _this.animator.removeClass(messageElement, 'background-animation');
                        _this.animator.removeClass(messageElement, flashType);
                    });
                });
            });
        };

        Flash.prototype.detached = function detached() {
            this.subscriber.dispose();
        };

        return Flash;
    }()) || _class);
});
define('resources/formats/array-join',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var JoinValueConverter = exports.JoinValueConverter = function () {
        function JoinValueConverter() {
            _classCallCheck(this, JoinValueConverter);
        }

        JoinValueConverter.prototype.toView = function toView(value) {
            if (value === undefined || !Array.isArray(value)) {
                return '';
            }
            return value.join(', ');
        };

        return JoinValueConverter;
    }();
});
define('resources/formats/date-format',['exports', 'moment'], function (exports, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DateFormatValueConverter = undefined;

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var DateFormatValueConverter = exports.DateFormatValueConverter = function () {
        function DateFormatValueConverter() {
            _classCallCheck(this, DateFormatValueConverter);
        }

        DateFormatValueConverter.prototype.toView = function toView(value) {
            return (0, _moment2.default)(value).format('D-MMM-YYYY');
        };

        return DateFormatValueConverter;
    }();
});
define('resources/formats/email',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var EmailValueConverter = exports.EmailValueConverter = function () {
        function EmailValueConverter() {
            _classCallCheck(this, EmailValueConverter);
        }

        EmailValueConverter.prototype.toView = function toView(value) {
            var html = '';
            if (value === undefined || !Array.isArray(value)) {
                return html;
            }
            value.forEach(function (mail) {
                html += '<a href="mailto: ' + mail + '">' + mail + '</a> ';
            });

            return html;
        };

        return EmailValueConverter;
    }();
});
define('resources/formats/limit-to-value',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var LimitToValueConverter = exports.LimitToValueConverter = function () {
        function LimitToValueConverter() {
            _classCallCheck(this, LimitToValueConverter);
        }

        LimitToValueConverter.prototype.toView = function toView(array, count) {
            if (array == null || array === undefined) {
                return [];
            }
            return array.slice(0, count);
        };

        return LimitToValueConverter;
    }();
});
define('resources/formats/month-format',['exports', 'moment'], function (exports, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.MonthFormatValueConverter = undefined;

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var MonthFormatValueConverter = exports.MonthFormatValueConverter = function () {
        function MonthFormatValueConverter() {
            _classCallCheck(this, MonthFormatValueConverter);
        }

        MonthFormatValueConverter.prototype.toView = function toView(value) {
            return (0, _moment2.default)(value).format('MMMM YYYY');
        };

        return MonthFormatValueConverter;
    }();
});
define('resources/formats/remote-url',['exports', '../../config/app-settings'], function (exports, _appSettings) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RemoteUrlValueConverter = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var RemoteUrlValueConverter = exports.RemoteUrlValueConverter = function () {
        function RemoteUrlValueConverter() {
            _classCallCheck(this, RemoteUrlValueConverter);
        }

        RemoteUrlValueConverter.prototype.toView = function toView(value) {
            return _appSettings2.default.rootUrl + '/' + value;
        };

        return RemoteUrlValueConverter;
    }();
});
define('resources/formats/tel',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var TelValueConverter = exports.TelValueConverter = function () {
        function TelValueConverter() {
            _classCallCheck(this, TelValueConverter);
        }

        TelValueConverter.prototype.toView = function toView(value) {
            var html = '';
            if (value === undefined || !Array.isArray(value)) {
                return html;
            }
            value.forEach(function (tel) {
                html += '<a href="tel: ' + tel + '">' + tel + '</a> ';
            });

            return html;
        };

        return TelValueConverter;
    }();
});
define('resources/formats/truncate',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var TruncateValueConverter = exports.TruncateValueConverter = function () {
        function TruncateValueConverter() {
            _classCallCheck(this, TruncateValueConverter);
        }

        TruncateValueConverter.prototype.toView = function toView(value, length) {

            if (value === null || value === undefined || value.length <= length) {
                return value;
            }

            return value.substring(0, length) + '...';
        };

        return TruncateValueConverter;
    }();
});
define('resources/pagination/pagination',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Pagination = exports.Pagination = function () {
        function Pagination(currentPage, itemsPerPage, totalCount, items) {
            _classCallCheck(this, Pagination);

            this.currentPage = currentPage;
            this.itemsPerPage = itemsPerPage;
            this.totalCount = totalCount;
            this.items = items;

            this.setNumberPages();
            this.setVisiblePages();
        }

        Pagination.prototype.setNumberPages = function setNumberPages() {
            this.numberPages = Math.ceil(this.totalCount / this.itemsPerPage);
        };

        Pagination.prototype.setVisiblePages = function setVisiblePages() {
            var _this = this;

            var NBR_START = 2;
            var NBR_END = 2;
            var NBR_PAGES = 10;
            var NBR_DISABLED = 2;
            var NBR_VISIBLE = 7;

            if (this.numberPages <= NBR_PAGES) {
                this.visiblePages = this.numberPages;
                return;
            }

            this.startPages = NBR_START;
            this.endPages = Array.apply(null, Array(NBR_END)).map(function (v, i) {
                return _this.numberPages - i - 1;
            }).reverse();

            var visibleRangeStart = Math.max(NBR_START, this.currentPage - (NBR_VISIBLE - 1) / 2);
            var visibleRangeEnd = Math.max(NBR_VISIBLE, this.currentPage + 1 + (NBR_VISIBLE - 1) / 2);

            var nbrVisiblePages = NBR_VISIBLE - NBR_START;

            if (visibleRangeStart > NBR_START) {
                this.firstDisabledPages = NBR_DISABLED;
            }

            if (visibleRangeEnd > this.numberPages) {
                visibleRangeStart = this.numberPages - NBR_VISIBLE;
            } else {
                this.lastDisabledPages = NBR_DISABLED;
            }

            this.visiblePages = Array.apply(null, Array(nbrVisiblePages)).map(function (v, i) {
                return i + visibleRangeStart;
            });
        };

        return Pagination;
    }();
});
define('resources/pagination/paginator',["exports", "aurelia-framework", "aurelia-dialog"], function (exports, _aureliaFramework, _aureliaDialog) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Paginator = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

    var Paginator = exports.Paginator = (_class = function () {
        function Paginator() {
            _classCallCheck(this, Paginator);

            _initDefineProp(this, "pagination", _descriptor, this);

            _initDefineProp(this, "action", _descriptor2, this);

            _initDefineProp(this, "hasLoadMore", _descriptor3, this);
        }

        Paginator.prototype.paginate = function paginate(page) {
            this.action({ params: {
                    "page": page === undefined ? this.pagination.currentPage : page,
                    "limit": this.pagination.itemsPerPage
                } });
        };

        Paginator.prototype.loadMore = function loadMore() {
            this.action({ params: {
                    "page": parseInt(this.pagination.currentPage) + 1,
                    "limit": this.pagination.itemsPerPage
                } });
        };

        return Paginator;
    }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "pagination", [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "action", [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return function () {};
        }
    }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "hasLoadMore", [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class);
});
define('aurelia-templating-resources/compose',['exports', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-templating', 'aurelia-pal'], function (exports, _aureliaDependencyInjection, _aureliaTaskQueue, _aureliaTemplating, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Compose = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var Compose = exports.Compose = (_dec = (0, _aureliaTemplating.customElement)('compose'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaTaskQueue.TaskQueue), _dec(_class = (0, _aureliaTemplating.noView)(_class = _dec2(_class = (_class2 = function () {
    function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
      

      _initDefineProp(this, 'model', _descriptor, this);

      _initDefineProp(this, 'view', _descriptor2, this);

      _initDefineProp(this, 'viewModel', _descriptor3, this);

      this.element = element;
      this.container = container;
      this.compositionEngine = compositionEngine;
      this.viewSlot = viewSlot;
      this.viewResources = viewResources;
      this.taskQueue = taskQueue;
      this.currentController = null;
      this.currentViewModel = null;
    }

    Compose.prototype.created = function created(owningView) {
      this.owningView = owningView;
    };

    Compose.prototype.bind = function bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
      processInstruction(this, createInstruction(this, {
        view: this.view,
        viewModel: this.viewModel,
        model: this.model
      }));
    };

    Compose.prototype.unbind = function unbind(bindingContext, overrideContext) {
      this.bindingContext = null;
      this.overrideContext = null;
      var returnToCache = true;
      var skipAnimation = true;
      this.viewSlot.removeAll(returnToCache, skipAnimation);
    };

    Compose.prototype.modelChanged = function modelChanged(newValue, oldValue) {
      var _this = this;

      if (this.currentInstruction) {
        this.currentInstruction.model = newValue;
        return;
      }

      this.taskQueue.queueMicroTask(function () {
        if (_this.currentInstruction) {
          _this.currentInstruction.model = newValue;
          return;
        }

        var vm = _this.currentViewModel;

        if (vm && typeof vm.activate === 'function') {
          vm.activate(newValue);
        }
      });
    };

    Compose.prototype.viewChanged = function viewChanged(newValue, oldValue) {
      var _this2 = this;

      var instruction = createInstruction(this, {
        view: newValue,
        viewModel: this.currentViewModel || this.viewModel,
        model: this.model
      });

      if (this.currentInstruction) {
        this.currentInstruction = instruction;
        return;
      }

      this.currentInstruction = instruction;
      this.taskQueue.queueMicroTask(function () {
        return processInstruction(_this2, _this2.currentInstruction);
      });
    };

    Compose.prototype.viewModelChanged = function viewModelChanged(newValue, oldValue) {
      var _this3 = this;

      var instruction = createInstruction(this, {
        viewModel: newValue,
        view: this.view,
        model: this.model
      });

      if (this.currentInstruction) {
        this.currentInstruction = instruction;
        return;
      }

      this.currentInstruction = instruction;
      this.taskQueue.queueMicroTask(function () {
        return processInstruction(_this3, _this3.currentInstruction);
      });
    };

    return Compose;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'model', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'view', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'viewModel', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class) || _class);


  function createInstruction(composer, instruction) {
    return Object.assign(instruction, {
      bindingContext: composer.bindingContext,
      overrideContext: composer.overrideContext,
      owningView: composer.owningView,
      container: composer.container,
      viewSlot: composer.viewSlot,
      viewResources: composer.viewResources,
      currentController: composer.currentController,
      host: composer.element
    });
  }

  function processInstruction(composer, instruction) {
    composer.currentInstruction = null;
    composer.compositionEngine.compose(instruction).then(function (controller) {
      composer.currentController = controller;
      composer.currentViewModel = controller ? controller.viewModel : null;
    });
  }
});
define('aurelia-templating-resources/if',['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.If = undefined;

  

  var _dec, _dec2, _class;

  var If = exports.If = (_dec = (0, _aureliaTemplating.customAttribute)('if'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function If(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.showing = false;
      this.view = null;
      this.bindingContext = null;
      this.overrideContext = null;
    }

    If.prototype.bind = function bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
      this.valueChanged(this.value);
    };

    If.prototype.valueChanged = function valueChanged(newValue) {
      var _this = this;

      if (this.__queuedChanges) {
        this.__queuedChanges.push(newValue);
        return;
      }

      var maybePromise = this._runValueChanged(newValue);
      if (maybePromise instanceof Promise) {
        (function () {
          var queuedChanges = _this.__queuedChanges = [];

          var runQueuedChanges = function runQueuedChanges() {
            if (!queuedChanges.length) {
              _this.__queuedChanges = undefined;
              return;
            }

            var nextPromise = _this._runValueChanged(queuedChanges.shift()) || Promise.resolve();
            nextPromise.then(runQueuedChanges);
          };

          maybePromise.then(runQueuedChanges);
        })();
      }
    };

    If.prototype._runValueChanged = function _runValueChanged(newValue) {
      var _this2 = this;

      if (!newValue) {
        var viewOrPromise = void 0;
        if (this.view !== null && this.showing) {
          viewOrPromise = this.viewSlot.remove(this.view);
          if (viewOrPromise instanceof Promise) {
            viewOrPromise.then(function () {
              return _this2.view.unbind();
            });
          } else {
            this.view.unbind();
          }
        }

        this.showing = false;
        return viewOrPromise;
      }

      if (this.view === null) {
        this.view = this.viewFactory.create();
      }

      if (!this.view.isBound) {
        this.view.bind(this.bindingContext, this.overrideContext);
      }

      if (!this.showing) {
        this.showing = true;
        return this.viewSlot.add(this.view);
      }

      return undefined;
    };

    If.prototype.unbind = function unbind() {
      if (this.view === null) {
        return;
      }

      this.view.unbind();

      if (!this.viewFactory.isCaching) {
        return;
      }

      if (this.showing) {
        this.showing = false;
        this.viewSlot.remove(this.view, true, true);
      }
      this.view.returnToCache();
      this.view = null;
    };

    return If;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/with',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-binding'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.With = undefined;

  

  var _dec, _dec2, _class;

  var With = exports.With = (_dec = (0, _aureliaTemplating.customAttribute)('with'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function With(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.parentOverrideContext = null;
      this.view = null;
    }

    With.prototype.bind = function bind(bindingContext, overrideContext) {
      this.parentOverrideContext = overrideContext;
      this.valueChanged(this.value);
    };

    With.prototype.valueChanged = function valueChanged(newValue) {
      var overrideContext = (0, _aureliaBinding.createOverrideContext)(newValue, this.parentOverrideContext);
      if (!this.view) {
        this.view = this.viewFactory.create();
        this.view.bind(newValue, overrideContext);
        this.viewSlot.add(this.view);
      } else {
        this.view.bind(newValue, overrideContext);
      }
    };

    With.prototype.unbind = function unbind() {
      this.parentOverrideContext = null;

      if (this.view) {
        this.view.unbind();
      }
    };

    return With;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/repeat',['exports', 'aurelia-dependency-injection', 'aurelia-binding', 'aurelia-templating', './repeat-strategy-locator', './repeat-utilities', './analyze-view-factory', './abstract-repeater'], function (exports, _aureliaDependencyInjection, _aureliaBinding, _aureliaTemplating, _repeatStrategyLocator, _repeatUtilities, _analyzeViewFactory, _abstractRepeater) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Repeat = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var Repeat = exports.Repeat = (_dec = (0, _aureliaTemplating.customAttribute)('repeat'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.TargetInstruction, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaBinding.ObserverLocator, _repeatStrategyLocator.RepeatStrategyLocator), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = (_class2 = function (_AbstractRepeater) {
    _inherits(Repeat, _AbstractRepeater);

    function Repeat(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
      

      var _this = _possibleConstructorReturn(this, _AbstractRepeater.call(this, {
        local: 'item',
        viewsRequireLifecycle: (0, _analyzeViewFactory.viewsRequireLifecycle)(viewFactory)
      }));

      _initDefineProp(_this, 'items', _descriptor, _this);

      _initDefineProp(_this, 'local', _descriptor2, _this);

      _initDefineProp(_this, 'key', _descriptor3, _this);

      _initDefineProp(_this, 'value', _descriptor4, _this);

      _this.viewFactory = viewFactory;
      _this.instruction = instruction;
      _this.viewSlot = viewSlot;
      _this.lookupFunctions = viewResources.lookupFunctions;
      _this.observerLocator = observerLocator;
      _this.key = 'key';
      _this.value = 'value';
      _this.strategyLocator = strategyLocator;
      _this.ignoreMutation = false;
      _this.sourceExpression = (0, _repeatUtilities.getItemsSourceExpression)(_this.instruction, 'repeat.for');
      _this.isOneTime = (0, _repeatUtilities.isOneTime)(_this.sourceExpression);
      _this.viewsRequireLifecycle = (0, _analyzeViewFactory.viewsRequireLifecycle)(viewFactory);
      return _this;
    }

    Repeat.prototype.call = function call(context, changes) {
      this[context](this.items, changes);
    };

    Repeat.prototype.bind = function bind(bindingContext, overrideContext) {
      this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
      this.matcherBinding = this._captureAndRemoveMatcherBinding();
      this.itemsChanged();
    };

    Repeat.prototype.unbind = function unbind() {
      this.scope = null;
      this.items = null;
      this.matcherBinding = null;
      this.viewSlot.removeAll(true);
      this._unsubscribeCollection();
    };

    Repeat.prototype._unsubscribeCollection = function _unsubscribeCollection() {
      if (this.collectionObserver) {
        this.collectionObserver.unsubscribe(this.callContext, this);
        this.collectionObserver = null;
        this.callContext = null;
      }
    };

    Repeat.prototype.itemsChanged = function itemsChanged() {
      this._unsubscribeCollection();

      if (!this.scope) {
        return;
      }

      var items = this.items;
      this.strategy = this.strategyLocator.getStrategy(items);
      if (!this.strategy) {
        throw new Error('Value for \'' + this.sourceExpression + '\' is non-repeatable');
      }

      if (!this.isOneTime && !this._observeInnerCollection()) {
        this._observeCollection();
      }
      this.strategy.instanceChanged(this, items);
    };

    Repeat.prototype._getInnerCollection = function _getInnerCollection() {
      var expression = (0, _repeatUtilities.unwrapExpression)(this.sourceExpression);
      if (!expression) {
        return null;
      }
      return expression.evaluate(this.scope, null);
    };

    Repeat.prototype.handleCollectionMutated = function handleCollectionMutated(collection, changes) {
      if (!this.collectionObserver) {
        return;
      }
      this.strategy.instanceMutated(this, collection, changes);
    };

    Repeat.prototype.handleInnerCollectionMutated = function handleInnerCollectionMutated(collection, changes) {
      var _this2 = this;

      if (!this.collectionObserver) {
        return;
      }

      if (this.ignoreMutation) {
        return;
      }
      this.ignoreMutation = true;
      var newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
      this.observerLocator.taskQueue.queueMicroTask(function () {
        return _this2.ignoreMutation = false;
      });

      if (newItems === this.items) {
        this.itemsChanged();
      } else {
        this.items = newItems;
      }
    };

    Repeat.prototype._observeInnerCollection = function _observeInnerCollection() {
      var items = this._getInnerCollection();
      var strategy = this.strategyLocator.getStrategy(items);
      if (!strategy) {
        return false;
      }
      this.collectionObserver = strategy.getCollectionObserver(this.observerLocator, items);
      if (!this.collectionObserver) {
        return false;
      }
      this.callContext = 'handleInnerCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
      return true;
    };

    Repeat.prototype._observeCollection = function _observeCollection() {
      var items = this.items;
      this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
      if (this.collectionObserver) {
        this.callContext = 'handleCollectionMutated';
        this.collectionObserver.subscribe(this.callContext, this);
      }
    };

    Repeat.prototype._captureAndRemoveMatcherBinding = function _captureAndRemoveMatcherBinding() {
      if (this.viewFactory.viewFactory) {
        var instructions = this.viewFactory.viewFactory.instructions;
        var instructionIds = Object.keys(instructions);
        for (var i = 0; i < instructionIds.length; i++) {
          var expressions = instructions[instructionIds[i]].expressions;
          if (expressions) {
            for (var ii = 0; i < expressions.length; i++) {
              if (expressions[ii].targetProperty === 'matcher') {
                var matcherBinding = expressions[ii];
                expressions.splice(ii, 1);
                return matcherBinding;
              }
            }
          }
        }
      }

      return undefined;
    };

    Repeat.prototype.viewCount = function viewCount() {
      return this.viewSlot.children.length;
    };

    Repeat.prototype.views = function views() {
      return this.viewSlot.children;
    };

    Repeat.prototype.view = function view(index) {
      return this.viewSlot.children[index];
    };

    Repeat.prototype.matcher = function matcher() {
      return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null;
    };

    Repeat.prototype.addView = function addView(bindingContext, overrideContext) {
      var view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.add(view);
    };

    Repeat.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
      var view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.insert(index, view);
    };

    Repeat.prototype.moveView = function moveView(sourceIndex, targetIndex) {
      this.viewSlot.move(sourceIndex, targetIndex);
    };

    Repeat.prototype.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
      return this.viewSlot.removeAll(returnToCache, skipAnimation);
    };

    Repeat.prototype.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
      return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
    };

    Repeat.prototype.removeView = function removeView(index, returnToCache, skipAnimation) {
      return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
    };

    Repeat.prototype.updateBindings = function updateBindings(view) {
      var j = view.bindings.length;
      while (j--) {
        (0, _repeatUtilities.updateOneTimeBinding)(view.bindings[j]);
      }
      j = view.controllers.length;
      while (j--) {
        var k = view.controllers[j].boundProperties.length;
        while (k--) {
          var binding = view.controllers[j].boundProperties[k].binding;
          (0, _repeatUtilities.updateOneTimeBinding)(binding);
        }
      }
    };

    return Repeat;
  }(_abstractRepeater.AbstractRepeater), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'items', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'local', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'key', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'value', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class) || _class);
});
define('aurelia-templating-resources/repeat-strategy-locator',['exports', './null-repeat-strategy', './array-repeat-strategy', './map-repeat-strategy', './set-repeat-strategy', './number-repeat-strategy'], function (exports, _nullRepeatStrategy, _arrayRepeatStrategy, _mapRepeatStrategy, _setRepeatStrategy, _numberRepeatStrategy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RepeatStrategyLocator = undefined;

  

  var RepeatStrategyLocator = exports.RepeatStrategyLocator = function () {
    function RepeatStrategyLocator() {
      

      this.matchers = [];
      this.strategies = [];

      this.addStrategy(function (items) {
        return items === null || items === undefined;
      }, new _nullRepeatStrategy.NullRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Array;
      }, new _arrayRepeatStrategy.ArrayRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Map;
      }, new _mapRepeatStrategy.MapRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Set;
      }, new _setRepeatStrategy.SetRepeatStrategy());
      this.addStrategy(function (items) {
        return typeof items === 'number';
      }, new _numberRepeatStrategy.NumberRepeatStrategy());
    }

    RepeatStrategyLocator.prototype.addStrategy = function addStrategy(matcher, strategy) {
      this.matchers.push(matcher);
      this.strategies.push(strategy);
    };

    RepeatStrategyLocator.prototype.getStrategy = function getStrategy(items) {
      var matchers = this.matchers;

      for (var i = 0, ii = matchers.length; i < ii; ++i) {
        if (matchers[i](items)) {
          return this.strategies[i];
        }
      }

      return null;
    };

    return RepeatStrategyLocator;
  }();
});
define('aurelia-templating-resources/null-repeat-strategy',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var NullRepeatStrategy = exports.NullRepeatStrategy = function () {
    function NullRepeatStrategy() {
      
    }

    NullRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      repeat.removeAllViews(true);
    };

    NullRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {};

    return NullRepeatStrategy;
  }();
});
define('aurelia-templating-resources/array-repeat-strategy',['exports', './repeat-utilities', 'aurelia-binding'], function (exports, _repeatUtilities, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ArrayRepeatStrategy = undefined;

  

  var ArrayRepeatStrategy = exports.ArrayRepeatStrategy = function () {
    function ArrayRepeatStrategy() {
      
    }

    ArrayRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getArrayObserver(items);
    };

    ArrayRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var itemsLength = items.length;

      if (!items || itemsLength === 0) {
        repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        return;
      }

      var children = repeat.views();
      var viewsLength = children.length;

      if (viewsLength === 0) {
        this._standardProcessInstanceChanged(repeat, items);
        return;
      }

      if (repeat.viewsRequireLifecycle) {
        (function () {
          var childrenSnapshot = children.slice(0);
          var itemNameInBindingContext = repeat.local;
          var matcher = repeat.matcher();

          var itemsPreviouslyInViews = [];
          var viewsToRemove = [];

          for (var index = 0; index < viewsLength; index++) {
            var view = childrenSnapshot[index];
            var oldItem = view.bindingContext[itemNameInBindingContext];

            if ((0, _repeatUtilities.indexOf)(items, oldItem, matcher) === -1) {
              viewsToRemove.push(view);
            } else {
              itemsPreviouslyInViews.push(oldItem);
            }
          }

          var updateViews = void 0;
          var removePromise = void 0;

          if (itemsPreviouslyInViews.length > 0) {
            removePromise = repeat.removeViews(viewsToRemove, true, !repeat.viewsRequireLifecycle);
            updateViews = function updateViews() {
              for (var _index = 0; _index < itemsLength; _index++) {
                var item = items[_index];
                var indexOfView = (0, _repeatUtilities.indexOf)(itemsPreviouslyInViews, item, matcher, _index);
                var _view = void 0;

                if (indexOfView === -1) {
                  var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[_index], _index, itemsLength);
                  repeat.insertView(_index, overrideContext.bindingContext, overrideContext);

                  itemsPreviouslyInViews.splice(_index, 0, undefined);
                } else if (indexOfView === _index) {
                  _view = children[indexOfView];
                  itemsPreviouslyInViews[indexOfView] = undefined;
                } else {
                  _view = children[indexOfView];
                  repeat.moveView(indexOfView, _index);
                  itemsPreviouslyInViews.splice(indexOfView, 1);
                  itemsPreviouslyInViews.splice(_index, 0, undefined);
                }

                if (_view) {
                  (0, _repeatUtilities.updateOverrideContext)(_view.overrideContext, _index, itemsLength);
                }
              }

              _this._inPlaceProcessItems(repeat, items);
            };
          } else {
            removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            updateViews = function updateViews() {
              return _this._standardProcessInstanceChanged(repeat, items);
            };
          }

          if (removePromise instanceof Promise) {
            removePromise.then(updateViews);
          } else {
            updateViews();
          }
        })();
      } else {
        this._inPlaceProcessItems(repeat, items);
      }
    };

    ArrayRepeatStrategy.prototype._standardProcessInstanceChanged = function _standardProcessInstanceChanged(repeat, items) {
      for (var i = 0, ii = items.length; i < ii; i++) {
        var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[i], i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    ArrayRepeatStrategy.prototype._inPlaceProcessItems = function _inPlaceProcessItems(repeat, items) {
      var itemsLength = items.length;
      var viewsLength = repeat.viewCount();

      while (viewsLength > itemsLength) {
        viewsLength--;
        repeat.removeView(viewsLength, true, !repeat.viewsRequireLifecycle);
      }

      var local = repeat.local;

      for (var i = 0; i < viewsLength; i++) {
        var view = repeat.view(i);
        var last = i === itemsLength - 1;
        var middle = i !== 0 && !last;

        if (view.bindingContext[local] === items[i] && view.overrideContext.$middle === middle && view.overrideContext.$last === last) {
          continue;
        }

        view.bindingContext[local] = items[i];
        view.overrideContext.$middle = middle;
        view.overrideContext.$last = last;
        repeat.updateBindings(view);
      }

      for (var _i = viewsLength; _i < itemsLength; _i++) {
        var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[_i], _i, itemsLength);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    ArrayRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, array, splices) {
      var _this2 = this;

      if (repeat.__queuedSplices) {
        for (var i = 0, ii = splices.length; i < ii; ++i) {
          var _splices$i = splices[i],
              index = _splices$i.index,
              removed = _splices$i.removed,
              addedCount = _splices$i.addedCount;

          (0, _aureliaBinding.mergeSplice)(repeat.__queuedSplices, index, removed, addedCount);
        }

        repeat.__array = array.slice(0);
        return;
      }

      var maybePromise = this._runSplices(repeat, array.slice(0), splices);
      if (maybePromise instanceof Promise) {
        (function () {
          var queuedSplices = repeat.__queuedSplices = [];

          var runQueuedSplices = function runQueuedSplices() {
            if (!queuedSplices.length) {
              repeat.__queuedSplices = undefined;
              repeat.__array = undefined;
              return;
            }

            var nextPromise = _this2._runSplices(repeat, repeat.__array, queuedSplices) || Promise.resolve();
            queuedSplices = repeat.__queuedSplices = [];
            nextPromise.then(runQueuedSplices);
          };

          maybePromise.then(runQueuedSplices);
        })();
      }
    };

    ArrayRepeatStrategy.prototype._runSplices = function _runSplices(repeat, array, splices) {
      var _this3 = this;

      var removeDelta = 0;
      var rmPromises = [];

      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var splice = splices[i];
        var removed = splice.removed;

        for (var j = 0, jj = removed.length; j < jj; ++j) {
          var viewOrPromise = repeat.removeView(splice.index + removeDelta + rmPromises.length, true);
          if (viewOrPromise instanceof Promise) {
            rmPromises.push(viewOrPromise);
          }
        }
        removeDelta -= splice.addedCount;
      }

      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(function () {
          var spliceIndexLow = _this3._handleAddedSplices(repeat, array, splices);
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), spliceIndexLow);
        });
      }

      var spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
      (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), spliceIndexLow);

      return undefined;
    };

    ArrayRepeatStrategy.prototype._handleAddedSplices = function _handleAddedSplices(repeat, array, splices) {
      var spliceIndex = void 0;
      var spliceIndexLow = void 0;
      var arrayLength = array.length;
      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var splice = splices[i];
        var addIndex = spliceIndex = splice.index;
        var end = splice.index + splice.addedCount;

        if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
          spliceIndexLow = spliceIndex;
        }

        for (; addIndex < end; ++addIndex) {
          var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, array[addIndex], addIndex, arrayLength);
          repeat.insertView(addIndex, overrideContext.bindingContext, overrideContext);
        }
      }

      return spliceIndexLow;
    };

    return ArrayRepeatStrategy;
  }();
});
define('aurelia-templating-resources/repeat-utilities',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.updateOverrideContexts = updateOverrideContexts;
  exports.createFullOverrideContext = createFullOverrideContext;
  exports.updateOverrideContext = updateOverrideContext;
  exports.getItemsSourceExpression = getItemsSourceExpression;
  exports.unwrapExpression = unwrapExpression;
  exports.isOneTime = isOneTime;
  exports.updateOneTimeBinding = updateOneTimeBinding;
  exports.indexOf = indexOf;


  var oneTime = _aureliaBinding.bindingMode.oneTime;

  function updateOverrideContexts(views, startIndex) {
    var length = views.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
    }
  }

  function createFullOverrideContext(repeat, data, index, length, key) {
    var bindingContext = {};
    var overrideContext = (0, _aureliaBinding.createOverrideContext)(bindingContext, repeat.scope.overrideContext);

    if (typeof key !== 'undefined') {
      bindingContext[repeat.key] = key;
      bindingContext[repeat.value] = data;
    } else {
      bindingContext[repeat.local] = data;
    }
    updateOverrideContext(overrideContext, index, length);
    return overrideContext;
  }

  function updateOverrideContext(overrideContext, index, length) {
    var first = index === 0;
    var last = index === length - 1;
    var even = index % 2 === 0;

    overrideContext.$index = index;
    overrideContext.$first = first;
    overrideContext.$last = last;
    overrideContext.$middle = !(first || last);
    overrideContext.$odd = !even;
    overrideContext.$even = even;
  }

  function getItemsSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions.filter(function (bi) {
      return bi.originalAttrName === attrName;
    })[0].attributes.items.sourceExpression;
  }

  function unwrapExpression(expression) {
    var unwrapped = false;
    while (expression instanceof _aureliaBinding.BindingBehavior) {
      expression = expression.expression;
    }
    while (expression instanceof _aureliaBinding.ValueConverter) {
      expression = expression.expression;
      unwrapped = true;
    }
    return unwrapped ? expression : null;
  }

  function isOneTime(expression) {
    while (expression instanceof _aureliaBinding.BindingBehavior) {
      if (expression.name === 'oneTime') {
        return true;
      }
      expression = expression.expression;
    }
    return false;
  }

  function updateOneTimeBinding(binding) {
    if (binding.call && binding.mode === oneTime) {
      binding.call(_aureliaBinding.sourceContext);
    } else if (binding.updateOneTimeBindings) {
      binding.updateOneTimeBindings();
    }
  }

  function indexOf(array, item, matcher, startIndex) {
    if (!matcher) {
      return array.indexOf(item);
    }
    var length = array.length;
    for (var index = startIndex || 0; index < length; index++) {
      if (matcher(array[index], item)) {
        return index;
      }
    }
    return -1;
  }
});
define('aurelia-templating-resources/map-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MapRepeatStrategy = undefined;

  

  var MapRepeatStrategy = exports.MapRepeatStrategy = function () {
    function MapRepeatStrategy() {
      
    }

    MapRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getMapObserver(items);
    };

    MapRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, items);
        });
        return;
      }
      this._standardProcessItems(repeat, items);
    };

    MapRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
      var index = 0;
      var overrideContext = void 0;

      items.forEach(function (value, key) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, index, items.size, key);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    };

    MapRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, map, records) {
      var key = void 0;
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var removeIndex = void 0;
      var record = void 0;
      var rmPromises = [];
      var viewOrPromise = void 0;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        key = record.key;
        switch (record.type) {
          case 'update':
            removeIndex = this._getViewIndexByKey(repeat, key);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, map.get(key), removeIndex, map.size, key);
            repeat.insertView(removeIndex, overrideContext.bindingContext, overrideContext);
            break;
          case 'add':
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, map.get(key), map.size - 1, map.size, key);
            repeat.insertView(map.size - 1, overrideContext.bindingContext, overrideContext);
            break;
          case 'delete':
            if (record.oldValue === undefined) {
              return;
            }
            removeIndex = this._getViewIndexByKey(repeat, key);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            break;
          case 'clear':
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            break;
          default:
            continue;
        }
      }

      if (rmPromises.length > 0) {
        Promise.all(rmPromises).then(function () {
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
        });
      } else {
        (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
      }
    };

    MapRepeatStrategy.prototype._getViewIndexByKey = function _getViewIndexByKey(repeat, key) {
      var i = void 0;
      var ii = void 0;
      var child = void 0;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);
        if (child.bindingContext[repeat.key] === key) {
          return i;
        }
      }

      return undefined;
    };

    return MapRepeatStrategy;
  }();
});
define('aurelia-templating-resources/set-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SetRepeatStrategy = undefined;

  

  var SetRepeatStrategy = exports.SetRepeatStrategy = function () {
    function SetRepeatStrategy() {
      
    }

    SetRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getSetObserver(items);
    };

    SetRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, items);
        });
        return;
      }
      this._standardProcessItems(repeat, items);
    };

    SetRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
      var index = 0;
      var overrideContext = void 0;

      items.forEach(function (value) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, index, items.size);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    };

    SetRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, set, records) {
      var value = void 0;
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var removeIndex = void 0;
      var record = void 0;
      var rmPromises = [];
      var viewOrPromise = void 0;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        value = record.value;
        switch (record.type) {
          case 'add':
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, set.size - 1, set.size);
            repeat.insertView(set.size - 1, overrideContext.bindingContext, overrideContext);
            break;
          case 'delete':
            removeIndex = this._getViewIndexByValue(repeat, value);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            break;
          case 'clear':
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            break;
          default:
            continue;
        }
      }

      if (rmPromises.length > 0) {
        Promise.all(rmPromises).then(function () {
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
        });
      } else {
        (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
      }
    };

    SetRepeatStrategy.prototype._getViewIndexByValue = function _getViewIndexByValue(repeat, value) {
      var i = void 0;
      var ii = void 0;
      var child = void 0;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);
        if (child.bindingContext[repeat.local] === value) {
          return i;
        }
      }

      return undefined;
    };

    return SetRepeatStrategy;
  }();
});
define('aurelia-templating-resources/number-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NumberRepeatStrategy = undefined;

  

  var NumberRepeatStrategy = exports.NumberRepeatStrategy = function () {
    function NumberRepeatStrategy() {
      
    }

    NumberRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver() {
      return null;
    };

    NumberRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, value) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, value);
        });
        return;
      }
      this._standardProcessItems(repeat, value);
    };

    NumberRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, value) {
      var childrenLength = repeat.viewCount();
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var viewsToRemove = void 0;

      value = Math.floor(value);
      viewsToRemove = childrenLength - value;

      if (viewsToRemove > 0) {
        if (viewsToRemove > childrenLength) {
          viewsToRemove = childrenLength;
        }

        for (i = 0, ii = viewsToRemove; i < ii; ++i) {
          repeat.removeView(childrenLength - (i + 1), true, !repeat.viewsRequireLifecycle);
        }

        return;
      }

      for (i = childrenLength, ii = value; i < ii; ++i) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, i, i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }

      (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
    };

    return NumberRepeatStrategy;
  }();
});
define('aurelia-templating-resources/analyze-view-factory',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.viewsRequireLifecycle = viewsRequireLifecycle;
  var lifecycleOptionalBehaviors = exports.lifecycleOptionalBehaviors = ['focus', 'if', 'repeat', 'show', 'with'];

  function behaviorRequiresLifecycle(instruction) {
    var t = instruction.type;
    var name = t.elementName !== null ? t.elementName : t.attributeName;
    return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind) || t.viewFactory && viewsRequireLifecycle(t.viewFactory) || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function targetRequiresLifecycle(instruction) {
    var behaviors = instruction.behaviorInstructions;
    if (behaviors) {
      var i = behaviors.length;
      while (i--) {
        if (behaviorRequiresLifecycle(behaviors[i])) {
          return true;
        }
      }
    }

    return instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function viewsRequireLifecycle(viewFactory) {
    if ('_viewsRequireLifecycle' in viewFactory) {
      return viewFactory._viewsRequireLifecycle;
    }

    viewFactory._viewsRequireLifecycle = false;

    if (viewFactory.viewFactory) {
      viewFactory._viewsRequireLifecycle = viewsRequireLifecycle(viewFactory.viewFactory);
      return viewFactory._viewsRequireLifecycle;
    }

    if (viewFactory.template.querySelector('.au-animate')) {
      viewFactory._viewsRequireLifecycle = true;
      return true;
    }

    for (var id in viewFactory.instructions) {
      if (targetRequiresLifecycle(viewFactory.instructions[id])) {
        viewFactory._viewsRequireLifecycle = true;
        return true;
      }
    }

    viewFactory._viewsRequireLifecycle = false;
    return false;
  }
});
define('aurelia-templating-resources/abstract-repeater',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var AbstractRepeater = exports.AbstractRepeater = function () {
    function AbstractRepeater(options) {
      

      Object.assign(this, {
        local: 'items',
        viewsRequireLifecycle: true
      }, options);
    }

    AbstractRepeater.prototype.viewCount = function viewCount() {
      throw new Error('subclass must implement `viewCount`');
    };

    AbstractRepeater.prototype.views = function views() {
      throw new Error('subclass must implement `views`');
    };

    AbstractRepeater.prototype.view = function view(index) {
      throw new Error('subclass must implement `view`');
    };

    AbstractRepeater.prototype.matcher = function matcher() {
      throw new Error('subclass must implement `matcher`');
    };

    AbstractRepeater.prototype.addView = function addView(bindingContext, overrideContext) {
      throw new Error('subclass must implement `addView`');
    };

    AbstractRepeater.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
      throw new Error('subclass must implement `insertView`');
    };

    AbstractRepeater.prototype.moveView = function moveView(sourceIndex, targetIndex) {
      throw new Error('subclass must implement `moveView`');
    };

    AbstractRepeater.prototype.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeAllViews`');
    };

    AbstractRepeater.prototype.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    };

    AbstractRepeater.prototype.removeView = function removeView(index, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    };

    AbstractRepeater.prototype.updateBindings = function updateBindings(view) {
      throw new Error('subclass must implement `updateBindings`');
    };

    return AbstractRepeater;
  }();
});
define('aurelia-templating-resources/show',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal', './aurelia-hide-style'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaPal, _aureliaHideStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Show = undefined;

  

  var _dec, _dec2, _class;

  var Show = exports.Show = (_dec = (0, _aureliaTemplating.customAttribute)('show'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
    function Show(element, animator, domBoundary) {
      

      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    Show.prototype.created = function created() {
      (0, _aureliaHideStyle.injectAureliaHideStyleAtBoundary)(this.domBoundary);
    };

    Show.prototype.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.animator.removeClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      } else {
        this.animator.addClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      }
    };

    Show.prototype.bind = function bind(bindingContext) {
      this.valueChanged(this.value);
    };

    return Show;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/aurelia-hide-style',['exports', 'aurelia-pal'], function (exports, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.aureliaHideClassName = undefined;
  exports.injectAureliaHideStyleAtHead = injectAureliaHideStyleAtHead;
  exports.injectAureliaHideStyleAtBoundary = injectAureliaHideStyleAtBoundary;
  var aureliaHideClassName = exports.aureliaHideClassName = 'aurelia-hide';

  var aureliaHideClass = '.' + aureliaHideClassName + ' { display:none !important; }';

  function injectAureliaHideStyleAtHead() {
    _aureliaPal.DOM.injectStyles(aureliaHideClass);
  }

  function injectAureliaHideStyleAtBoundary(domBoundary) {
    if (_aureliaPal.FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
      domBoundary.hasAureliaHideStyle = true;
      _aureliaPal.DOM.injectStyles(aureliaHideClass, domBoundary);
    }
  }
});
define('aurelia-templating-resources/hide',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal', './aurelia-hide-style'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaPal, _aureliaHideStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Hide = undefined;

  

  var _dec, _dec2, _class;

  var Hide = exports.Hide = (_dec = (0, _aureliaTemplating.customAttribute)('hide'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
    function Hide(element, animator, domBoundary) {
      

      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    Hide.prototype.created = function created() {
      (0, _aureliaHideStyle.injectAureliaHideStyleAtBoundary)(this.domBoundary);
    };

    Hide.prototype.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.animator.addClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      } else {
        this.animator.removeClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      }
    };

    Hide.prototype.bind = function bind(bindingContext) {
      this.valueChanged(this.value);
    };

    return Hide;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/sanitize-html',['exports', 'aurelia-binding', 'aurelia-dependency-injection', './html-sanitizer'], function (exports, _aureliaBinding, _aureliaDependencyInjection, _htmlSanitizer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SanitizeHTMLValueConverter = undefined;

  

  var _dec, _dec2, _class;

  var SanitizeHTMLValueConverter = exports.SanitizeHTMLValueConverter = (_dec = (0, _aureliaBinding.valueConverter)('sanitizeHTML'), _dec2 = (0, _aureliaDependencyInjection.inject)(_htmlSanitizer.HTMLSanitizer), _dec(_class = _dec2(_class = function () {
    function SanitizeHTMLValueConverter(sanitizer) {
      

      this.sanitizer = sanitizer;
    }

    SanitizeHTMLValueConverter.prototype.toView = function toView(untrustedMarkup) {
      if (untrustedMarkup === null || untrustedMarkup === undefined) {
        return null;
      }

      return this.sanitizer.sanitize(untrustedMarkup);
    };

    return SanitizeHTMLValueConverter;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/html-sanitizer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  var HTMLSanitizer = exports.HTMLSanitizer = function () {
    function HTMLSanitizer() {
      
    }

    HTMLSanitizer.prototype.sanitize = function sanitize(input) {
      return input.replace(SCRIPT_REGEX, '');
    };

    return HTMLSanitizer;
  }();
});
define('aurelia-templating-resources/replaceable',['exports', 'aurelia-dependency-injection', 'aurelia-templating'], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Replaceable = undefined;

  

  var _dec, _dec2, _class;

  var Replaceable = exports.Replaceable = (_dec = (0, _aureliaTemplating.customAttribute)('replaceable'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function Replaceable(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.view = null;
    }

    Replaceable.prototype.bind = function bind(bindingContext, overrideContext) {
      if (this.view === null) {
        this.view = this.viewFactory.create();
        this.viewSlot.add(this.view);
      }

      this.view.bind(bindingContext, overrideContext);
    };

    Replaceable.prototype.unbind = function unbind() {
      this.view.unbind();
    };

    return Replaceable;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/focus',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-pal'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _aureliaTaskQueue, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Focus = undefined;

  

  var _dec, _dec2, _class;

  var Focus = exports.Focus = (_dec = (0, _aureliaTemplating.customAttribute)('focus', _aureliaBinding.bindingMode.twoWay), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTaskQueue.TaskQueue), _dec(_class = _dec2(_class = function () {
    function Focus(element, taskQueue) {
      var _this = this;

      

      this.element = element;
      this.taskQueue = taskQueue;
      this.isAttached = false;
      this.needsApply = false;

      this.focusListener = function (e) {
        _this.value = true;
      };
      this.blurListener = function (e) {
        if (_aureliaPal.DOM.activeElement !== _this.element) {
          _this.value = false;
        }
      };
    }

    Focus.prototype.valueChanged = function valueChanged(newValue) {
      if (this.isAttached) {
        this._apply();
      } else {
        this.needsApply = true;
      }
    };

    Focus.prototype._apply = function _apply() {
      var _this2 = this;

      if (this.value) {
        this.taskQueue.queueMicroTask(function () {
          if (_this2.value) {
            _this2.element.focus();
          }
        });
      } else {
        this.element.blur();
      }
    };

    Focus.prototype.attached = function attached() {
      this.isAttached = true;
      if (this.needsApply) {
        this.needsApply = false;
        this._apply();
      }
      this.element.addEventListener('focus', this.focusListener);
      this.element.addEventListener('blur', this.blurListener);
    };

    Focus.prototype.detached = function detached() {
      this.isAttached = false;
      this.element.removeEventListener('focus', this.focusListener);
      this.element.removeEventListener('blur', this.blurListener);
    };

    return Focus;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/css-resource',['exports', 'aurelia-templating', 'aurelia-loader', 'aurelia-dependency-injection', 'aurelia-path', 'aurelia-pal'], function (exports, _aureliaTemplating, _aureliaLoader, _aureliaDependencyInjection, _aureliaPath, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._createCSSResource = _createCSSResource;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  

  var cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

  function fixupCSSUrls(address, css) {
    if (typeof css !== 'string') {
      throw new Error('Failed loading required CSS file: ' + address);
    }
    return css.replace(cssUrlMatcher, function (match, p1) {
      var quote = p1.charAt(0);
      if (quote === '\'' || quote === '"') {
        p1 = p1.substr(1, p1.length - 2);
      }
      return 'url(\'' + (0, _aureliaPath.relativeToFile)(p1, address) + '\')';
    });
  }

  var CSSResource = function () {
    function CSSResource(address) {
      

      this.address = address;
      this._scoped = null;
      this._global = false;
      this._alreadyGloballyInjected = false;
    }

    CSSResource.prototype.initialize = function initialize(container, target) {
      this._scoped = new target(this);
    };

    CSSResource.prototype.register = function register(registry, name) {
      if (name === 'scoped') {
        registry.registerViewEngineHooks(this._scoped);
      } else {
        this._global = true;
      }
    };

    CSSResource.prototype.load = function load(container) {
      var _this = this;

      return container.get(_aureliaLoader.Loader).loadText(this.address).catch(function (err) {
        return null;
      }).then(function (text) {
        text = fixupCSSUrls(_this.address, text);
        _this._scoped.css = text;
        if (_this._global) {
          _this._alreadyGloballyInjected = true;
          _aureliaPal.DOM.injectStyles(text);
        }
      });
    };

    return CSSResource;
  }();

  var CSSViewEngineHooks = function () {
    function CSSViewEngineHooks(owner) {
      

      this.owner = owner;
      this.css = null;
    }

    CSSViewEngineHooks.prototype.beforeCompile = function beforeCompile(content, resources, instruction) {
      if (instruction.targetShadowDOM) {
        _aureliaPal.DOM.injectStyles(this.css, content, true);
      } else if (_aureliaPal.FEATURE.scopedCSS) {
        var styleNode = _aureliaPal.DOM.injectStyles(this.css, content, true);
        styleNode.setAttribute('scoped', 'scoped');
      } else if (!this.owner._alreadyGloballyInjected) {
        _aureliaPal.DOM.injectStyles(this.css);
        this.owner._alreadyGloballyInjected = true;
      }
    };

    return CSSViewEngineHooks;
  }();

  function _createCSSResource(address) {
    var _dec, _class;

    var ViewCSS = (_dec = (0, _aureliaTemplating.resource)(new CSSResource(address)), _dec(_class = function (_CSSViewEngineHooks) {
      _inherits(ViewCSS, _CSSViewEngineHooks);

      function ViewCSS() {
        

        return _possibleConstructorReturn(this, _CSSViewEngineHooks.apply(this, arguments));
      }

      return ViewCSS;
    }(CSSViewEngineHooks)) || _class);

    return ViewCSS;
  }
});
define('aurelia-templating-resources/attr-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AttrBindingBehavior = undefined;

  

  var AttrBindingBehavior = exports.AttrBindingBehavior = function () {
    function AttrBindingBehavior() {
      
    }

    AttrBindingBehavior.prototype.bind = function bind(binding, source) {
      binding.targetObserver = new _aureliaBinding.DataAttributeObserver(binding.target, binding.targetProperty);
    };

    AttrBindingBehavior.prototype.unbind = function unbind(binding, source) {};

    return AttrBindingBehavior;
  }();
});
define('aurelia-templating-resources/binding-mode-behaviors',['exports', 'aurelia-binding', 'aurelia-metadata'], function (exports, _aureliaBinding, _aureliaMetadata) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TwoWayBindingBehavior = exports.OneWayBindingBehavior = exports.OneTimeBindingBehavior = undefined;

  

  var _dec, _class, _dec2, _class2, _dec3, _class3;

  var modeBindingBehavior = {
    bind: function bind(binding, source, lookupFunctions) {
      binding.originalMode = binding.mode;
      binding.mode = this.mode;
    },
    unbind: function unbind(binding, source) {
      binding.mode = binding.originalMode;
      binding.originalMode = null;
    }
  };

  var OneTimeBindingBehavior = exports.OneTimeBindingBehavior = (_dec = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec(_class = function OneTimeBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.oneTime;
  }) || _class);
  var OneWayBindingBehavior = exports.OneWayBindingBehavior = (_dec2 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec2(_class2 = function OneWayBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.oneWay;
  }) || _class2);
  var TwoWayBindingBehavior = exports.TwoWayBindingBehavior = (_dec3 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec3(_class3 = function TwoWayBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.twoWay;
  }) || _class3);
});
define('aurelia-templating-resources/throttle-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ThrottleBindingBehavior = undefined;

  

  function throttle(newValue) {
    var _this = this;

    var state = this.throttleState;
    var elapsed = +new Date() - state.last;
    if (elapsed >= state.delay) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
      state.last = +new Date();
      this.throttledMethod(newValue);
      return;
    }
    state.newValue = newValue;
    if (state.timeoutId === null) {
      state.timeoutId = setTimeout(function () {
        state.timeoutId = null;
        state.last = +new Date();
        _this.throttledMethod(state.newValue);
      }, state.delay - elapsed);
    }
  }

  var ThrottleBindingBehavior = exports.ThrottleBindingBehavior = function () {
    function ThrottleBindingBehavior() {
      
    }

    ThrottleBindingBehavior.prototype.bind = function bind(binding, source) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

      var methodToThrottle = 'updateTarget';
      if (binding.callSource) {
        methodToThrottle = 'callSource';
      } else if (binding.updateSource && binding.mode === _aureliaBinding.bindingMode.twoWay) {
        methodToThrottle = 'updateSource';
      }

      binding.throttledMethod = binding[methodToThrottle];
      binding.throttledMethod.originalName = methodToThrottle;

      binding[methodToThrottle] = throttle;

      binding.throttleState = {
        delay: delay,
        last: 0,
        timeoutId: null
      };
    };

    ThrottleBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var methodToRestore = binding.throttledMethod.originalName;
      binding[methodToRestore] = binding.throttledMethod;
      binding.throttledMethod = null;
      clearTimeout(binding.throttleState.timeoutId);
      binding.throttleState = null;
    };

    return ThrottleBindingBehavior;
  }();
});
define('aurelia-templating-resources/debounce-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DebounceBindingBehavior = undefined;

  

  function debounce(newValue) {
    var _this = this;

    var state = this.debounceState;
    if (state.immediate) {
      state.immediate = false;
      this.debouncedMethod(newValue);
      return;
    }
    clearTimeout(state.timeoutId);
    state.timeoutId = setTimeout(function () {
      return _this.debouncedMethod(newValue);
    }, state.delay);
  }

  var DebounceBindingBehavior = exports.DebounceBindingBehavior = function () {
    function DebounceBindingBehavior() {
      
    }

    DebounceBindingBehavior.prototype.bind = function bind(binding, source) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

      var methodToDebounce = 'updateTarget';
      if (binding.callSource) {
        methodToDebounce = 'callSource';
      } else if (binding.updateSource && binding.mode === _aureliaBinding.bindingMode.twoWay) {
        methodToDebounce = 'updateSource';
      }

      binding.debouncedMethod = binding[methodToDebounce];
      binding.debouncedMethod.originalName = methodToDebounce;

      binding[methodToDebounce] = debounce;

      binding.debounceState = {
        delay: delay,
        timeoutId: null,
        immediate: methodToDebounce === 'updateTarget' };
    };

    DebounceBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var methodToRestore = binding.debouncedMethod.originalName;
      binding[methodToRestore] = binding.debouncedMethod;
      binding.debouncedMethod = null;
      clearTimeout(binding.debounceState.timeoutId);
      binding.debounceState = null;
    };

    return DebounceBindingBehavior;
  }();
});
define('aurelia-templating-resources/signal-binding-behavior',['exports', './binding-signaler'], function (exports, _bindingSignaler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SignalBindingBehavior = undefined;

  

  var SignalBindingBehavior = exports.SignalBindingBehavior = function () {
    SignalBindingBehavior.inject = function inject() {
      return [_bindingSignaler.BindingSignaler];
    };

    function SignalBindingBehavior(bindingSignaler) {
      

      this.signals = bindingSignaler.signals;
    }

    SignalBindingBehavior.prototype.bind = function bind(binding, source) {
      if (!binding.updateTarget) {
        throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
      }
      if (arguments.length === 3) {
        var name = arguments[2];
        var bindings = this.signals[name] || (this.signals[name] = []);
        bindings.push(binding);
        binding.signalName = name;
      } else if (arguments.length > 3) {
        var names = Array.prototype.slice.call(arguments, 2);
        var i = names.length;
        while (i--) {
          var _name = names[i];
          var _bindings = this.signals[_name] || (this.signals[_name] = []);
          _bindings.push(binding);
        }
        binding.signalName = names;
      } else {
        throw new Error('Signal name is required.');
      }
    };

    SignalBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var name = binding.signalName;
      binding.signalName = null;
      if (Array.isArray(name)) {
        var names = name;
        var i = names.length;
        while (i--) {
          var n = names[i];
          var bindings = this.signals[n];
          bindings.splice(bindings.indexOf(binding), 1);
        }
      } else {
        var _bindings2 = this.signals[name];
        _bindings2.splice(_bindings2.indexOf(binding), 1);
      }
    };

    return SignalBindingBehavior;
  }();
});
define('aurelia-templating-resources/binding-signaler',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BindingSignaler = undefined;

  

  var BindingSignaler = exports.BindingSignaler = function () {
    function BindingSignaler() {
      

      this.signals = {};
    }

    BindingSignaler.prototype.signal = function signal(name) {
      var bindings = this.signals[name];
      if (!bindings) {
        return;
      }
      var i = bindings.length;
      while (i--) {
        bindings[i].call(_aureliaBinding.sourceContext);
      }
    };

    return BindingSignaler;
  }();
});
define('aurelia-templating-resources/update-trigger-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UpdateTriggerBindingBehavior = undefined;

  

  var _class, _temp;

  var eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
  var notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way bindings on input/select elements.';

  var UpdateTriggerBindingBehavior = exports.UpdateTriggerBindingBehavior = (_temp = _class = function () {
    function UpdateTriggerBindingBehavior(eventManager) {
      

      this.eventManager = eventManager;
    }

    UpdateTriggerBindingBehavior.prototype.bind = function bind(binding, source) {
      for (var _len = arguments.length, events = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        events[_key - 2] = arguments[_key];
      }

      if (events.length === 0) {
        throw new Error(eventNamesRequired);
      }
      if (binding.mode !== _aureliaBinding.bindingMode.twoWay) {
        throw new Error(notApplicableMessage);
      }

      var targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
      if (!targetObserver.handler) {
        throw new Error(notApplicableMessage);
      }
      binding.targetObserver = targetObserver;

      targetObserver.originalHandler = binding.targetObserver.handler;

      var handler = this.eventManager.createElementHandler(events);
      targetObserver.handler = handler;
    };

    UpdateTriggerBindingBehavior.prototype.unbind = function unbind(binding, source) {
      binding.targetObserver.handler = binding.targetObserver.originalHandler;
      binding.targetObserver.originalHandler = null;
    };

    return UpdateTriggerBindingBehavior;
  }(), _class.inject = [_aureliaBinding.EventManager], _temp);
});
define('aurelia-templating-resources/html-resource-plugin',['exports', 'aurelia-templating', './dynamic-element'], function (exports, _aureliaTemplating, _dynamicElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getElementName = getElementName;
  exports.configure = configure;
  function getElementName(address) {
    return (/([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase()
    );
  }

  function configure(config) {
    var viewEngine = config.container.get(_aureliaTemplating.ViewEngine);
    var loader = config.aurelia.loader;

    viewEngine.addResourcePlugin('.html', {
      'fetch': function fetch(address) {
        return loader.loadTemplate(address).then(function (registryEntry) {
          var _ref;

          var bindable = registryEntry.template.getAttribute('bindable');
          var elementName = getElementName(address);

          if (bindable) {
            bindable = bindable.split(',').map(function (x) {
              return x.trim();
            });
            registryEntry.template.removeAttribute('bindable');
          } else {
            bindable = [];
          }

          return _ref = {}, _ref[elementName] = (0, _dynamicElement._createDynamicElement)(elementName, address, bindable), _ref;
        });
      }
    });
  }
});
define('aurelia-templating-resources/dynamic-element',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._createDynamicElement = _createDynamicElement;

  

  function _createDynamicElement(name, viewUrl, bindableNames) {
    var _dec, _dec2, _class;

    var DynamicElement = (_dec = (0, _aureliaTemplating.customElement)(name), _dec2 = (0, _aureliaTemplating.useView)(viewUrl), _dec(_class = _dec2(_class = function () {
      function DynamicElement() {
        
      }

      DynamicElement.prototype.bind = function bind(bindingContext) {
        this.$parent = bindingContext;
      };

      return DynamicElement;
    }()) || _class) || _class);

    for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
      (0, _aureliaTemplating.bindable)(bindableNames[i])(DynamicElement);
    }
    return DynamicElement;
  }
});
define('aurelia-i18n/i18n',['exports', 'i18next', 'aurelia-pal', 'aurelia-event-aggregator', 'aurelia-templating-resources'], function (exports, _i18next, _aureliaPal, _aureliaEventAggregator, _aureliaTemplatingResources) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.I18N = undefined;

  var _i18next2 = _interopRequireDefault(_i18next);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  

  var _class, _temp;

  var I18N = exports.I18N = (_temp = _class = function () {
    function I18N(ea, signaler) {
      var _this = this;

      

      this.globalVars = {};
      this.params = {};
      this.i18nextDefered = {
        resolve: null,
        promise: null
      };

      this.i18next = _i18next2.default;
      this.ea = ea;
      this.Intl = window.Intl;
      this.signaler = signaler;
      this.i18nextDefered.promise = new Promise(function (resolve) {
        return _this.i18nextDefered.resolve = resolve;
      });
    }

    I18N.prototype.setup = function setup(options) {
      var _this2 = this;

      var defaultOptions = {
        compatibilityAPI: 'v1',
        compatibilityJSON: 'v1',
        lng: 'en',
        attributes: ['t', 'i18n'],
        fallbackLng: 'en',
        debug: false
      };

      _i18next2.default.init(options || defaultOptions, function (err, t) {
        if (_i18next2.default.options.attributes instanceof String) {
          _i18next2.default.options.attributes = [_i18next2.default.options.attributes];
        }

        _this2.i18nextDefered.resolve(_this2.i18next);
      });

      return this.i18nextDefered.promise;
    };

    I18N.prototype.i18nextReady = function i18nextReady() {
      return this.i18nextDefered.promise;
    };

    I18N.prototype.setLocale = function setLocale(locale) {
      var _this3 = this;

      return new Promise(function (resolve) {
        var oldLocale = _this3.getLocale();
        _this3.i18next.changeLanguage(locale, function (err, tr) {
          _this3.ea.publish('i18n:locale:changed', { oldValue: oldLocale, newValue: locale });
          _this3.signaler.signal('aurelia-translation-signal');
          resolve(tr);
        });
      });
    };

    I18N.prototype.getLocale = function getLocale() {
      return this.i18next.language;
    };

    I18N.prototype.nf = function nf(options, locales) {
      return new this.Intl.NumberFormat(locales || this.getLocale(), options || {});
    };

    I18N.prototype.uf = function uf(number, locale) {
      var nf = this.nf({}, locale || this.getLocale());
      var comparer = nf.format(10000 / 3);

      var thousandSeparator = comparer[1];
      var decimalSeparator = comparer[5];

      var result = number.replace(thousandSeparator, '').replace(/[^\d.,-]/g, '').replace(decimalSeparator, '.');

      return Number(result);
    };

    I18N.prototype.df = function df(options, locales) {
      return new this.Intl.DateTimeFormat(locales || this.getLocale(), options);
    };

    I18N.prototype.tr = function tr(key, options) {
      var fullOptions = this.globalVars;

      if (options !== undefined) {
        fullOptions = Object.assign(Object.assign({}, this.globalVars), options);
      }

      return this.i18next.t(key, fullOptions);
    };

    I18N.prototype.registerGlobalVariable = function registerGlobalVariable(key, value) {
      this.globalVars[key] = value;
    };

    I18N.prototype.unregisterGlobalVariable = function unregisterGlobalVariable(key) {
      delete this.globalVars[key];
    };

    I18N.prototype.updateTranslations = function updateTranslations(el) {
      if (!el || !el.querySelectorAll) {
        return;
      }

      var i = void 0;
      var l = void 0;

      var selector = [].concat(this.i18next.options.attributes);
      for (i = 0, l = selector.length; i < l; i++) {
        selector[i] = '[' + selector[i] + ']';
      }selector = selector.join(',');

      var nodes = el.querySelectorAll(selector);
      for (i = 0, l = nodes.length; i < l; i++) {
        var node = nodes[i];
        var keys = void 0;

        for (var i2 = 0, l2 = this.i18next.options.attributes.length; i2 < l2; i2++) {
          keys = node.getAttribute(this.i18next.options.attributes[i2]);
          if (keys) break;
        }

        if (!keys) continue;

        this.updateValue(node, keys);
      }
    };

    I18N.prototype.updateValue = function updateValue(node, value, params) {
      if (value === null || value === undefined) {
        return;
      }

      var keys = value.split(';');
      var i = keys.length;

      while (i--) {
        var key = keys[i];

        var re = /\[([a-z\-]*)\]/ig;

        var m = void 0;
        var attr = 'text';

        if (node.nodeName === 'IMG') attr = 'src';

        while ((m = re.exec(key)) !== null) {
          if (m.index === re.lastIndex) {
            re.lastIndex++;
          }
          if (m) {
            key = key.replace(m[0], '');
            attr = m[1];
          }
        }

        if (!node._textContent) node._textContent = node.textContent;
        if (!node._innerHTML) node._innerHTML = node.innerHTML;

        var attrCC = attr.replace(/-([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });

        switch (attr) {
          case 'text':
            var newChild = _aureliaPal.DOM.createTextNode(this.tr(key, params));
            if (node._newChild) {
              node.removeChild(node._newChild);
            }

            node._newChild = newChild;
            while (node.firstChild) {
              node.removeChild(node.firstChild);
            }
            node.appendChild(node._newChild);
            break;
          case 'prepend':
            var prependParser = _aureliaPal.DOM.createElement('div');
            prependParser.innerHTML = this.tr(key, params);
            for (var ni = node.childNodes.length - 1; ni >= 0; ni--) {
              if (node.childNodes[ni]._prepended) {
                node.removeChild(node.childNodes[ni]);
              }
            }

            for (var pi = prependParser.childNodes.length - 1; pi >= 0; pi--) {
              prependParser.childNodes[pi]._prepended = true;
              if (node.firstChild) {
                node.insertBefore(prependParser.childNodes[pi], node.firstChild);
              } else {
                node.appendChild(prependParser.childNodes[pi]);
              }
            }
            break;
          case 'append':
            var appendParser = _aureliaPal.DOM.createElement('div');
            appendParser.innerHTML = this.tr(key, params);
            for (var _ni = node.childNodes.length - 1; _ni >= 0; _ni--) {
              if (node.childNodes[_ni]._appended) {
                node.removeChild(node.childNodes[_ni]);
              }
            }

            while (appendParser.firstChild) {
              appendParser.firstChild._appended = true;
              node.appendChild(appendParser.firstChild);
            }
            break;
          case 'html':
            node.innerHTML = this.tr(key, params);
            break;
          default:
            if (node.au && node.au.controller && node.au.controller.viewModel && attrCC in node.au.controller.viewModel) {
              node.au.controller.viewModel[attrCC] = this.tr(key, params);
            } else {
              node.setAttribute(attr, this.tr(key, params));
            }

            break;
        }
      }
    };

    return I18N;
  }(), _class.inject = [_aureliaEventAggregator.EventAggregator, _aureliaTemplatingResources.BindingSignaler], _temp);
});
define('aurelia-i18n/relativeTime',['exports', './i18n', './defaultTranslations/relative.time', 'aurelia-event-aggregator'], function (exports, _i18n, _relative, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RelativeTime = undefined;

  

  var RelativeTime = exports.RelativeTime = function () {
    RelativeTime.inject = function inject() {
      return [_i18n.I18N, _aureliaEventAggregator.EventAggregator];
    };

    function RelativeTime(i18n, ea) {
      var _this = this;

      

      this.service = i18n;
      this.ea = ea;

      this.service.i18nextReady().then(function () {
        _this.setup();
      });
      this.ea.subscribe('i18n:locale:changed', function (locales) {
        _this.setup(locales);
      });
    }

    RelativeTime.prototype.setup = function setup(locales) {
      var trans = _relative.translations.default || _relative.translations;
      var key = locales && locales.newValue ? locales.newValue : this.service.getLocale();
      var fallbackLng = this.service.i18next.fallbackLng;
      var index = 0;

      if ((index = key.indexOf('-')) >= 0) {
        var baseLocale = key.substring(0, index);

        if (trans[baseLocale]) {
          this.addTranslationResource(baseLocale, trans[baseLocale].translation);
        }
      }

      if (trans[key]) {
        this.addTranslationResource(key, trans[key].translation);
      }
      if (trans[fallbackLng]) {
        this.addTranslationResource(key, trans[fallbackLng].translation);
      }
    };

    RelativeTime.prototype.addTranslationResource = function addTranslationResource(key, translation) {
      var options = this.service.i18next.options;

      if (options.interpolation && options.interpolation.prefix !== '__' || options.interpolation.suffix !== '__') {
        for (var subkey in translation) {
          translation[subkey] = translation[subkey].replace('__count__', options.interpolation.prefix + 'count' + options.interpolation.suffix);
        }
      }

      this.service.i18next.addResources(key, options.defaultNS, translation);
    };

    RelativeTime.prototype.getRelativeTime = function getRelativeTime(time) {
      var now = new Date();
      var diff = now.getTime() - time.getTime();

      var timeDiff = this.getTimeDiffDescription(diff, 'year', 31104000000);
      if (!timeDiff) {
        timeDiff = this.getTimeDiffDescription(diff, 'month', 2592000000);
        if (!timeDiff) {
          timeDiff = this.getTimeDiffDescription(diff, 'day', 86400000);
          if (!timeDiff) {
            timeDiff = this.getTimeDiffDescription(diff, 'hour', 3600000);
            if (!timeDiff) {
              timeDiff = this.getTimeDiffDescription(diff, 'minute', 60000);
              if (!timeDiff) {
                timeDiff = this.getTimeDiffDescription(diff, 'second', 1000);
                if (!timeDiff) {
                  timeDiff = this.service.tr('now');
                }
              }
            }
          }
        }
      }

      return timeDiff;
    };

    RelativeTime.prototype.getTimeDiffDescription = function getTimeDiffDescription(diff, unit, timeDivisor) {
      var unitAmount = (diff / timeDivisor).toFixed(0);
      if (unitAmount > 0) {
        return this.service.tr(unit, { count: parseInt(unitAmount, 10), context: 'ago' });
      } else if (unitAmount < 0) {
        var abs = Math.abs(unitAmount);
        return this.service.tr(unit, { count: abs, context: 'in' });
      }

      return null;
    };

    return RelativeTime;
  }();
});
define('aurelia-i18n/defaultTranslations/relative.time',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var translations = exports.translations = {
    ar: {
      translation: {
        'now': 'الآن',
        'second_ago': 'منذ __count__ ثانية',
        'second_ago_plural': 'منذ __count__ ثواني',
        'second_in': 'في __count__ ثانية',
        'second_in_plural': 'في __count__ ثواني',
        'minute_ago': 'منذ __count__ دقيقة',
        'minute_ago_plural': 'منذ __count__ دقائق',
        'minute_in': 'في __count__ دقيقة',
        'minute_in_plural': 'في __count__ دقائق',
        'hour_ago': 'منذ __count__ ساعة',
        'hour_ago_plural': 'منذ __count__ ساعات',
        'hour_in': 'في __count__ ساعة',
        'hour_in_plural': 'في __count__ ساعات',
        'day_ago': 'منذ __count__ يوم',
        'day_ago_plural': 'منذ __count__ أيام',
        'day_in': 'في __count__ يوم',
        'day_in_plural': 'في __count__ أيام'
      }
    },
    en: {
      translation: {
        'now': 'just now',
        'second_ago': '__count__ second ago',
        'second_ago_plural': '__count__ seconds ago',
        'second_in': 'in __count__ second',
        'second_in_plural': 'in __count__ seconds',
        'minute_ago': '__count__ minute ago',
        'minute_ago_plural': '__count__ minutes ago',
        'minute_in': 'in __count__ minute',
        'minute_in_plural': 'in __count__ minutes',
        'hour_ago': '__count__ hour ago',
        'hour_ago_plural': '__count__ hours ago',
        'hour_in': 'in __count__ hour',
        'hour_in_plural': 'in __count__ hours',
        'day_ago': '__count__ day ago',
        'day_ago_plural': '__count__ days ago',
        'day_in': 'in __count__ day',
        'day_in_plural': 'in __count__ days',
        'month_ago': '__count__ month ago',
        'month_ago_plural': '__count__ months ago',
        'month_in': 'in __count__ month',
        'month_in_plural': 'in __count__ months',
        'year_ago': '__count__ year ago',
        'year_ago_plural': '__count__ years ago',
        'year_in': 'in __count__ year',
        'year_in_plural': 'in __count__ years'
      }
    },
    it: {
      translation: {
        'now': 'adesso',
        'second_ago': '__count__ secondo fa',
        'second_ago_plural': '__count__ secondi fa',
        'second_in': 'in __count__ secondo',
        'second_in_plural': 'in __count__ secondi',
        'minute_ago': '__count__ minuto fa',
        'minute_ago_plural': '__count__ minuti fa',
        'minute_in': 'in __count__ minuto',
        'minute_in_plural': 'in __count__ minuti',
        'hour_ago': '__count__ ora fa',
        'hour_ago_plural': '__count__ ore fa',
        'hour_in': 'in __count__ ora',
        'hour_in_plural': 'in __count__ ore',
        'day_ago': '__count__ giorno fa',
        'day_ago_plural': '__count__ giorni fa',
        'day_in': 'in __count__ giorno',
        'day_in_plural': 'in __count__ giorni',
        'month_ago': '__count__ mese fa',
        'month_ago_plural': '__count__ mesi fa',
        'month_in': 'in __count__ mese',
        'month_in_plural': 'in __count__ mesi',
        'year_ago': '__count__ anno fa',
        'year_ago_plural': '__count__ anni fa',
        'year_in': 'in __count__ anno',
        'year_in_plural': 'in __count__ anni'
      }
    },
    de: {
      translation: {
        'now': 'jetzt gerade',
        'second_ago': 'vor __count__ Sekunde',
        'second_ago_plural': 'vor __count__ Sekunden',
        'second_in': 'in __count__ Sekunde',
        'second_in_plural': 'in __count__ Sekunden',
        'minute_ago': 'vor __count__ Minute',
        'minute_ago_plural': 'vor __count__ Minuten',
        'minute_in': 'in __count__ Minute',
        'minute_in_plural': 'in __count__ Minuten',
        'hour_ago': 'vor __count__ Stunde',
        'hour_ago_plural': 'vor __count__ Stunden',
        'hour_in': 'in __count__ Stunde',
        'hour_in_plural': 'in __count__ Stunden',
        'day_ago': 'vor __count__ Tag',
        'day_ago_plural': 'vor __count__ Tagen',
        'day_in': 'in __count__ Tag',
        'day_in_plural': 'in __count__ Tagen',
        'month_ago': 'vor __count__ Monat',
        'month_ago_plural': 'vor __count__ Monaten',
        'month_in': 'in __count__ Monat',
        'month_in_plural': 'in __count__ Monaten',
        'year_ago': 'vor __count__ Jahr',
        'year_ago_plural': 'vor __count__ Jahren',
        'year_in': 'in __count__ Jahr',
        'year_in_plural': 'in __count__ Jahren'
      }
    },
    nl: {
      translation: {
        'now': 'zonet',
        'second_ago': '__count__ seconde geleden',
        'second_ago_plural': '__count__ seconden geleden',
        'second_in': 'in __count__ seconde',
        'second_in_plural': 'in __count__ seconden',
        'minute_ago': '__count__ minuut geleden',
        'minute_ago_plural': '__count__ minuten geleden',
        'minute_in': 'in __count__ minuut',
        'minute_in_plural': 'in __count__ minuten',
        'hour_ago': '__count__ uur geleden',
        'hour_ago_plural': '__count__ uren geleden',
        'hour_in': 'in __count__ uur',
        'hour_in_plural': 'in __count__ uren',
        'day_ago': '__count__ dag geleden',
        'day_ago_plural': '__count__ dagen geleden',
        'day_in': 'in __count__ dag',
        'day_in_plural': 'in __count__ dagen',
        'month_ago': '__count__ maand geleden',
        'month_ago_plural': '__count__ maanden geleden',
        'month_in': 'in __count__ maand',
        'month_in_plural': 'in __count__ maanden',
        'year_ago': '__count__ jaar geleden',
        'year_ago_plural': '__count__ jaren geleden',
        'year_in': 'in __count__ jaar',
        'year_in_plural': 'in __count__ jaren'
      }
    },
    fr: {
      translation: {
        'now': 'maintenant',
        'second_ago': '__count__ seconde plus tôt',
        'second_ago_plural': '__count__ secondes plus tôt',
        'second_in': 'en __count__ seconde',
        'second_in_plural': 'en __count__ secondes',
        'minute_ago': '__count__ minute plus tôt',
        'minute_ago_plural': '__count__ minutes plus tôt',
        'minute_in': 'en __count__ minute',
        'minute_in_plural': 'en __count__ minutes',
        'hour_ago': '__count__ heure plus tôt',
        'hour_ago_plural': '__count__ heures plus tôt',
        'hour_in': 'en __count__ heure',
        'hour_in_plural': 'en __count__ heures',
        'day_ago': '__count__ jour plus tôt',
        'day_ago_plural': '__count__ jours plus tôt',
        'day_in': 'en __count__ jour',
        'day_in_plural': 'en __count__ jours'
      }
    },
    th: {
      translation: {
        'now': 'เมื่อกี้',
        'second_ago': '__count__ วินาที ที่ผ่านมา',
        'second_ago_plural': '__count__ วินาที ที่ผ่านมา',
        'second_in': 'อีก __count__ วินาที',
        'second_in_plural': 'อีก __count__ วินาที',
        'minute_ago': '__count__ นาที ที่ผ่านมา',
        'minute_ago_plural': '__count__ นาที ที่ผ่านมา',
        'minute_in': 'อีก __count__ นาที',
        'minute_in_plural': 'อีก __count__ นาที',
        'hour_ago': '__count__ ชั่วโมง ที่ผ่านมา',
        'hour_ago_plural': '__count__ ชั่วโมง ที่ผ่านมา',
        'hour_in': 'อีก __count__ ชั่วโมง',
        'hour_in_plural': 'อีก __count__ ชั่วโมง',
        'day_ago': '__count__ วัน ที่ผ่านมา',
        'day_ago_plural': '__count__ วัน ที่ผ่านมา',
        'day_in': 'อีก __count__ วัน',
        'day_in_plural': 'อีก __count__ วัน'
      }
    },
    sv: {
      translation: {
        'now': 'just nu',
        'second_ago': '__count__ sekund sedan',
        'second_ago_plural': '__count__ sekunder sedan',
        'second_in': 'om __count__ sekund',
        'second_in_plural': 'om __count__ sekunder',
        'minute_ago': '__count__ minut sedan',
        'minute_ago_plural': '__count__ minuter sedan',
        'minute_in': 'om __count__ minut',
        'minute_in_plural': 'om __count__ minuter',
        'hour_ago': '__count__ timme sedan',
        'hour_ago_plural': '__count__ timmar sedan',
        'hour_in': 'om __count__ timme',
        'hour_in_plural': 'om __count__ timmar',
        'day_ago': '__count__ dag sedan',
        'day_ago_plural': '__count__ dagar sedan',
        'day_in': 'om __count__ dag',
        'day_in_plural': 'om __count__ dagar'
      }
    },
    da: {
      translation: {
        'now': 'lige nu',
        'second_ago': '__count__ sekunder siden',
        'second_ago_plural': '__count__ sekunder siden',
        'second_in': 'om __count__ sekund',
        'second_in_plural': 'om __count__ sekunder',
        'minute_ago': '__count__ minut siden',
        'minute_ago_plural': '__count__ minutter siden',
        'minute_in': 'om __count__ minut',
        'minute_in_plural': 'om __count__ minutter',
        'hour_ago': '__count__ time siden',
        'hour_ago_plural': '__count__ timer siden',
        'hour_in': 'om __count__ time',
        'hour_in_plural': 'om __count__ timer',
        'day_ago': '__count__ dag siden',
        'day_ago_plural': '__count__ dage siden',
        'day_in': 'om __count__ dag',
        'day_in_plural': 'om __count__ dage'
      }
    },
    no: {
      translation: {
        'now': 'akkurat nå',
        'second_ago': '__count__ sekund siden',
        'second_ago_plural': '__count__ sekunder siden',
        'second_in': 'om __count__ sekund',
        'second_in_plural': 'om __count__ sekunder',
        'minute_ago': '__count__ minutt siden',
        'minute_ago_plural': '__count__ minutter siden',
        'minute_in': 'om __count__ minutt',
        'minute_in_plural': 'om __count__ minutter',
        'hour_ago': '__count__ time siden',
        'hour_ago_plural': '__count__ timer siden',
        'hour_in': 'om __count__ time',
        'hour_in_plural': 'om __count__ timer',
        'day_ago': '__count__ dag siden',
        'day_ago_plural': '__count__ dager siden',
        'day_in': 'om __count__ dag',
        'day_in_plural': 'om __count__ dager'
      }
    },
    jp: {
      translation: {
        'now': 'たった今',
        'second_ago': '__count__ 秒前',
        'second_ago_plural': '__count__ 秒前',
        'second_in': 'あと __count__ 秒',
        'second_in_plural': 'あと __count__ 秒',
        'minute_ago': '__count__ 分前',
        'minute_ago_plural': '__count__ 分前',
        'minute_in': 'あと __count__ 分',
        'minute_in_plural': 'あと __count__ 分',
        'hour_ago': '__count__ 時間前',
        'hour_ago_plural': '__count__ 時間前',
        'hour_in': 'あと __count__ 時間',
        'hour_in_plural': 'あと __count__ 時間',
        'day_ago': '__count__ 日間前',
        'day_ago_plural': '__count__ 日間前',
        'day_in': 'あと __count__ 日間',
        'day_in_plural': 'あと __count__ 日間'
      }
    },
    pt: {
      translation: {
        'now': 'neste exato momento',
        'second_ago': '__count__ segundo atrás',
        'second_ago_plural': '__count__ segundos atrás',
        'second_in': 'em __count__ segundo',
        'second_in_plural': 'em __count__ segundos',
        'minute_ago': '__count__ minuto atrás',
        'minute_ago_plural': '__count__ minutos atrás',
        'minute_in': 'em __count__ minuto',
        'minute_in_plural': 'em __count__ minutos',
        'hour_ago': '__count__ hora atrás',
        'hour_ago_plural': '__count__ horas atrás',
        'hour_in': 'em __count__ hora',
        'hour_in_plural': 'em __count__ horas',
        'day_ago': '__count__ dia atrás',
        'day_ago_plural': '__count__ dias atrás',
        'day_in': 'em __count__ dia',
        'day_in_plural': 'em __count__ dias',
        'month_ago': '__count__ mês atrás',
        'month_ago_plural': '__count__ meses atrás',
        'month_in': 'em __count__ mês',
        'month_in_plural': 'em __count__ meses',
        'year_ago': '__count__ ano atrás',
        'year_ago_plural': '__count__ anos atrás',
        'year_in': 'em __count__ ano',
        'year_in_plural': 'em __count__ anos'
      }
    },
    zh: {
      translation: {
        'now': '刚才',
        'second_ago': '__count__ 秒钟前',
        'second_ago_plural': '__count__ 秒钟前',
        'second_in': '__count__ 秒内',
        'second_in_plural': '__count__ 秒内',
        'minute_ago': '__count__ 分钟前',
        'minute_ago_plural': '__count__ 分钟前',
        'minute_in': '__count__ 分钟内',
        'minute_in_plural': '__count__ 分钟内',
        'hour_ago': '__count__ 小时前',
        'hour_ago_plural': '__count__ 小时前',
        'hour_in': '__count__ 小时内',
        'hour_in_plural': '__count__ 小时内',
        'day_ago': '__count__ 天前',
        'day_ago_plural': '__count__ 天前',
        'day_in': '__count__ 天内',
        'day_in_plural': '__count__ 天内',
        'month_ago': '__count__ 月前',
        'month_ago_plural': '__count__ 月前',
        'month_in': '__count__ 月内',
        'month_in_plural': '__count__ 月内',
        'year_ago': '__count__ 年前',
        'year_ago_plural': '__count__ 年前',
        'year_in': '__count__ 年内',
        'year_in_plural': '__count__ 年内'
      }
    },
    'zh-CN': {
      translation: {
        'now': '刚才',
        'second_ago': '__count__ 秒钟前',
        'second_ago_plural': '__count__ 秒钟前',
        'second_in': '__count__ 秒内',
        'second_in_plural': '__count__ 秒内',
        'minute_ago': '__count__ 分钟前',
        'minute_ago_plural': '__count__ 分钟前',
        'minute_in': '__count__ 分钟内',
        'minute_in_plural': '__count__ 分钟内',
        'hour_ago': '__count__ 小时前',
        'hour_ago_plural': '__count__ 小时前',
        'hour_in': '__count__ 小时内',
        'hour_in_plural': '__count__ 小时内',
        'day_ago': '__count__ 天前',
        'day_ago_plural': '__count__ 天前',
        'day_in': '__count__ 天内',
        'day_in_plural': '__count__ 天内',
        'month_ago': '__count__ 月前',
        'month_ago_plural': '__count__ 月前',
        'month_in': '__count__ 月内',
        'month_in_plural': '__count__ 月内',
        'year_ago': '__count__ 年前',
        'year_ago_plural': '__count__ 年前',
        'year_in': '__count__ 年内',
        'year_in_plural': '__count__ 年内'
      }
    },
    'zh-HK': {
      translation: {
        'now': '剛才',
        'second_ago': '__count__ 秒鐘前',
        'second_ago_plural': '__count__ 秒鐘前',
        'second_in': '__count__ 秒內',
        'second_in_plural': '__count__ 秒內',
        'minute_ago': '__count__ 分鐘前',
        'minute_ago_plural': '__count__ 分鐘前',
        'minute_in': '__count__ 分鐘內',
        'minute_in_plural': '__count__ 分鐘內',
        'hour_ago': '__count__ 小時前',
        'hour_ago_plural': '__count__ 小時前',
        'hour_in': '__count__ 小時內',
        'hour_in_plural': '__count__ 小時內',
        'day_ago': '__count__ 天前',
        'day_ago_plural': '__count__ 天前',
        'day_in': '__count__ 天內',
        'day_in_plural': '__count__ 天內',
        'month_ago': '__count__ 月前',
        'month_ago_plural': '__count__ 月前',
        'month_in': '__count__ 月內',
        'month_in_plural': '__count__ 月內',
        'year_ago': '__count__ 年前',
        'year_ago_plural': '__count__ 年前',
        'year_in': '__count__ 年內',
        'year_in_plural': '__count__ 年內'
      }
    },
    'zh-TW': {
      translation: {
        'now': '剛才',
        'second_ago': '__count__ 秒鐘前',
        'second_ago_plural': '__count__ 秒鐘前',
        'second_in': '__count__ 秒內',
        'second_in_plural': '__count__ 秒內',
        'minute_ago': '__count__ 分鐘前',
        'minute_ago_plural': '__count__ 分鐘前',
        'minute_in': '__count__ 分鐘內',
        'minute_in_plural': '__count__ 分鐘內',
        'hour_ago': '__count__ 小時前',
        'hour_ago_plural': '__count__ 小時前',
        'hour_in': '__count__ 小時內',
        'hour_in_plural': '__count__ 小時內',
        'day_ago': '__count__ 天前',
        'day_ago_plural': '__count__ 天前',
        'day_in': '__count__ 天內',
        'day_in_plural': '__count__ 天內',
        'month_ago': '__count__ 月前',
        'month_ago_plural': '__count__ 月前',
        'month_in': '__count__ 月內',
        'month_in_plural': '__count__ 月內',
        'year_ago': '__count__ 年前',
        'year_ago_plural': '__count__ 年前',
        'year_in': '__count__ 年內',
        'year_in_plural': '__count__ 年內'
      }
    }
  };
});
define('aurelia-i18n/df',['exports', 'aurelia-logging', './i18n', 'aurelia-templating-resources', 'aurelia-binding'], function (exports, _aureliaLogging, _i18n, _aureliaTemplatingResources, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DfBindingBehavior = exports.DfValueConverter = undefined;

  var LogManager = _interopRequireWildcard(_aureliaLogging);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  

  var DfValueConverter = exports.DfValueConverter = function () {
    DfValueConverter.inject = function inject() {
      return [_i18n.I18N];
    };

    function DfValueConverter(i18n) {
      

      this.service = i18n;
    }

    DfValueConverter.prototype.toView = function toView(value, dfOrOptions, locale, df) {
      if (value === null || typeof value === 'undefined' || typeof value === 'string' && value.trim() === '') {
        return value;
      }

      if (dfOrOptions && typeof dfOrOptions.format === 'function') {
        return dfOrOptions.format(value);
      } else if (df) {
        var i18nLogger = LogManager.getLogger('i18n');
        i18nLogger.warn('This ValueConverter signature is depcrecated and will be removed in future releases. Please use the signature [dfOrOptions, locale]');
      } else {
        df = this.service.df(dfOrOptions, locale || this.service.getLocale());
      }

      if (typeof value === 'string' && isNaN(value) && !Number.isInteger(value)) {
        value = new Date(value);
      }

      return df.format(value);
    };

    return DfValueConverter;
  }();

  var DfBindingBehavior = exports.DfBindingBehavior = function () {
    DfBindingBehavior.inject = function inject() {
      return [_aureliaTemplatingResources.SignalBindingBehavior];
    };

    function DfBindingBehavior(signalBindingBehavior) {
      

      this.signalBindingBehavior = signalBindingBehavior;
    }

    DfBindingBehavior.prototype.bind = function bind(binding, source) {
      this.signalBindingBehavior.bind(binding, source, 'aurelia-translation-signal');

      var sourceExpression = binding.sourceExpression;

      if (sourceExpression.rewritten) {
        return;
      }
      sourceExpression.rewritten = true;

      var expression = sourceExpression.expression;
      sourceExpression.expression = new _aureliaBinding.ValueConverter(expression, 'df', sourceExpression.args, [expression].concat(sourceExpression.args));
    };

    DfBindingBehavior.prototype.unbind = function unbind(binding, source) {
      this.signalBindingBehavior.unbind(binding, source);
    };

    return DfBindingBehavior;
  }();
});
define('aurelia-i18n/nf',['exports', 'aurelia-logging', './i18n', 'aurelia-templating-resources', 'aurelia-binding'], function (exports, _aureliaLogging, _i18n, _aureliaTemplatingResources, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NfBindingBehavior = exports.NfValueConverter = undefined;

  var LogManager = _interopRequireWildcard(_aureliaLogging);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  

  var NfValueConverter = exports.NfValueConverter = function () {
    NfValueConverter.inject = function inject() {
      return [_i18n.I18N];
    };

    function NfValueConverter(i18n) {
      

      this.service = i18n;
    }

    NfValueConverter.prototype.toView = function toView(value, nfOrOptions, locale, nf) {
      if (value === null || typeof value === 'undefined' || typeof value === 'string' && value.trim() === '') {
        return value;
      }

      if (nfOrOptions && typeof nfOrOptions.format === 'function') {
        return nfOrOptions.format(value);
      } else if (nf) {
        var i18nLogger = LogManager.getLogger('i18n');
        i18nLogger.warn('This ValueConverter signature is depcrecated and will be removed in future releases. Please use the signature [nfOrOptions, locale]');
      } else {
        nf = this.service.nf(nfOrOptions, locale || this.service.getLocale());
      }

      return nf.format(value);
    };

    return NfValueConverter;
  }();

  var NfBindingBehavior = exports.NfBindingBehavior = function () {
    NfBindingBehavior.inject = function inject() {
      return [_aureliaTemplatingResources.SignalBindingBehavior];
    };

    function NfBindingBehavior(signalBindingBehavior) {
      

      this.signalBindingBehavior = signalBindingBehavior;
    }

    NfBindingBehavior.prototype.bind = function bind(binding, source) {
      this.signalBindingBehavior.bind(binding, source, 'aurelia-translation-signal');

      var sourceExpression = binding.sourceExpression;

      if (sourceExpression.rewritten) {
        return;
      }
      sourceExpression.rewritten = true;

      var expression = sourceExpression.expression;
      sourceExpression.expression = new _aureliaBinding.ValueConverter(expression, 'nf', sourceExpression.args, [expression].concat(sourceExpression.args));
    };

    NfBindingBehavior.prototype.unbind = function unbind(binding, source) {
      this.signalBindingBehavior.unbind(binding, source);
    };

    return NfBindingBehavior;
  }();
});
define('aurelia-i18n/rt',['exports', './relativeTime'], function (exports, _relativeTime) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RtValueConverter = undefined;

  

  var RtValueConverter = exports.RtValueConverter = function () {
    RtValueConverter.inject = function inject() {
      return [_relativeTime.RelativeTime];
    };

    function RtValueConverter(relativeTime) {
      

      this.service = relativeTime;
    }

    RtValueConverter.prototype.toView = function toView(value) {
      if (value === null || typeof value === 'undefined' || typeof value === 'string' && value.trim() === '') {
        return value;
      }

      if (typeof value === 'string' && isNaN(value) && !Number.isInteger(value)) {
        value = new Date(value);
      }

      return this.service.getRelativeTime(value);
    };

    return RtValueConverter;
  }();
});
define('aurelia-i18n/t',['exports', './i18n', 'aurelia-event-aggregator', 'aurelia-templating', 'aurelia-templating-resources', 'aurelia-binding', './utils'], function (exports, _i18n, _aureliaEventAggregator, _aureliaTemplating, _aureliaTemplatingResources, _aureliaBinding, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TBindingBehavior = exports.TCustomAttribute = exports.TParamsCustomAttribute = exports.TValueConverter = undefined;

  var _dec, _class, _class2, _temp, _dec2, _class3, _class4, _temp2, _class5, _temp3;

  

  var TValueConverter = exports.TValueConverter = function () {
    TValueConverter.inject = function inject() {
      return [_i18n.I18N];
    };

    function TValueConverter(i18n) {
      

      this.service = i18n;
    }

    TValueConverter.prototype.toView = function toView(value, options) {
      return this.service.tr(value, options);
    };

    return TValueConverter;
  }();

  var TParamsCustomAttribute = exports.TParamsCustomAttribute = (_dec = (0, _aureliaTemplating.customAttribute)('t-params'), _dec(_class = (_temp = _class2 = function () {
    function TParamsCustomAttribute(element) {
      

      this.element = element;
    }

    TParamsCustomAttribute.prototype.valueChanged = function valueChanged() {};

    return TParamsCustomAttribute;
  }(), _class2.inject = [Element], _temp)) || _class);
  var TCustomAttribute = exports.TCustomAttribute = (_dec2 = (0, _aureliaTemplating.customAttribute)('t'), _dec2(_class3 = (_temp2 = _class4 = function () {
    function TCustomAttribute(element, i18n, ea, tparams) {
      

      this.element = element;
      this.service = i18n;
      this.ea = ea;
      this.lazyParams = tparams;
    }

    TCustomAttribute.prototype.bind = function bind() {
      var _this = this;

      this.params = this.lazyParams();

      if (this.params) {
        this.params.valueChanged = function (newParams, oldParams) {
          _this.paramsChanged(_this.value, newParams, oldParams);
        };
      }

      var p = this.params !== null ? this.params.value : undefined;
      this.subscription = this.ea.subscribe('i18n:locale:changed', function () {
        _this.service.updateValue(_this.element, _this.value, _this.params !== null ? _this.params.value : undefined);
      });

      this.service.updateValue(this.element, this.value, p);
    };

    TCustomAttribute.prototype.paramsChanged = function paramsChanged(newValue, newParams) {
      this.service.updateValue(this.element, newValue, newParams);
    };

    TCustomAttribute.prototype.valueChanged = function valueChanged(newValue) {
      var p = this.params !== null ? this.params.value : undefined;
      this.service.updateValue(this.element, newValue, p);
    };

    TCustomAttribute.prototype.unbind = function unbind() {
      if (this.subscription) {
        this.subscription.dispose();
      }
    };

    return TCustomAttribute;
  }(), _class4.inject = [Element, _i18n.I18N, _aureliaEventAggregator.EventAggregator, _utils.LazyOptional.of(TParamsCustomAttribute)], _temp2)) || _class3);
  var TBindingBehavior = exports.TBindingBehavior = (_temp3 = _class5 = function () {
    function TBindingBehavior(signalBindingBehavior) {
      

      this.signalBindingBehavior = signalBindingBehavior;
    }

    TBindingBehavior.prototype.bind = function bind(binding, source) {
      this.signalBindingBehavior.bind(binding, source, 'aurelia-translation-signal');

      var sourceExpression = binding.sourceExpression;

      if (sourceExpression.rewritten) {
        return;
      }
      sourceExpression.rewritten = true;

      var expression = sourceExpression.expression;
      sourceExpression.expression = new _aureliaBinding.ValueConverter(expression, 't', sourceExpression.args, [expression].concat(sourceExpression.args));
    };

    TBindingBehavior.prototype.unbind = function unbind(binding, source) {
      this.signalBindingBehavior.unbind(binding, source);
    };

    return TBindingBehavior;
  }(), _class5.inject = [_aureliaTemplatingResources.SignalBindingBehavior], _temp3);
});
define('aurelia-i18n/utils',['exports', 'aurelia-dependency-injection'], function (exports, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LazyOptional = exports.assignObjectToKeys = exports.extend = undefined;

  

  var _dec, _class;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var extend = exports.extend = function extend(destination, source) {
    for (var property in source) {
      destination[property] = source[property];
    }

    return destination;
  };

  var assignObjectToKeys = exports.assignObjectToKeys = function assignObjectToKeys(root, obj) {
    if (obj === undefined || obj === null) {
      return obj;
    }

    var opts = {};

    Object.keys(obj).map(function (key) {
      if (_typeof(obj[key]) === 'object') {
        extend(opts, assignObjectToKeys(key, obj[key]));
      } else {
        opts[root !== '' ? root + '.' + key : key] = obj[key];
      }
    });

    return opts;
  };

  var LazyOptional = exports.LazyOptional = (_dec = (0, _aureliaDependencyInjection.resolver)(), _dec(_class = function () {
    function LazyOptional(key) {
      

      this.key = key;
    }

    LazyOptional.prototype.get = function get(container) {
      var _this = this;

      return function () {
        if (container.hasResolver(_this.key, false)) {
          return container.get(_this.key);
        }
        return null;
      };
    };

    LazyOptional.of = function of(key) {
      return new LazyOptional(key);
    };

    return LazyOptional;
  }()) || _class);
});
define('aurelia-i18n/base-i18n',['exports', './i18n', 'aurelia-event-aggregator'], function (exports, _i18n, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BaseI18N = undefined;

  

  var _class, _temp;

  var BaseI18N = exports.BaseI18N = (_temp = _class = function () {
    function BaseI18N(i18n, element, ea) {
      var _this = this;

      

      this.i18n = i18n;
      this.element = element;

      this.__i18nDisposer = ea.subscribe('i18n:locale:changed', function () {
        _this.i18n.updateTranslations(_this.element);
      });
    }

    BaseI18N.prototype.attached = function attached() {
      this.i18n.updateTranslations(this.element);
    };

    BaseI18N.prototype.detached = function detached() {
      this.__i18nDisposer.dispose();
    };

    return BaseI18N;
  }(), _class.inject = [_i18n.I18N, Element, _aureliaEventAggregator.EventAggregator], _temp);
});
define('aurelia-i18n/aurelia-i18n-loader',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var _class, _temp;

  var Backend = exports.Backend = (_temp = _class = function () {
    Backend.with = function _with(loader) {
      this.loader = loader;
      return this;
    };

    function Backend(services) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      

      this.init(services, options);
      this.type = 'backend';
    }

    Backend.prototype.init = function init(services) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this.services = services;
      this.options = defaults(options, this.options || {}, getDefaults());
    };

    Backend.prototype.readMulti = function readMulti(languages, namespaces, callback) {
      var loadPath = this.options.loadPath;

      if (typeof this.options.loadPath === 'function') {
        loadPath = this.options.loadPath(languages, namespaces);
      }

      var url = this.services.interpolator.interpolate(loadPath, { lng: languages.join('+'), ns: namespaces.join('+') });

      this.loadUrl(url, callback);
    };

    Backend.prototype.read = function read(language, namespace, callback) {
      var loadPath = this.options.loadPath;

      if (typeof this.options.loadPath === 'function') {
        loadPath = this.options.loadPath([language], [namespace]);
      }

      var url = this.services.interpolator.interpolate(loadPath, { lng: language, ns: namespace });

      this.loadUrl(url, callback);
    };

    Backend.prototype.loadUrl = function loadUrl(url, callback) {
      var _this = this;

      this.constructor.loader.loadText(url).then(function (response) {
        var ret = void 0;
        var err = void 0;
        try {
          ret = _this.options.parse(response, url);
        } catch (e) {
          err = 'failed parsing ' + url + ' to json';
        }
        if (err) return callback(err, false);
        callback(null, ret);
      }, function (response) {
        return callback('failed loading ' + url, false);
      });
    };

    Backend.prototype.create = function create(languages, namespace, key, fallbackValue) {};

    return Backend;
  }(), _class.loader = null, _temp);


  Backend.type = 'backend';
  exports.default = Backend;

  var arr = [];
  var each = arr.forEach;
  var slice = arr.slice;

  function getDefaults() {
    return {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: 'locales/add/{{lng}}/{{ns}}',
      allowMultiLoading: false,
      parse: JSON.parse
    };
  }

  function defaults(obj) {
    each.call(slice.call(arguments, 1), function (source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === undefined) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  }
});
define('aurelia-auth/auth-service',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', 'aurelia-event-aggregator', './authentication', './base-config', './oAuth1', './oAuth2', './auth-utilities'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _aureliaEventAggregator, _authentication, _baseConfig, _oAuth, _oAuth2, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthService = undefined;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthService = exports.AuthService = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication, _oAuth.OAuth1, _oAuth2.OAuth2, _baseConfig.BaseConfig, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AuthService(http, auth, oAuth1, oAuth2, config, eventAggregator) {
      _classCallCheck(this, AuthService);

      this.http = http;
      this.auth = auth;
      this.oAuth1 = oAuth1;
      this.oAuth2 = oAuth2;
      this.config = config.current;
      this.tokenInterceptor = auth.tokenInterceptor;
      this.eventAggregator = eventAggregator;
    }

    AuthService.prototype.getMe = function getMe() {
      var profileUrl = this.auth.getProfileUrl();
      return this.http.fetch(profileUrl).then(_authUtilities.status);
    };

    AuthService.prototype.isAuthenticated = function isAuthenticated() {
      return this.auth.isAuthenticated();
    };

    AuthService.prototype.getTokenPayload = function getTokenPayload() {
      return this.auth.getPayload();
    };

    AuthService.prototype.setToken = function setToken(token) {
      this.auth.setToken(Object.defineProperty({}, this.config.tokenName, { value: token }));
    };

    AuthService.prototype.signup = function signup(displayName, email, password) {
      var _this = this;

      var signupUrl = this.auth.getSignupUrl();
      var content = void 0;
      if (_typeof(arguments[0]) === 'object') {
        content = arguments[0];
      } else {
        content = {
          'displayName': displayName,
          'email': email,
          'password': password
        };
      }

      return this.http.fetch(signupUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(content)
      }).then(_authUtilities.status).then(function (response) {
        if (_this.config.loginOnSignup) {
          _this.auth.setToken(response);
        } else if (_this.config.signupRedirect) {
          window.location.href = _this.config.signupRedirect;
        }
        _this.eventAggregator.publish('auth:signup', response);
        return response;
      });
    };

    AuthService.prototype.login = function login(email, password) {
      var _this2 = this;

      var loginUrl = this.auth.getLoginUrl();
      var content = void 0;
      if (typeof arguments[1] !== 'string') {
        content = arguments[0];
      } else {
        content = {
          'email': email,
          'password': password
        };
      }

      return this.http.fetch(loginUrl, {
        method: 'post',
        headers: typeof content === 'string' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {},
        body: typeof content === 'string' ? content : (0, _aureliaFetchClient.json)(content)
      }).then(_authUtilities.status).then(function (response) {
        _this2.auth.setToken(response);
        _this2.eventAggregator.publish('auth:login', response);
        return response;
      });
    };

    AuthService.prototype.logout = function logout(redirectUri) {
      var _this3 = this;

      return this.auth.logout(redirectUri).then(function () {
        _this3.eventAggregator.publish('auth:logout');
      });
    };

    AuthService.prototype.authenticate = function authenticate(name, redirect, userData) {
      var _this4 = this;

      var provider = this.oAuth2;
      if (this.config.providers[name].type === '1.0') {
        provider = this.oAuth1;
      }

      return provider.open(this.config.providers[name], userData || {}).then(function (response) {
        _this4.auth.setToken(response, redirect);
        _this4.eventAggregator.publish('auth:authenticate', response);
        return response;
      });
    };

    AuthService.prototype.unlink = function unlink(provider) {
      var _this5 = this;

      var unlinkUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

      if (this.config.unlinkMethod === 'get') {
        return this.http.fetch(unlinkUrl + provider).then(_authUtilities.status).then(function (response) {
          _this5.eventAggregator.publish('auth:unlink', response);
          return response;
        });
      } else if (this.config.unlinkMethod === 'post') {
        return this.http.fetch(unlinkUrl, {
          method: 'post',
          body: (0, _aureliaFetchClient.json)(provider)
        }).then(_authUtilities.status).then(function (response) {
          _this5.eventAggregator.publish('auth:unlink', response);
          return response;
        });
      }
    };

    return AuthService;
  }()) || _class);
});
define('aurelia-auth/authentication',['exports', 'aurelia-dependency-injection', './base-config', './storage', './auth-utilities'], function (exports, _aureliaDependencyInjection, _baseConfig, _storage, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Authentication = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var Authentication = exports.Authentication = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _baseConfig.BaseConfig), _dec(_class = function () {
    function Authentication(storage, config) {
      _classCallCheck(this, Authentication);

      this.storage = storage;
      this.config = config.current;
      this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
      this.idTokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
    }

    Authentication.prototype.getLoginRoute = function getLoginRoute() {
      return this.config.loginRoute;
    };

    Authentication.prototype.getLoginRedirect = function getLoginRedirect() {
      return this.initialUrl || this.config.loginRedirect;
    };

    Authentication.prototype.getLoginUrl = function getLoginUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
    };

    Authentication.prototype.getSignupUrl = function getSignupUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
    };

    Authentication.prototype.getProfileUrl = function getProfileUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
    };

    Authentication.prototype.getToken = function getToken() {
      return this.storage.get(this.tokenName);
    };

    Authentication.prototype.getPayload = function getPayload() {
      var token = this.storage.get(this.tokenName);
      return this.decomposeToken(token);
    };

    Authentication.prototype.decomposeToken = function decomposeToken(token) {
      if (token && token.split('.').length === 3) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        try {
          return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
        } catch (error) {
          return null;
        }
      }
    };

    Authentication.prototype.setInitialUrl = function setInitialUrl(url) {
      this.initialUrl = url;
    };

    Authentication.prototype.setToken = function setToken(response, redirect) {
      var accessToken = response && response[this.config.responseTokenProp];
      var tokenToStore = void 0;

      if (accessToken) {
        if ((0, _authUtilities.isObject)(accessToken) && (0, _authUtilities.isObject)(accessToken.data)) {
          response = accessToken;
        } else if ((0, _authUtilities.isString)(accessToken)) {
          tokenToStore = accessToken;
        }
      }

      if (!tokenToStore && response) {
        tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
      }

      if (tokenToStore) {
        this.storage.set(this.tokenName, tokenToStore);
      }

      var idToken = response && response[this.config.responseIdTokenProp];

      if (idToken) {
        this.storage.set(this.idTokenName, idToken);
      }

      if (this.config.loginRedirect && !redirect) {
        window.location.href = this.getLoginRedirect();
      } else if (redirect && (0, _authUtilities.isString)(redirect)) {
        window.location.href = window.encodeURI(redirect);
      }
    };

    Authentication.prototype.removeToken = function removeToken() {
      this.storage.remove(this.tokenName);
    };

    Authentication.prototype.isAuthenticated = function isAuthenticated() {
      var token = this.storage.get(this.tokenName);

      if (!token) {
        return false;
      }

      if (token.split('.').length !== 3) {
        return true;
      }

      var exp = void 0;
      try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        exp = JSON.parse(window.atob(base64)).exp;
      } catch (error) {
        return false;
      }

      if (exp) {
        return Math.round(new Date().getTime() / 1000) <= exp;
      }

      return true;
    };

    Authentication.prototype.logout = function logout(redirect) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.storage.remove(_this.tokenName);

        if (_this.config.logoutRedirect && !redirect) {
          window.location.href = _this.config.logoutRedirect;
        } else if ((0, _authUtilities.isString)(redirect)) {
          window.location.href = redirect;
        }

        resolve();
      });
    };

    _createClass(Authentication, [{
      key: 'tokenInterceptor',
      get: function get() {
        var config = this.config;
        var storage = this.storage;
        var auth = this;
        return {
          request: function request(_request) {
            if (auth.isAuthenticated() && config.httpInterceptor) {
              var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
              var token = storage.get(tokenName);

              if (config.authHeader && config.authToken) {
                token = config.authToken + ' ' + token;
              }

              _request.headers.set(config.authHeader, token);
            }
            return _request;
          }
        };
      }
    }]);

    return Authentication;
  }()) || _class);
});
define('aurelia-auth/base-config',['exports', './auth-utilities'], function (exports, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BaseConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var BaseConfig = exports.BaseConfig = function () {
    BaseConfig.prototype.configure = function configure(incomingConfig) {
      (0, _authUtilities.merge)(this._current, incomingConfig);
    };

    _createClass(BaseConfig, [{
      key: 'current',
      get: function get() {
        return this._current;
      }
    }]);

    function BaseConfig() {
      _classCallCheck(this, BaseConfig);

      this._current = {
        httpInterceptor: true,
        loginOnSignup: true,
        baseUrl: '/',
        loginRedirect: '#/',
        logoutRedirect: '#/',
        signupRedirect: '#/login',
        loginUrl: '/auth/login',
        signupUrl: '/auth/signup',
        profileUrl: '/auth/me',
        loginRoute: '/login',
        signupRoute: '/signup',
        tokenRoot: false,
        tokenName: 'token',
        idTokenName: 'id_token',
        tokenPrefix: 'aurelia',
        responseTokenProp: 'access_token',
        responseIdTokenProp: 'id_token',
        unlinkUrl: '/auth/unlink/',
        unlinkMethod: 'get',
        authHeader: 'Authorization',
        authToken: 'Bearer',
        withCredentials: true,
        platform: 'browser',
        storage: 'localStorage',
        providers: {
          identSrv: {
            name: 'identSrv',
            url: '/auth/identSrv',

            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['profile', 'openid'],
            responseType: 'code',
            scopePrefix: '',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope', 'nonce'],
            optionalUrlParams: ['display', 'state'],
            state: function state() {
              var rand = Math.random().toString(36).substr(2);
              return encodeURIComponent(rand);
            },
            display: 'popup',
            type: '2.0',
            clientId: 'jsClient',
            nonce: function nonce() {
              var val = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
              return encodeURIComponent(val);
            },
            popupOptions: { width: 452, height: 633 }
          },
          google: {
            name: 'google',
            url: '/auth/google',
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['profile', 'email'],
            scopePrefix: 'openid',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope'],
            optionalUrlParams: ['display', 'state'],
            display: 'popup',
            type: '2.0',
            state: function state() {
              var rand = Math.random().toString(36).substr(2);
              return encodeURIComponent(rand);
            },
            popupOptions: {
              width: 452,
              height: 633
            }
          },
          facebook: {
            name: 'facebook',
            url: '/auth/facebook',
            authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
            redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
            scope: ['email'],
            scopeDelimiter: ',',
            nonce: function nonce() {
              return Math.random();
            },
            requiredUrlParams: ['nonce', 'display', 'scope'],
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 580,
              height: 400
            }
          },
          linkedin: {
            name: 'linkedin',
            url: '/auth/linkedin',
            authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            requiredUrlParams: ['state'],
            scope: ['r_emailaddress'],
            scopeDelimiter: ' ',
            state: 'STATE',
            type: '2.0',
            popupOptions: {
              width: 527,
              height: 582
            }
          },
          github: {
            name: 'github',
            url: '/auth/github',
            authorizationEndpoint: 'https://github.com/login/oauth/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            optionalUrlParams: ['scope'],
            scope: ['user:email'],
            scopeDelimiter: ' ',
            type: '2.0',
            popupOptions: {
              width: 1020,
              height: 618
            }
          },
          yahoo: {
            name: 'yahoo',
            url: '/auth/yahoo',
            authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: [],
            scopeDelimiter: ',',
            type: '2.0',
            popupOptions: {
              width: 559,
              height: 519
            }
          },
          twitter: {
            name: 'twitter',
            url: '/auth/twitter',
            authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
            type: '1.0',
            popupOptions: {
              width: 495,
              height: 645
            }
          },
          live: {
            name: 'live',
            url: '/auth/live',
            authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['wl.emails'],
            scopeDelimiter: ' ',
            requiredUrlParams: ['display', 'scope'],
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 500,
              height: 560
            }
          },
          instagram: {
            name: 'instagram',
            url: '/auth/instagram',
            authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            requiredUrlParams: ['scope'],
            scope: ['basic'],
            scopeDelimiter: '+',
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 550,
              height: 369
            }
          }
        }
      };
    }

    return BaseConfig;
  }();
});
define('aurelia-auth/auth-utilities',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.status = status;
  exports.isDefined = isDefined;
  exports.camelCase = camelCase;
  exports.parseQueryString = parseQueryString;
  exports.isString = isString;
  exports.isObject = isObject;
  exports.isFunction = isFunction;
  exports.joinUrl = joinUrl;
  exports.isBlankObject = isBlankObject;
  exports.isArrayLike = isArrayLike;
  exports.isWindow = isWindow;
  exports.extend = extend;
  exports.merge = merge;
  exports.forEach = forEach;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var slice = [].slice;

  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }

  function baseExtend(dst, objs, deep) {
    var h = dst.$$hashKey;

    for (var i = 0, ii = objs.length; i < ii; ++i) {
      var obj = objs[i];
      if (!isObject(obj) && !isFunction(obj)) continue;
      var keys = Object.keys(obj);
      for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        var src = obj[key];

        if (deep && isObject(src)) {
          if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
          baseExtend(dst[key], [src], true);
        } else {
          dst[key] = src;
        }
      }
    }

    setHashKey(dst, h);
    return dst;
  }

  function status(response) {
    if (response.status >= 200 && response.status < 400) {
      return response.json().catch(function (error) {
        return null;
      });
    }

    throw response;
  }

  function isDefined(value) {
    return typeof value !== 'undefined';
  }

  function camelCase(name) {
    return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }

  function parseQueryString(keyValue) {
    var key = void 0;
    var value = void 0;
    var obj = {};

    forEach((keyValue || '').split('&'), function (kv) {
      if (kv) {
        value = kv.split('=');
        key = decodeURIComponent(value[0]);
        obj[key] = isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
      }
    });

    return obj;
  }

  function isString(value) {
    return typeof value === 'string';
  }

  function isObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  function joinUrl(baseUrl, url) {
    if (/^(?:[a-z]+:)?\/\//i.test(url)) {
      return url;
    }

    var joined = [baseUrl, url].join('/');
    var normalize = function normalize(str) {
      return str.replace(/[\/]+/g, '/').replace(/\/\?/g, '?').replace(/\/\#/g, '#').replace(/\:\//g, '://');
    };

    return normalize(joined);
  }

  function isBlankObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Object.getPrototypeOf(value);
  }

  function isArrayLike(obj) {
    if (obj === null || isWindow(obj)) {
      return false;
    }
  }

  function isWindow(obj) {
    return obj && obj.window === obj;
  }

  function extend(dst) {
    return baseExtend(dst, slice.call(arguments, 1), false);
  }

  function merge(dst) {
    return baseExtend(dst, slice.call(arguments, 1), true);
  }

  function forEach(obj, iterator, context) {
    var key = void 0;
    var length = void 0;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          if (key !== 'prototype' && key !== 'length' && key !== 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (Array.isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object';
        for (key = 0, length = obj.length; key < length; key++) {
          if (isPrimitive || key in obj) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
      } else if (isBlankObject(obj)) {
        for (key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      } else if (typeof obj.hasOwnProperty === 'function') {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else {
        for (key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      }
    }
    return obj;
  }
});
define('aurelia-auth/storage',['exports', 'aurelia-dependency-injection', './base-config'], function (exports, _aureliaDependencyInjection, _baseConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Storage = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Storage = exports.Storage = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Storage(config) {
      _classCallCheck(this, Storage);

      this.config = config.current;
      this.storage = this._getStorage(this.config.storage);
    }

    Storage.prototype.get = function get(key) {
      return this.storage.getItem(key);
    };

    Storage.prototype.set = function set(key, value) {
      return this.storage.setItem(key, value);
    };

    Storage.prototype.remove = function remove(key) {
      return this.storage.removeItem(key);
    };

    Storage.prototype._getStorage = function _getStorage(type) {
      if (type === 'localStorage') {
        if ('localStorage' in window && window.localStorage !== null) return localStorage;
        throw new Error('Local Storage is disabled or unavailable.');
      } else if (type === 'sessionStorage') {
        if ('sessionStorage' in window && window.sessionStorage !== null) return sessionStorage;
        throw new Error('Session Storage is disabled or unavailable.');
      }

      throw new Error('Invalid storage type specified: ' + type);
    };

    return Storage;
  }()) || _class);
});
define('aurelia-auth/oAuth1',['exports', 'aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtilities, _storage, _popup, _baseConfig, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OAuth1 = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OAuth1 = exports.OAuth1 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig), _dec(_class = function () {
    function OAuth1(storage, popup, http, config) {
      _classCallCheck(this, OAuth1);

      this.storage = storage;
      this.config = config.current;
      this.popup = popup;
      this.http = http;
      this.defaults = {
        url: null,
        name: null,
        popupOptions: null,
        redirectUri: null,
        authorizationEndpoint: null
      };
    }

    OAuth1.prototype.open = function open(options, userData) {
      var _this = this;

      var current = (0, _authUtilities.extend)({}, this.defaults, options);
      var serverUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;

      if (this.config.platform !== 'mobile') {
        this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
      }
      return this.http.fetch(serverUrl, {
        method: 'post'
      }).then(_authUtilities.status).then(function (response) {
        if (_this.config.platform === 'mobile') {
          _this.popup = _this.popup.open([current.authorizationEndpoint, _this.buildQueryString(response)].join('?'), current.name, current.popupOptions, current.redirectUri);
        } else {
          _this.popup.popupWindow.location = [current.authorizationEndpoint, _this.buildQueryString(response)].join('?');
        }

        var popupListener = _this.config.platform === 'mobile' ? _this.popup.eventListener(current.redirectUri) : _this.popup.pollPopup();
        return popupListener.then(function (result) {
          return _this.exchangeForToken(result, userData, current);
        });
      });
    };

    OAuth1.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
      var data = (0, _authUtilities.extend)({}, userData, oauthData);
      var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
      var credentials = this.config.withCredentials ? 'include' : 'same-origin';

      return this.http.fetch(exchangeForTokenUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(data),
        credentials: credentials
      }).then(_authUtilities.status);
    };

    OAuth1.prototype.buildQueryString = function buildQueryString(obj) {
      var str = [];
      (0, _authUtilities.forEach)(obj, function (value, key) {
        return str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      });
      return str.join('&');
    };

    return OAuth1;
  }()) || _class);
});
define('aurelia-auth/popup',['exports', './auth-utilities', './base-config', 'aurelia-dependency-injection'], function (exports, _authUtilities, _baseConfig, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Popup = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Popup = exports.Popup = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Popup(config) {
      _classCallCheck(this, Popup);

      this.config = config.current;
      this.popupWindow = null;
      this.polling = null;
      this.url = '';
    }

    Popup.prototype.open = function open(url, windowName, options, redirectUri) {
      this.url = url;
      var optionsString = this.stringifyOptions(this.prepareOptions(options || {}));
      this.popupWindow = window.open(url, windowName, optionsString);
      if (this.popupWindow && this.popupWindow.focus) {
        this.popupWindow.focus();
      }

      return this;
    };

    Popup.prototype.eventListener = function eventListener(redirectUri) {
      var self = this;
      var promise = new Promise(function (resolve, reject) {
        self.popupWindow.addEventListener('loadstart', function (event) {
          if (event.url.indexOf(redirectUri) !== 0) {
            return;
          }

          var parser = document.createElement('a');
          parser.href = event.url;

          if (parser.search || parser.hash) {
            var queryParams = parser.search.substring(1).replace(/\/$/, '');
            var hashParams = parser.hash.substring(1).replace(/\/$/, '');
            var hash = (0, _authUtilities.parseQueryString)(hashParams);
            var qs = (0, _authUtilities.parseQueryString)(queryParams);

            (0, _authUtilities.extend)(qs, hash);

            if (qs.error) {
              reject({
                error: qs.error
              });
            } else {
              resolve(qs);
            }

            self.popupWindow.close();
          }
        });

        popupWindow.addEventListener('exit', function () {
          reject({
            data: 'Provider Popup was closed'
          });
        });

        popupWindow.addEventListener('loaderror', function () {
          deferred.reject({
            data: 'Authorization Failed'
          });
        });
      });
      return promise;
    };

    Popup.prototype.pollPopup = function pollPopup() {
      var _this = this;

      var self = this;
      var promise = new Promise(function (resolve, reject) {
        _this.polling = setInterval(function () {
          try {
            var documentOrigin = document.location.host;
            var popupWindowOrigin = self.popupWindow.location.host;

            if (popupWindowOrigin === documentOrigin && (self.popupWindow.location.search || self.popupWindow.location.hash)) {
              var queryParams = self.popupWindow.location.search.substring(1).replace(/\/$/, '');
              var hashParams = self.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
              var hash = (0, _authUtilities.parseQueryString)(hashParams);
              var qs = (0, _authUtilities.parseQueryString)(queryParams);

              (0, _authUtilities.extend)(qs, hash);

              if (qs.error) {
                reject({
                  error: qs.error
                });
              } else {
                resolve(qs);
              }

              self.popupWindow.close();
              clearInterval(self.polling);
            }
          } catch (error) {}

          if (!self.popupWindow) {
            clearInterval(self.polling);
            reject({
              data: 'Provider Popup Blocked'
            });
          } else if (self.popupWindow.closed) {
            clearInterval(self.polling);
            reject({
              data: 'Problem poll popup'
            });
          }
        }, 35);
      });
      return promise;
    };

    Popup.prototype.prepareOptions = function prepareOptions(options) {
      var width = options.width || 500;
      var height = options.height || 500;
      return (0, _authUtilities.extend)({
        width: width,
        height: height,
        left: window.screenX + (window.outerWidth - width) / 2,
        top: window.screenY + (window.outerHeight - height) / 2.5
      }, options);
    };

    Popup.prototype.stringifyOptions = function stringifyOptions(options) {
      var parts = [];
      (0, _authUtilities.forEach)(options, function (value, key) {
        parts.push(key + '=' + value);
      });
      return parts.join(',');
    };

    return Popup;
  }()) || _class);
});
define('aurelia-auth/oAuth2',['exports', 'aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', './authentication', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtilities, _storage, _popup, _baseConfig, _authentication, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OAuth2 = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OAuth2 = exports.OAuth2 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig, _authentication.Authentication), _dec(_class = function () {
    function OAuth2(storage, popup, http, config, auth) {
      _classCallCheck(this, OAuth2);

      this.storage = storage;
      this.config = config.current;
      this.popup = popup;
      this.http = http;
      this.auth = auth;
      this.defaults = {
        url: null,
        name: null,
        state: null,
        scope: null,
        scopeDelimiter: null,
        redirectUri: null,
        popupOptions: null,
        authorizationEndpoint: null,
        responseParams: null,
        requiredUrlParams: null,
        optionalUrlParams: null,
        defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
        responseType: 'code'
      };
    }

    OAuth2.prototype.open = function open(options, userData) {
      var _this = this;

      var current = (0, _authUtilities.extend)({}, this.defaults, options);

      var stateName = current.name + '_state';

      if ((0, _authUtilities.isFunction)(current.state)) {
        this.storage.set(stateName, current.state());
      } else if ((0, _authUtilities.isString)(current.state)) {
        this.storage.set(stateName, current.state);
      }

      var nonceName = current.name + '_nonce';

      if ((0, _authUtilities.isFunction)(current.nonce)) {
        this.storage.set(nonceName, current.nonce());
      } else if ((0, _authUtilities.isString)(current.nonce)) {
        this.storage.set(nonceName, current.nonce);
      }

      var url = current.authorizationEndpoint + '?' + this.buildQueryString(current);

      var openPopup = void 0;
      if (this.config.platform === 'mobile') {
        openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).eventListener(current.redirectUri);
      } else {
        openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).pollPopup();
      }

      return openPopup.then(function (oauthData) {
        if (oauthData.state && oauthData.state !== _this.storage.get(stateName)) {
          return Promise.reject('OAuth 2.0 state parameter mismatch.');
        }

        if (current.responseType.toUpperCase().indexOf('TOKEN') !== -1) {
          if (!_this.verifyIdToken(oauthData, current.name)) {
            return Promise.reject('OAuth 2.0 Nonce parameter mismatch.');
          }

          return oauthData;
        }

        return _this.exchangeForToken(oauthData, userData, current);
      });
    };

    OAuth2.prototype.verifyIdToken = function verifyIdToken(oauthData, providerName) {
      var idToken = oauthData && oauthData[this.config.responseIdTokenProp];
      if (!idToken) return true;
      var idTokenObject = this.auth.decomposeToken(idToken);
      if (!idTokenObject) return true;
      var nonceFromToken = idTokenObject.nonce;
      if (!nonceFromToken) return true;
      var nonceInStorage = this.storage.get(providerName + '_nonce');
      if (nonceFromToken !== nonceInStorage) {
        return false;
      }
      return true;
    };

    OAuth2.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
      var data = (0, _authUtilities.extend)({}, userData, {
        code: oauthData.code,
        clientId: current.clientId,
        redirectUri: current.redirectUri
      });

      if (oauthData.state) {
        data.state = oauthData.state;
      }

      (0, _authUtilities.forEach)(current.responseParams, function (param) {
        return data[param] = oauthData[param];
      });

      var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
      var credentials = this.config.withCredentials ? 'include' : 'same-origin';

      return this.http.fetch(exchangeForTokenUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(data),
        credentials: credentials
      }).then(_authUtilities.status);
    };

    OAuth2.prototype.buildQueryString = function buildQueryString(current) {
      var _this2 = this;

      var keyValuePairs = [];
      var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

      (0, _authUtilities.forEach)(urlParams, function (params) {
        (0, _authUtilities.forEach)(current[params], function (paramName) {
          var camelizedName = (0, _authUtilities.camelCase)(paramName);
          var paramValue = (0, _authUtilities.isFunction)(current[paramName]) ? current[paramName]() : current[camelizedName];

          if (paramName === 'state') {
            var stateName = current.name + '_state';
            paramValue = encodeURIComponent(_this2.storage.get(stateName));
          }

          if (paramName === 'nonce') {
            var nonceName = current.name + '_nonce';
            paramValue = encodeURIComponent(_this2.storage.get(nonceName));
          }

          if (paramName === 'scope' && Array.isArray(paramValue)) {
            paramValue = paramValue.join(current.scopeDelimiter);

            if (current.scopePrefix) {
              paramValue = [current.scopePrefix, paramValue].join(current.scopeDelimiter);
            }
          }

          keyValuePairs.push([paramName, paramValue]);
        });
      });

      return keyValuePairs.map(function (pair) {
        return pair.join('=');
      }).join('&');
    };

    return OAuth2;
  }()) || _class);
});
define('aurelia-auth/authorize-step',['exports', 'aurelia-dependency-injection', 'aurelia-router', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaRouter, _authentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthorizeStep = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthorizeStep = exports.AuthorizeStep = (_dec = (0, _aureliaDependencyInjection.inject)(_authentication.Authentication), _dec(_class = function () {
    function AuthorizeStep(auth) {
      _classCallCheck(this, AuthorizeStep);

      this.auth = auth;
    }

    AuthorizeStep.prototype.run = function run(routingContext, next) {
      var isLoggedIn = this.auth.isAuthenticated();
      var loginRoute = this.auth.getLoginRoute();

      if (routingContext.getAllInstructions().some(function (i) {
        return i.config.auth;
      })) {
        if (!isLoggedIn) {
          this.auth.setInitialUrl(window.location.href);
          return next.cancel(new _aureliaRouter.Redirect(loginRoute));
        }
      } else if (isLoggedIn && routingContext.getAllInstructions().some(function (i) {
        return i.fragment === loginRoute;
      })) {
        var loginRedirect = this.auth.getLoginRedirect();
        return next.cancel(new _aureliaRouter.Redirect(loginRedirect));
      }

      return next();
    };

    return AuthorizeStep;
  }()) || _class);
});
define('aurelia-auth/auth-fetch-config',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _authentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FetchConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var FetchConfig = exports.FetchConfig = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication), _dec(_class = function () {
    function FetchConfig(httpClient, authService) {
      _classCallCheck(this, FetchConfig);

      this.httpClient = httpClient;
      this.auth = authService;
    }

    FetchConfig.prototype.configure = function configure() {
      var _this = this;

      this.httpClient.configure(function (httpConfig) {
        httpConfig.withDefaults({
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).withInterceptor(_this.auth.tokenInterceptor);
      });
    };

    return FetchConfig;
  }()) || _class);
});
define('aurelia-auth/auth-filter',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AuthFilterValueConverter = exports.AuthFilterValueConverter = function () {
    function AuthFilterValueConverter() {
      _classCallCheck(this, AuthFilterValueConverter);
    }

    AuthFilterValueConverter.prototype.toView = function toView(routes, isAuthenticated) {
      return routes.filter(function (r) {
        return r.config.auth === undefined || r.config.auth === isAuthenticated;
      });
    };

    return AuthFilterValueConverter;
  }();
});
define('aurelia-validation/property-info',["require", "exports", "aurelia-binding"], function (require, exports, aurelia_binding_1) {
    "use strict";
    function getObject(expression, objectExpression, source) {
        var value = objectExpression.evaluate(source, null);
        if (value === null || value === undefined || value instanceof Object) {
            return value;
        }
        /* tslint:disable */
        throw new Error("The '" + objectExpression + "' part of '" + expression + "' evaluates to " + value + " instead of an object, null or undefined.");
        /* tslint:enable */
    }
    /**
     * Retrieves the object and property name for the specified expression.
     * @param expression The expression
     * @param source The scope
     */
    function getPropertyInfo(expression, source) {
        var originalExpression = expression;
        while (expression instanceof aurelia_binding_1.BindingBehavior || expression instanceof aurelia_binding_1.ValueConverter) {
            expression = expression.expression;
        }
        var object;
        var propertyName;
        if (expression instanceof aurelia_binding_1.AccessScope) {
            object = source.bindingContext;
            propertyName = expression.name;
        }
        else if (expression instanceof aurelia_binding_1.AccessMember) {
            object = getObject(originalExpression, expression.object, source);
            propertyName = expression.name;
        }
        else if (expression instanceof aurelia_binding_1.AccessKeyed) {
            object = getObject(originalExpression, expression.object, source);
            propertyName = expression.key.evaluate(source);
        }
        else {
            throw new Error("Expression '" + originalExpression + "' is not compatible with the validate binding-behavior.");
        }
        if (object === null || object === undefined) {
            return null;
        }
        return { object: object, propertyName: propertyName };
    }
    exports.getPropertyInfo = getPropertyInfo;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/validate-binding-behavior',["require", "exports", "aurelia-task-queue", "./validate-trigger", "./validate-binding-behavior-base"], function (require, exports, aurelia_task_queue_1, validate_trigger_1, validate_binding_behavior_base_1) {
    "use strict";
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the validate trigger specified by the associated controller's
     * validateTrigger property occurs.
     */
    var ValidateBindingBehavior = (function (_super) {
        __extends(ValidateBindingBehavior, _super);
        function ValidateBindingBehavior() {
            return _super.apply(this, arguments) || this;
        }
        ValidateBindingBehavior.prototype.getValidateTrigger = function (controller) {
            return controller.validateTrigger;
        };
        return ValidateBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    ValidateBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    exports.ValidateBindingBehavior = ValidateBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property will be validated
     * manually, by calling controller.validate(). No automatic validation
     * triggered by data-entry or blur will occur.
     */
    var ValidateManuallyBindingBehavior = (function (_super) {
        __extends(ValidateManuallyBindingBehavior, _super);
        function ValidateManuallyBindingBehavior() {
            return _super.apply(this, arguments) || this;
        }
        ValidateManuallyBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.manual;
        };
        return ValidateManuallyBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    ValidateManuallyBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    exports.ValidateManuallyBindingBehavior = ValidateManuallyBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the associated element blurs.
     */
    var ValidateOnBlurBindingBehavior = (function (_super) {
        __extends(ValidateOnBlurBindingBehavior, _super);
        function ValidateOnBlurBindingBehavior() {
            return _super.apply(this, arguments) || this;
        }
        ValidateOnBlurBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.blur;
        };
        return ValidateOnBlurBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    ValidateOnBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    exports.ValidateOnBlurBindingBehavior = ValidateOnBlurBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the associated element is changed by the user, causing a change
     * to the model.
     */
    var ValidateOnChangeBindingBehavior = (function (_super) {
        __extends(ValidateOnChangeBindingBehavior, _super);
        function ValidateOnChangeBindingBehavior() {
            return _super.apply(this, arguments) || this;
        }
        ValidateOnChangeBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.change;
        };
        return ValidateOnChangeBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    ValidateOnChangeBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    exports.ValidateOnChangeBindingBehavior = ValidateOnChangeBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the associated element blurs or is changed by the user, causing
     * a change to the model.
     */
    var ValidateOnChangeOrBlurBindingBehavior = (function (_super) {
        __extends(ValidateOnChangeOrBlurBindingBehavior, _super);
        function ValidateOnChangeOrBlurBindingBehavior() {
            return _super.apply(this, arguments) || this;
        }
        ValidateOnChangeOrBlurBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.changeOrBlur;
        };
        return ValidateOnChangeOrBlurBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    ValidateOnChangeOrBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    exports.ValidateOnChangeOrBlurBindingBehavior = ValidateOnChangeOrBlurBindingBehavior;
});

define('aurelia-validation/validate-trigger',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Validation triggers.
     */
    exports.validateTrigger = {
        /**
         * Manual validation.  Use the controller's `validate()` and  `reset()` methods
         * to validate all bindings.
         */
        manual: 0,
        /**
         * Validate the binding when the binding's target element fires a DOM "blur" event.
         */
        blur: 1,
        /**
         * Validate the binding when it updates the model due to a change in the view.
         */
        change: 2,
        /**
         * Validate the binding when the binding's target element fires a DOM "blur" event and
         * when it updates the model due to a change in the view.
         */
        changeOrBlur: 3
    };
});

define('aurelia-validation/validate-binding-behavior-base',["require", "exports", "aurelia-dependency-injection", "aurelia-pal", "./validation-controller", "./validate-trigger"], function (require, exports, aurelia_dependency_injection_1, aurelia_pal_1, validation_controller_1, validate_trigger_1) {
    "use strict";
    /**
     * Binding behavior. Indicates the bound property should be validated.
     */
    var ValidateBindingBehaviorBase = (function () {
        function ValidateBindingBehaviorBase(taskQueue) {
            this.taskQueue = taskQueue;
        }
        /**
         * Gets the DOM element associated with the data-binding. Most of the time it's
         * the binding.target but sometimes binding.target is an aurelia custom element,
         * or custom attribute which is a javascript "class" instance, so we need to use
         * the controller's container to retrieve the actual DOM element.
         */
        ValidateBindingBehaviorBase.prototype.getTarget = function (binding, view) {
            var target = binding.target;
            // DOM element
            if (target instanceof Element) {
                return target;
            }
            // custom element or custom attribute
            for (var i = 0, ii = view.controllers.length; i < ii; i++) {
                var controller = view.controllers[i];
                if (controller.viewModel === target) {
                    var element = controller.container.get(aurelia_pal_1.DOM.Element);
                    if (element) {
                        return element;
                    }
                    throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
                }
            }
            throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
        };
        ValidateBindingBehaviorBase.prototype.bind = function (binding, source, rulesOrController, rules) {
            var _this = this;
            // identify the target element.
            var target = this.getTarget(binding, source);
            // locate the controller.
            var controller;
            if (rulesOrController instanceof validation_controller_1.ValidationController) {
                controller = rulesOrController;
            }
            else {
                controller = source.container.get(aurelia_dependency_injection_1.Optional.of(validation_controller_1.ValidationController));
                rules = rulesOrController;
            }
            if (controller === null) {
                throw new Error("A ValidationController has not been registered.");
            }
            controller.registerBinding(binding, target, rules);
            binding.validationController = controller;
            var trigger = this.getValidateTrigger(controller);
            /* tslint:disable:no-bitwise */
            if (trigger & validate_trigger_1.validateTrigger.change) {
                /* tslint:enable:no-bitwise */
                binding.standardUpdateSource = binding.updateSource;
                /* tslint:disable:only-arrow-functions */
                binding.updateSource = function (value) {
                    /* tslint:enable:only-arrow-functions */
                    this.standardUpdateSource(value);
                    this.validationController.validateBinding(this);
                };
            }
            /* tslint:disable:no-bitwise */
            if (trigger & validate_trigger_1.validateTrigger.blur) {
                /* tslint:enable:no-bitwise */
                binding.validateBlurHandler = function () {
                    _this.taskQueue.queueMicroTask(function () { return controller.validateBinding(binding); });
                };
                binding.validateTarget = target;
                target.addEventListener('blur', binding.validateBlurHandler);
            }
            if (trigger !== validate_trigger_1.validateTrigger.manual) {
                binding.standardUpdateTarget = binding.updateTarget;
                /* tslint:disable:only-arrow-functions */
                binding.updateTarget = function (value) {
                    /* tslint:enable:only-arrow-functions */
                    this.standardUpdateTarget(value);
                    this.validationController.resetBinding(this);
                };
            }
        };
        ValidateBindingBehaviorBase.prototype.unbind = function (binding) {
            // reset the binding to it's original state.
            if (binding.standardUpdateSource) {
                binding.updateSource = binding.standardUpdateSource;
                binding.standardUpdateSource = null;
            }
            if (binding.standardUpdateTarget) {
                binding.updateTarget = binding.standardUpdateTarget;
                binding.standardUpdateTarget = null;
            }
            if (binding.validateBlurHandler) {
                binding.validateTarget.removeEventListener('blur', binding.validateBlurHandler);
                binding.validateBlurHandler = null;
                binding.validateTarget = null;
            }
            binding.validationController.unregisterBinding(binding);
            binding.validationController = null;
        };
        return ValidateBindingBehaviorBase;
    }());
    exports.ValidateBindingBehaviorBase = ValidateBindingBehaviorBase;
});

define('aurelia-validation/validation-controller',["require", "exports", "./validator", "./validate-trigger", "./property-info", "./validate-result"], function (require, exports, validator_1, validate_trigger_1, property_info_1, validate_result_1) {
    "use strict";
    /**
     * Orchestrates validation.
     * Manages a set of bindings, renderers and objects.
     * Exposes the current list of validation results for binding purposes.
     */
    var ValidationController = (function () {
        function ValidationController(validator) {
            this.validator = validator;
            // Registered bindings (via the validate binding behavior)
            this.bindings = new Map();
            // Renderers that have been added to the controller instance.
            this.renderers = [];
            /**
             * Validation results that have been rendered by the controller.
             */
            this.results = [];
            /**
             * Validation errors that have been rendered by the controller.
             */
            this.errors = [];
            /**
             *  Whether the controller is currently validating.
             */
            this.validating = false;
            // Elements related to validation results that have been rendered.
            this.elements = new Map();
            // Objects that have been added to the controller instance (entity-style validation).
            this.objects = new Map();
            /**
             * The trigger that will invoke automatic validation of a property used in a binding.
             */
            this.validateTrigger = validate_trigger_1.validateTrigger.blur;
            // Promise that resolves when validation has completed.
            this.finishValidating = Promise.resolve();
        }
        /**
         * Adds an object to the set of objects that should be validated when validate is called.
         * @param object The object.
         * @param rules Optional. The rules. If rules aren't supplied the Validator implementation will lookup the rules.
         */
        ValidationController.prototype.addObject = function (object, rules) {
            this.objects.set(object, rules);
        };
        /**
         * Removes an object from the set of objects that should be validated when validate is called.
         * @param object The object.
         */
        ValidationController.prototype.removeObject = function (object) {
            this.objects.delete(object);
            this.processResultDelta('reset', this.results.filter(function (result) { return result.object === object; }), []);
        };
        /**
         * Adds and renders an error.
         */
        ValidationController.prototype.addError = function (message, object, propertyName) {
            if (propertyName === void 0) { propertyName = null; }
            var result = new validate_result_1.ValidateResult({}, object, propertyName, false, message);
            this.processResultDelta('validate', [], [result]);
            return result;
        };
        /**
         * Removes and unrenders an error.
         */
        ValidationController.prototype.removeError = function (result) {
            if (this.results.indexOf(result) !== -1) {
                this.processResultDelta('reset', [result], []);
            }
        };
        /**
         * Adds a renderer.
         * @param renderer The renderer.
         */
        ValidationController.prototype.addRenderer = function (renderer) {
            var _this = this;
            this.renderers.push(renderer);
            renderer.render({
                kind: 'validate',
                render: this.results.map(function (result) { return ({ result: result, elements: _this.elements.get(result) }); }),
                unrender: []
            });
        };
        /**
         * Removes a renderer.
         * @param renderer The renderer.
         */
        ValidationController.prototype.removeRenderer = function (renderer) {
            var _this = this;
            this.renderers.splice(this.renderers.indexOf(renderer), 1);
            renderer.render({
                kind: 'reset',
                render: [],
                unrender: this.results.map(function (result) { return ({ result: result, elements: _this.elements.get(result) }); })
            });
        };
        /**
         * Registers a binding with the controller.
         * @param binding The binding instance.
         * @param target The DOM element.
         * @param rules (optional) rules associated with the binding. Validator implementation specific.
         */
        ValidationController.prototype.registerBinding = function (binding, target, rules) {
            this.bindings.set(binding, { target: target, rules: rules, propertyInfo: null });
        };
        /**
         * Unregisters a binding with the controller.
         * @param binding The binding instance.
         */
        ValidationController.prototype.unregisterBinding = function (binding) {
            this.resetBinding(binding);
            this.bindings.delete(binding);
        };
        /**
         * Interprets the instruction and returns a predicate that will identify
         * relevant results in the list of rendered validation results.
         */
        ValidationController.prototype.getInstructionPredicate = function (instruction) {
            var _this = this;
            if (instruction) {
                var object_1 = instruction.object, propertyName_1 = instruction.propertyName, rules_1 = instruction.rules;
                var predicate_1;
                if (instruction.propertyName) {
                    predicate_1 = function (x) { return x.object === object_1 && x.propertyName === propertyName_1; };
                }
                else {
                    predicate_1 = function (x) { return x.object === object_1; };
                }
                if (rules_1) {
                    return function (x) { return predicate_1(x) && _this.validator.ruleExists(rules_1, x.rule); };
                }
                return predicate_1;
            }
            else {
                return function () { return true; };
            }
        };
        /**
         * Validates and renders results.
         * @param instruction Optional. Instructions on what to validate. If undefined, all
         * objects and bindings will be validated.
         */
        ValidationController.prototype.validate = function (instruction) {
            var _this = this;
            // Get a function that will process the validation instruction.
            var execute;
            if (instruction) {
                var object_2 = instruction.object, propertyName_2 = instruction.propertyName, rules_2 = instruction.rules;
                // if rules were not specified, check the object map.
                rules_2 = rules_2 || this.objects.get(object_2);
                // property specified?
                if (instruction.propertyName === undefined) {
                    // validate the specified object.
                    execute = function () { return _this.validator.validateObject(object_2, rules_2); };
                }
                else {
                    // validate the specified property.
                    execute = function () { return _this.validator.validateProperty(object_2, propertyName_2, rules_2); };
                }
            }
            else {
                // validate all objects and bindings.
                execute = function () {
                    var promises = [];
                    for (var _i = 0, _a = Array.from(_this.objects); _i < _a.length; _i++) {
                        var _b = _a[_i], object = _b[0], rules = _b[1];
                        promises.push(_this.validator.validateObject(object, rules));
                    }
                    for (var _c = 0, _d = Array.from(_this.bindings); _c < _d.length; _c++) {
                        var _e = _d[_c], binding = _e[0], rules = _e[1].rules;
                        var propertyInfo = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source);
                        if (!propertyInfo || _this.objects.has(propertyInfo.object)) {
                            continue;
                        }
                        promises.push(_this.validator.validateProperty(propertyInfo.object, propertyInfo.propertyName, rules));
                    }
                    return Promise.all(promises).then(function (resultSets) { return resultSets.reduce(function (a, b) { return a.concat(b); }, []); });
                };
            }
            // Wait for any existing validation to finish, execute the instruction, render the results.
            this.validating = true;
            var returnPromise = this.finishValidating
                .then(execute)
                .then(function (newResults) {
                var predicate = _this.getInstructionPredicate(instruction);
                var oldResults = _this.results.filter(predicate);
                _this.processResultDelta('validate', oldResults, newResults);
                if (returnPromise === _this.finishValidating) {
                    _this.validating = false;
                }
                var result = {
                    instruction: instruction,
                    valid: newResults.find(function (x) { return !x.valid; }) === undefined,
                    results: newResults
                };
                return result;
            })
                .catch(function (exception) {
                // recover, to enable subsequent calls to validate()
                _this.validating = false;
                _this.finishValidating = Promise.resolve();
                return Promise.reject(exception);
            });
            this.finishValidating = returnPromise;
            return returnPromise;
        };
        /**
         * Resets any rendered validation results (unrenders).
         * @param instruction Optional. Instructions on what to reset. If unspecified all rendered results
         * will be unrendered.
         */
        ValidationController.prototype.reset = function (instruction) {
            var predicate = this.getInstructionPredicate(instruction);
            var oldResults = this.results.filter(predicate);
            this.processResultDelta('reset', oldResults, []);
        };
        /**
         * Gets the elements associated with an object and propertyName (if any).
         */
        ValidationController.prototype.getAssociatedElements = function (_a) {
            var object = _a.object, propertyName = _a.propertyName;
            var elements = [];
            for (var _i = 0, _b = Array.from(this.bindings); _i < _b.length; _i++) {
                var _c = _b[_i], binding = _c[0], target = _c[1].target;
                var propertyInfo = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source);
                if (propertyInfo && propertyInfo.object === object && propertyInfo.propertyName === propertyName) {
                    elements.push(target);
                }
            }
            return elements;
        };
        ValidationController.prototype.processResultDelta = function (kind, oldResults, newResults) {
            // prepare the instruction.
            var instruction = {
                kind: kind,
                render: [],
                unrender: []
            };
            // create a shallow copy of newResults so we can mutate it without causing side-effects.
            newResults = newResults.slice(0);
            var _loop_1 = function (oldResult) {
                // get the elements associated with the old result.
                var elements = this_1.elements.get(oldResult);
                // remove the old result from the element map.
                this_1.elements.delete(oldResult);
                // create the unrender instruction.
                instruction.unrender.push({ result: oldResult, elements: elements });
                // determine if there's a corresponding new result for the old result we are unrendering.
                var newResultIndex = newResults.findIndex(function (x) { return x.rule === oldResult.rule && x.object === oldResult.object && x.propertyName === oldResult.propertyName; });
                if (newResultIndex === -1) {
                    // no corresponding new result... simple remove.
                    this_1.results.splice(this_1.results.indexOf(oldResult), 1);
                    if (!oldResult.valid) {
                        this_1.errors.splice(this_1.errors.indexOf(oldResult), 1);
                    }
                }
                else {
                    // there is a corresponding new result...        
                    var newResult = newResults.splice(newResultIndex, 1)[0];
                    // get the elements that are associated with the new result.
                    var elements_1 = this_1.getAssociatedElements(newResult);
                    this_1.elements.set(newResult, elements_1);
                    // create a render instruction for the new result.
                    instruction.render.push({ result: newResult, elements: elements_1 });
                    // do an in-place replacement of the old result with the new result.
                    // this ensures any repeats bound to this.results will not thrash.
                    this_1.results.splice(this_1.results.indexOf(oldResult), 1, newResult);
                    if (!oldResult.valid && newResult.valid) {
                        this_1.errors.splice(this_1.errors.indexOf(oldResult), 1);
                    }
                    else if (!oldResult.valid && !newResult.valid) {
                        this_1.errors.splice(this_1.errors.indexOf(oldResult), 1, newResult);
                    }
                    else if (!newResult.valid) {
                        this_1.errors.push(newResult);
                    }
                }
            };
            var this_1 = this;
            // create unrender instructions from the old results.
            for (var _i = 0, oldResults_1 = oldResults; _i < oldResults_1.length; _i++) {
                var oldResult = oldResults_1[_i];
                _loop_1(oldResult);
            }
            // create render instructions from the remaining new results.
            for (var _a = 0, newResults_1 = newResults; _a < newResults_1.length; _a++) {
                var result = newResults_1[_a];
                var elements = this.getAssociatedElements(result);
                instruction.render.push({ result: result, elements: elements });
                this.elements.set(result, elements);
                this.results.push(result);
                if (!result.valid) {
                    this.errors.push(result);
                }
            }
            // render.
            for (var _b = 0, _c = this.renderers; _b < _c.length; _b++) {
                var renderer = _c[_b];
                renderer.render(instruction);
            }
        };
        /**
         * Validates the property associated with a binding.
         */
        ValidationController.prototype.validateBinding = function (binding) {
            if (!binding.isBound) {
                return;
            }
            var propertyInfo = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source);
            var rules = undefined;
            var registeredBinding = this.bindings.get(binding);
            if (registeredBinding) {
                rules = registeredBinding.rules;
                registeredBinding.propertyInfo = propertyInfo;
            }
            if (!propertyInfo) {
                return;
            }
            var object = propertyInfo.object, propertyName = propertyInfo.propertyName;
            this.validate({ object: object, propertyName: propertyName, rules: rules });
        };
        /**
         * Resets the results for a property associated with a binding.
         */
        ValidationController.prototype.resetBinding = function (binding) {
            var registeredBinding = this.bindings.get(binding);
            var propertyInfo = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source);
            if (!propertyInfo && registeredBinding) {
                propertyInfo = registeredBinding.propertyInfo;
            }
            if (registeredBinding) {
                registeredBinding.propertyInfo = null;
            }
            if (!propertyInfo) {
                return;
            }
            var object = propertyInfo.object, propertyName = propertyInfo.propertyName;
            this.reset({ object: object, propertyName: propertyName });
        };
        return ValidationController;
    }());
    ValidationController.inject = [validator_1.Validator];
    exports.ValidationController = ValidationController;
});

define('aurelia-validation/validator',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Validates objects and properties.
     */
    var Validator = (function () {
        function Validator() {
        }
        return Validator;
    }());
    exports.Validator = Validator;
});

define('aurelia-validation/validate-result',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * The result of validating an individual validation rule.
     */
    var ValidateResult = (function () {
        /**
         * @param rule The rule associated with the result. Validator implementation specific.
         * @param object The object that was validated.
         * @param propertyName The name of the property that was validated.
         * @param error The error, if the result is a validation error.
         */
        function ValidateResult(rule, object, propertyName, valid, message) {
            if (message === void 0) { message = null; }
            this.rule = rule;
            this.object = object;
            this.propertyName = propertyName;
            this.valid = valid;
            this.message = message;
            this.id = ValidateResult.nextId++;
        }
        ValidateResult.prototype.toString = function () {
            return this.valid ? 'Valid.' : this.message;
        };
        return ValidateResult;
    }());
    ValidateResult.nextId = 0;
    exports.ValidateResult = ValidateResult;
});

define('aurelia-validation/validation-controller-factory',["require", "exports", "./validation-controller", "./validator"], function (require, exports, validation_controller_1, validator_1) {
    "use strict";
    /**
     * Creates ValidationController instances.
     */
    var ValidationControllerFactory = (function () {
        function ValidationControllerFactory(container) {
            this.container = container;
        }
        ValidationControllerFactory.get = function (container) {
            return new ValidationControllerFactory(container);
        };
        /**
         * Creates a new controller instance.
         */
        ValidationControllerFactory.prototype.create = function (validator) {
            if (!validator) {
                validator = this.container.get(validator_1.Validator);
            }
            return new validation_controller_1.ValidationController(validator);
        };
        /**
         * Creates a new controller and registers it in the current element's container so that it's
         * available to the validate binding behavior and renderers.
         */
        ValidationControllerFactory.prototype.createForCurrentScope = function (validator) {
            var controller = this.create(validator);
            this.container.registerInstance(validation_controller_1.ValidationController, controller);
            return controller;
        };
        return ValidationControllerFactory;
    }());
    exports.ValidationControllerFactory = ValidationControllerFactory;
    ValidationControllerFactory['protocol:aurelia:resolver'] = true;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('aurelia-validation/validation-errors-custom-attribute',["require", "exports", "aurelia-binding", "aurelia-dependency-injection", "aurelia-templating", "./validation-controller"], function (require, exports, aurelia_binding_1, aurelia_dependency_injection_1, aurelia_templating_1, validation_controller_1) {
    "use strict";
    var ValidationErrorsCustomAttribute = (function () {
        function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
            this.boundaryElement = boundaryElement;
            this.controllerAccessor = controllerAccessor;
            this.errors = [];
        }
        ValidationErrorsCustomAttribute.prototype.sort = function () {
            this.errors.sort(function (a, b) {
                if (a.targets[0] === b.targets[0]) {
                    return 0;
                }
                /* tslint:disable:no-bitwise */
                return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
                /* tslint:enable:no-bitwise */
            });
        };
        ValidationErrorsCustomAttribute.prototype.interestingElements = function (elements) {
            var _this = this;
            return elements.filter(function (e) { return _this.boundaryElement.contains(e); });
        };
        ValidationErrorsCustomAttribute.prototype.render = function (instruction) {
            var _loop_1 = function (result) {
                var index = this_1.errors.findIndex(function (x) { return x.error === result; });
                if (index !== -1) {
                    this_1.errors.splice(index, 1);
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = instruction.unrender; _i < _a.length; _i++) {
                var result = _a[_i].result;
                _loop_1(result);
            }
            for (var _b = 0, _c = instruction.render; _b < _c.length; _b++) {
                var _d = _c[_b], result = _d.result, elements = _d.elements;
                if (result.valid) {
                    continue;
                }
                var targets = this.interestingElements(elements);
                if (targets.length) {
                    this.errors.push({ error: result, targets: targets });
                }
            }
            this.sort();
            this.value = this.errors;
        };
        ValidationErrorsCustomAttribute.prototype.bind = function () {
            this.controllerAccessor().addRenderer(this);
            this.value = this.errors;
        };
        ValidationErrorsCustomAttribute.prototype.unbind = function () {
            this.controllerAccessor().removeRenderer(this);
        };
        return ValidationErrorsCustomAttribute;
    }());
    ValidationErrorsCustomAttribute.inject = [Element, aurelia_dependency_injection_1.Lazy.of(validation_controller_1.ValidationController)];
    ValidationErrorsCustomAttribute = __decorate([
        aurelia_templating_1.customAttribute('validation-errors', aurelia_binding_1.bindingMode.twoWay)
    ], ValidationErrorsCustomAttribute);
    exports.ValidationErrorsCustomAttribute = ValidationErrorsCustomAttribute;
});

define('aurelia-validation/validation-renderer-custom-attribute',["require", "exports", "./validation-controller"], function (require, exports, validation_controller_1) {
    "use strict";
    var ValidationRendererCustomAttribute = (function () {
        function ValidationRendererCustomAttribute() {
        }
        ValidationRendererCustomAttribute.prototype.created = function (view) {
            this.container = view.container;
        };
        ValidationRendererCustomAttribute.prototype.bind = function () {
            this.controller = this.container.get(validation_controller_1.ValidationController);
            this.renderer = this.container.get(this.value);
            this.controller.addRenderer(this.renderer);
        };
        ValidationRendererCustomAttribute.prototype.unbind = function () {
            this.controller.removeRenderer(this.renderer);
            this.controller = null;
            this.renderer = null;
        };
        return ValidationRendererCustomAttribute;
    }());
    exports.ValidationRendererCustomAttribute = ValidationRendererCustomAttribute;
});

define('aurelia-validation/implementation/rules',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Sets, unsets and retrieves rules on an object or constructor function.
     */
    var Rules = (function () {
        function Rules() {
        }
        /**
         * Applies the rules to a target.
         */
        Rules.set = function (target, rules) {
            if (target instanceof Function) {
                target = target.prototype;
            }
            Object.defineProperty(target, Rules.key, { enumerable: false, configurable: false, writable: true, value: rules });
        };
        /**
         * Removes rules from a target.
         */
        Rules.unset = function (target) {
            if (target instanceof Function) {
                target = target.prototype;
            }
            target[Rules.key] = null;
        };
        /**
         * Retrieves the target's rules.
         */
        Rules.get = function (target) {
            return target[Rules.key] || null;
        };
        return Rules;
    }());
    /**
     * The name of the property that stores the rules.
     */
    Rules.key = '__rules__';
    exports.Rules = Rules;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/implementation/standard-validator',["require", "exports", "aurelia-templating", "../validator", "../validate-result", "./rules", "./validation-messages"], function (require, exports, aurelia_templating_1, validator_1, validate_result_1, rules_1, validation_messages_1) {
    "use strict";
    /**
     * Validates.
     * Responsible for validating objects and properties.
     */
    var StandardValidator = (function (_super) {
        __extends(StandardValidator, _super);
        function StandardValidator(messageProvider, resources) {
            var _this = _super.call(this) || this;
            _this.messageProvider = messageProvider;
            _this.lookupFunctions = resources.lookupFunctions;
            _this.getDisplayName = messageProvider.getDisplayName.bind(messageProvider);
            return _this;
        }
        /**
         * Validates the specified property.
         * @param object The object to validate.
         * @param propertyName The name of the property to validate.
         * @param rules Optional. If unspecified, the rules will be looked up using the metadata
         * for the object created by ValidationRules....on(class/object)
         */
        StandardValidator.prototype.validateProperty = function (object, propertyName, rules) {
            return this.validate(object, propertyName, rules || null);
        };
        /**
         * Validates all rules for specified object and it's properties.
         * @param object The object to validate.
         * @param rules Optional. If unspecified, the rules will be looked up using the metadata
         * for the object created by ValidationRules....on(class/object)
         */
        StandardValidator.prototype.validateObject = function (object, rules) {
            return this.validate(object, null, rules || null);
        };
        /**
         * Determines whether a rule exists in a set of rules.
         * @param rules The rules to search.
         * @parem rule The rule to find.
         */
        StandardValidator.prototype.ruleExists = function (rules, rule) {
            var i = rules.length;
            while (i--) {
                if (rules[i].indexOf(rule) !== -1) {
                    return true;
                }
            }
            return false;
        };
        StandardValidator.prototype.getMessage = function (rule, object, value) {
            var expression = rule.message || this.messageProvider.getMessage(rule.messageKey);
            var _a = rule.property, propertyName = _a.name, displayName = _a.displayName;
            if (propertyName !== null) {
                displayName = this.messageProvider.getDisplayName(propertyName, displayName);
            }
            var overrideContext = {
                $displayName: displayName,
                $propertyName: propertyName,
                $value: value,
                $object: object,
                $config: rule.config,
                $getDisplayName: this.getDisplayName
            };
            return expression.evaluate({ bindingContext: object, overrideContext: overrideContext }, this.lookupFunctions);
        };
        StandardValidator.prototype.validateRuleSequence = function (object, propertyName, ruleSequence, sequence, results) {
            var _this = this;
            // are we validating all properties or a single property?
            var validateAllProperties = propertyName === null || propertyName === undefined;
            var rules = ruleSequence[sequence];
            var allValid = true;
            // validate each rule.
            var promises = [];
            var _loop_1 = function (i) {
                var rule = rules[i];
                // is the rule related to the property we're validating.
                if (!validateAllProperties && rule.property.name !== propertyName) {
                    return "continue";
                }
                // is this a conditional rule? is the condition met?
                if (rule.when && !rule.when(object)) {
                    return "continue";
                }
                // validate.
                var value = rule.property.name === null ? object : object[rule.property.name];
                var promiseOrBoolean = rule.condition(value, object);
                if (!(promiseOrBoolean instanceof Promise)) {
                    promiseOrBoolean = Promise.resolve(promiseOrBoolean);
                }
                promises.push(promiseOrBoolean.then(function (valid) {
                    var message = valid ? null : _this.getMessage(rule, object, value);
                    results.push(new validate_result_1.ValidateResult(rule, object, rule.property.name, valid, message));
                    allValid = allValid && valid;
                    return valid;
                }));
            };
            for (var i = 0; i < rules.length; i++) {
                _loop_1(i);
            }
            return Promise.all(promises)
                .then(function () {
                sequence++;
                if (allValid && sequence < ruleSequence.length) {
                    return _this.validateRuleSequence(object, propertyName, ruleSequence, sequence, results);
                }
                return results;
            });
        };
        StandardValidator.prototype.validate = function (object, propertyName, rules) {
            // rules specified?
            if (!rules) {
                // no. attempt to locate the rules.
                rules = rules_1.Rules.get(object);
            }
            // any rules?
            if (!rules) {
                return Promise.resolve([]);
            }
            return this.validateRuleSequence(object, propertyName, rules, 0, []);
        };
        return StandardValidator;
    }(validator_1.Validator));
    StandardValidator.inject = [validation_messages_1.ValidationMessageProvider, aurelia_templating_1.ViewResources];
    exports.StandardValidator = StandardValidator;
});

define('aurelia-validation/implementation/validation-messages',["require", "exports", "./validation-parser"], function (require, exports, validation_parser_1) {
    "use strict";
    /**
     * Dictionary of validation messages. [messageKey]: messageExpression
     */
    exports.validationMessages = {
        /**
         * The default validation message. Used with rules that have no standard message.
         */
        default: "${$displayName} is invalid.",
        required: "${$displayName} is required.",
        matches: "${$displayName} is not correctly formatted.",
        email: "${$displayName} is not a valid email.",
        minLength: "${$displayName} must be at least ${$config.length} character${$config.length === 1 ? '' : 's'}.",
        maxLength: "${$displayName} cannot be longer than ${$config.length} character${$config.length === 1 ? '' : 's'}.",
        minItems: "${$displayName} must contain at least ${$config.count} item${$config.count === 1 ? '' : 's'}.",
        maxItems: "${$displayName} cannot contain more than ${$config.count} item${$config.count === 1 ? '' : 's'}.",
        equals: "${$displayName} must be ${$config.expectedValue}.",
    };
    /**
     * Retrieves validation messages and property display names.
     */
    var ValidationMessageProvider = (function () {
        function ValidationMessageProvider(parser) {
            this.parser = parser;
        }
        /**
         * Returns a message binding expression that corresponds to the key.
         * @param key The message key.
         */
        ValidationMessageProvider.prototype.getMessage = function (key) {
            var message;
            if (key in exports.validationMessages) {
                message = exports.validationMessages[key];
            }
            else {
                message = exports.validationMessages['default'];
            }
            return this.parser.parseMessage(message);
        };
        /**
         * Formulates a property display name using the property name and the configured
         * displayName (if provided).
         * Override this with your own custom logic.
         * @param propertyName The property name.
         */
        ValidationMessageProvider.prototype.getDisplayName = function (propertyName, displayName) {
            if (displayName !== null && displayName !== undefined) {
                return displayName;
            }
            // split on upper-case letters.
            var words = propertyName.split(/(?=[A-Z])/).join(' ');
            // capitalize first letter.
            return words.charAt(0).toUpperCase() + words.slice(1);
        };
        return ValidationMessageProvider;
    }());
    ValidationMessageProvider.inject = [validation_parser_1.ValidationParser];
    exports.ValidationMessageProvider = ValidationMessageProvider;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/implementation/validation-parser',["require", "exports", "aurelia-binding", "aurelia-templating", "./util", "aurelia-logging"], function (require, exports, aurelia_binding_1, aurelia_templating_1, util_1, LogManager) {
    "use strict";
    var ValidationParser = (function () {
        function ValidationParser(parser, bindinqLanguage) {
            this.parser = parser;
            this.bindinqLanguage = bindinqLanguage;
            this.emptyStringExpression = new aurelia_binding_1.LiteralString('');
            this.nullExpression = new aurelia_binding_1.LiteralPrimitive(null);
            this.undefinedExpression = new aurelia_binding_1.LiteralPrimitive(undefined);
            this.cache = {};
        }
        ValidationParser.prototype.parseMessage = function (message) {
            if (this.cache[message] !== undefined) {
                return this.cache[message];
            }
            var parts = this.bindinqLanguage.parseInterpolation(null, message);
            if (parts === null) {
                return new aurelia_binding_1.LiteralString(message);
            }
            var expression = new aurelia_binding_1.LiteralString(parts[0]);
            for (var i = 1; i < parts.length; i += 2) {
                expression = new aurelia_binding_1.Binary('+', expression, new aurelia_binding_1.Binary('+', this.coalesce(parts[i]), new aurelia_binding_1.LiteralString(parts[i + 1])));
            }
            MessageExpressionValidator.validate(expression, message);
            this.cache[message] = expression;
            return expression;
        };
        ValidationParser.prototype.parseProperty = function (property) {
            if (util_1.isString(property)) {
                return { name: property, displayName: null };
            }
            var accessor = this.getAccessorExpression(property.toString());
            if (accessor instanceof aurelia_binding_1.AccessScope
                || accessor instanceof aurelia_binding_1.AccessMember && accessor.object instanceof aurelia_binding_1.AccessScope) {
                return {
                    name: accessor.name,
                    displayName: null
                };
            }
            throw new Error("Invalid subject: \"" + accessor + "\"");
        };
        ValidationParser.prototype.coalesce = function (part) {
            // part === null || part === undefined ? '' : part
            return new aurelia_binding_1.Conditional(new aurelia_binding_1.Binary('||', new aurelia_binding_1.Binary('===', part, this.nullExpression), new aurelia_binding_1.Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new aurelia_binding_1.CallMember(part, 'toString', []));
        };
        ValidationParser.prototype.getAccessorExpression = function (fn) {
            var classic = /^function\s*\([$_\w\d]+\)\s*\{\s*(?:"use strict";)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
            var arrow = /^\(?[$_\w\d]+\)?\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
            var match = classic.exec(fn) || arrow.exec(fn);
            if (match === null) {
                throw new Error("Unable to parse accessor function:\n" + fn);
            }
            return this.parser.parse(match[1]);
        };
        return ValidationParser;
    }());
    ValidationParser.inject = [aurelia_binding_1.Parser, aurelia_templating_1.BindingLanguage];
    exports.ValidationParser = ValidationParser;
    var MessageExpressionValidator = (function (_super) {
        __extends(MessageExpressionValidator, _super);
        function MessageExpressionValidator(originalMessage) {
            var _this = _super.call(this, []) || this;
            _this.originalMessage = originalMessage;
            return _this;
        }
        MessageExpressionValidator.validate = function (expression, originalMessage) {
            var visitor = new MessageExpressionValidator(originalMessage);
            expression.accept(visitor);
        };
        MessageExpressionValidator.prototype.visitAccessScope = function (access) {
            if (access.ancestor !== 0) {
                throw new Error('$parent is not permitted in validation message expressions.');
            }
            if (['displayName', 'propertyName', 'value', 'object', 'config', 'getDisplayName'].indexOf(access.name) !== -1) {
                LogManager.getLogger('aurelia-validation')
                    .warn("Did you mean to use \"$" + access.name + "\" instead of \"" + access.name + "\" in this validation message template: \"" + this.originalMessage + "\"?");
            }
        };
        return MessageExpressionValidator;
    }(aurelia_binding_1.Unparser));
    exports.MessageExpressionValidator = MessageExpressionValidator;
});

define('aurelia-validation/implementation/util',["require", "exports"], function (require, exports) {
    "use strict";
    function isString(value) {
        return Object.prototype.toString.call(value) === '[object String]';
    }
    exports.isString = isString;
});

define('aurelia-validation/implementation/validation-rules',["require", "exports", "./util", "./rules", "./validation-messages"], function (require, exports, util_1, rules_1, validation_messages_1) {
    "use strict";
    /**
     * Part of the fluent rule API. Enables customizing property rules.
     */
    var FluentRuleCustomizer = (function () {
        function FluentRuleCustomizer(property, condition, config, fluentEnsure, fluentRules, parser) {
            if (config === void 0) { config = {}; }
            this.fluentEnsure = fluentEnsure;
            this.fluentRules = fluentRules;
            this.parser = parser;
            this.rule = {
                property: property,
                condition: condition,
                config: config,
                when: null,
                messageKey: 'default',
                message: null,
                sequence: fluentRules.sequence
            };
            this.fluentEnsure._addRule(this.rule);
        }
        /**
         * Validate subsequent rules after previously declared rules have
         * been validated successfully. Use to postpone validation of costly
         * rules until less expensive rules pass validation.
         */
        FluentRuleCustomizer.prototype.then = function () {
            this.fluentRules.sequence++;
            return this;
        };
        /**
         * Specifies the key to use when looking up the rule's validation message.
         */
        FluentRuleCustomizer.prototype.withMessageKey = function (key) {
            this.rule.messageKey = key;
            this.rule.message = null;
            return this;
        };
        /**
         * Specifies rule's validation message.
         */
        FluentRuleCustomizer.prototype.withMessage = function (message) {
            this.rule.messageKey = 'custom';
            this.rule.message = this.parser.parseMessage(message);
            return this;
        };
        /**
         * Specifies a condition that must be met before attempting to validate the rule.
         * @param condition A function that accepts the object as a parameter and returns true
         * or false whether the rule should be evaluated.
         */
        FluentRuleCustomizer.prototype.when = function (condition) {
            this.rule.when = condition;
            return this;
        };
        /**
         * Tags the rule instance, enabling the rule to be found easily
         * using ValidationRules.taggedRules(rules, tag)
         */
        FluentRuleCustomizer.prototype.tag = function (tag) {
            this.rule.tag = tag;
            return this;
        };
        ///// FluentEnsure APIs /////
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        FluentRuleCustomizer.prototype.ensure = function (subject) {
            return this.fluentEnsure.ensure(subject);
        };
        /**
         * Targets an object with validation rules.
         */
        FluentRuleCustomizer.prototype.ensureObject = function () {
            return this.fluentEnsure.ensureObject();
        };
        Object.defineProperty(FluentRuleCustomizer.prototype, "rules", {
            /**
             * Rules that have been defined using the fluent API.
             */
            get: function () {
                return this.fluentEnsure.rules;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Applies the rules to a class or object, making them discoverable by the StandardValidator.
         * @param target A class or object.
         */
        FluentRuleCustomizer.prototype.on = function (target) {
            return this.fluentEnsure.on(target);
        };
        ///////// FluentRules APIs /////////
        /**
         * Applies an ad-hoc rule function to the ensured property or object.
         * @param condition The function to validate the rule.
         * Will be called with two arguments, the property value and the object.
         * Should return a boolean or a Promise that resolves to a boolean.
         */
        FluentRuleCustomizer.prototype.satisfies = function (condition, config) {
            return this.fluentRules.satisfies(condition, config);
        };
        /**
         * Applies a rule by name.
         * @param name The name of the custom or standard rule.
         * @param args The rule's arguments.
         */
        FluentRuleCustomizer.prototype.satisfiesRule = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this.fluentRules).satisfiesRule.apply(_a, [name].concat(args));
            var _a;
        };
        /**
         * Applies the "required" rule to the property.
         * The value cannot be null, undefined or whitespace.
         */
        FluentRuleCustomizer.prototype.required = function () {
            return this.fluentRules.required();
        };
        /**
         * Applies the "matches" rule to the property.
         * Value must match the specified regular expression.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.matches = function (regex) {
            return this.fluentRules.matches(regex);
        };
        /**
         * Applies the "email" rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.email = function () {
            return this.fluentRules.email();
        };
        /**
         * Applies the "minLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.minLength = function (length) {
            return this.fluentRules.minLength(length);
        };
        /**
         * Applies the "maxLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.maxLength = function (length) {
            return this.fluentRules.maxLength(length);
        };
        /**
         * Applies the "minItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRuleCustomizer.prototype.minItems = function (count) {
            return this.fluentRules.minItems(count);
        };
        /**
         * Applies the "maxItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRuleCustomizer.prototype.maxItems = function (count) {
            return this.fluentRules.maxItems(count);
        };
        /**
         * Applies the "equals" validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.equals = function (expectedValue) {
            return this.fluentRules.equals(expectedValue);
        };
        return FluentRuleCustomizer;
    }());
    exports.FluentRuleCustomizer = FluentRuleCustomizer;
    /**
     * Part of the fluent rule API. Enables applying rules to properties and objects.
     */
    var FluentRules = (function () {
        function FluentRules(fluentEnsure, parser, property) {
            this.fluentEnsure = fluentEnsure;
            this.parser = parser;
            this.property = property;
            /**
             * Current rule sequence number. Used to postpone evaluation of rules until rules
             * with lower sequence number have successfully validated. The "then" fluent API method
             * manages this property, there's usually no need to set it directly.
             */
            this.sequence = 0;
        }
        /**
         * Sets the display name of the ensured property.
         */
        FluentRules.prototype.displayName = function (name) {
            this.property.displayName = name;
            return this;
        };
        /**
         * Applies an ad-hoc rule function to the ensured property or object.
         * @param condition The function to validate the rule.
         * Will be called with two arguments, the property value and the object.
         * Should return a boolean or a Promise that resolves to a boolean.
         */
        FluentRules.prototype.satisfies = function (condition, config) {
            return new FluentRuleCustomizer(this.property, condition, config, this.fluentEnsure, this, this.parser);
        };
        /**
         * Applies a rule by name.
         * @param name The name of the custom or standard rule.
         * @param args The rule's arguments.
         */
        FluentRules.prototype.satisfiesRule = function (name) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var rule = FluentRules.customRules[name];
            if (!rule) {
                // standard rule?
                rule = this[name];
                if (rule instanceof Function) {
                    return rule.call.apply(rule, [this].concat(args));
                }
                throw new Error("Rule with name \"" + name + "\" does not exist.");
            }
            var config = rule.argsToConfig ? rule.argsToConfig.apply(rule, args) : undefined;
            return this.satisfies(function (value, obj) {
                return (_a = rule.condition).call.apply(_a, [_this, value, obj].concat(args));
                var _a;
            }, config)
                .withMessageKey(name);
        };
        /**
         * Applies the "required" rule to the property.
         * The value cannot be null, undefined or whitespace.
         */
        FluentRules.prototype.required = function () {
            return this.satisfies(function (value) {
                return value !== null
                    && value !== undefined
                    && !(util_1.isString(value) && !/\S/.test(value));
            }).withMessageKey('required');
        };
        /**
         * Applies the "matches" rule to the property.
         * Value must match the specified regular expression.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.matches = function (regex) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || regex.test(value); })
                .withMessageKey('matches');
        };
        /**
         * Applies the "email" rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.email = function () {
            // regex from https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
            /* tslint:disable:max-line-length */
            return this.matches(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
                .withMessageKey('email');
        };
        /**
         * Applies the "minLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.minLength = function (length) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length >= length; }, { length: length })
                .withMessageKey('minLength');
        };
        /**
         * Applies the "maxLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.maxLength = function (length) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length <= length; }, { length: length })
                .withMessageKey('maxLength');
        };
        /**
         * Applies the "minItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.minItems = function (count) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length >= count; }, { count: count })
                .withMessageKey('minItems');
        };
        /**
         * Applies the "maxItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.maxItems = function (count) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length <= count; }, { count: count })
                .withMessageKey('maxItems');
        };
        /**
         * Applies the "equals" validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.equals = function (expectedValue) {
            return this.satisfies(function (value) { return value === null || value === undefined || value === '' || value === expectedValue; }, { expectedValue: expectedValue })
                .withMessageKey('equals');
        };
        return FluentRules;
    }());
    FluentRules.customRules = {};
    exports.FluentRules = FluentRules;
    /**
     * Part of the fluent rule API. Enables targeting properties and objects with rules.
     */
    var FluentEnsure = (function () {
        function FluentEnsure(parser) {
            this.parser = parser;
            /**
             * Rules that have been defined using the fluent API.
             */
            this.rules = [];
        }
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor
         * function.
         */
        FluentEnsure.prototype.ensure = function (property) {
            this.assertInitialized();
            return new FluentRules(this, this.parser, this.parser.parseProperty(property));
        };
        /**
         * Targets an object with validation rules.
         */
        FluentEnsure.prototype.ensureObject = function () {
            this.assertInitialized();
            return new FluentRules(this, this.parser, { name: null, displayName: null });
        };
        /**
         * Applies the rules to a class or object, making them discoverable by the StandardValidator.
         * @param target A class or object.
         */
        FluentEnsure.prototype.on = function (target) {
            rules_1.Rules.set(target, this.rules);
            return this;
        };
        /**
         * Adds a rule definition to the sequenced ruleset.
         */
        FluentEnsure.prototype._addRule = function (rule) {
            while (this.rules.length < rule.sequence + 1) {
                this.rules.push([]);
            }
            this.rules[rule.sequence].push(rule);
        };
        FluentEnsure.prototype.assertInitialized = function () {
            if (this.parser) {
                return;
            }
            throw new Error("Did you forget to add \".plugin('aurelia-validation)\" to your main.js?");
        };
        return FluentEnsure;
    }());
    exports.FluentEnsure = FluentEnsure;
    /**
     * Fluent rule definition API.
     */
    var ValidationRules = (function () {
        function ValidationRules() {
        }
        ValidationRules.initialize = function (parser) {
            ValidationRules.parser = parser;
        };
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        ValidationRules.ensure = function (property) {
            return new FluentEnsure(ValidationRules.parser).ensure(property);
        };
        /**
         * Targets an object with validation rules.
         */
        ValidationRules.ensureObject = function () {
            return new FluentEnsure(ValidationRules.parser).ensureObject();
        };
        /**
         * Defines a custom rule.
         * @param name The name of the custom rule. Also serves as the message key.
         * @param condition The rule function.
         * @param message The message expression
         * @param argsToConfig A function that maps the rule's arguments to a "config"
         * object that can be used when evaluating the message expression.
         */
        ValidationRules.customRule = function (name, condition, message, argsToConfig) {
            validation_messages_1.validationMessages[name] = message;
            FluentRules.customRules[name] = { condition: condition, argsToConfig: argsToConfig };
        };
        /**
         * Returns rules with the matching tag.
         * @param rules The rules to search.
         * @param tag The tag to search for.
         */
        ValidationRules.taggedRules = function (rules, tag) {
            return rules.map(function (x) { return x.filter(function (r) { return r.tag === tag; }); });
        };
        /**
         * Removes the rules from a class or object.
         * @param target A class or object.
         */
        ValidationRules.off = function (target) {
            rules_1.Rules.unset(target);
        };
        return ValidationRules;
    }());
    exports.ValidationRules = ValidationRules;
});

define('aurelia-dialog/ai-dialog',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialog = undefined;

  

  var _dec, _dec2, _class;

  var AiDialog = exports.AiDialog = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialog() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-header',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogHeader = undefined;

  

  var _dec, _dec2, _class, _class2, _temp;

  var AiDialogHeader = exports.AiDialogHeader = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-header'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">\n      <span aria-hidden="true">&times;</span>\n    </button>\n\n    <div class="dialog-header-content">\n      <slot></slot>\n    </div>\n  </template>\n'), _dec(_class = _dec2(_class = (_temp = _class2 = function AiDialogHeader(controller) {
    

    this.controller = controller;
  }, _class2.inject = [_dialogController.DialogController], _temp)) || _class) || _class);
});
define('aurelia-dialog/dialog-controller',['exports', './lifecycle', './dialog-result'], function (exports, _lifecycle, _dialogResult) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogController = undefined;

  

  var DialogController = exports.DialogController = function () {
    function DialogController(renderer, settings, resolve, reject) {
      

      this.renderer = renderer;
      this.settings = settings;
      this._resolve = resolve;
      this._reject = reject;
    }

    DialogController.prototype.ok = function ok(output) {
      return this.close(true, output);
    };

    DialogController.prototype.cancel = function cancel(output) {
      return this.close(false, output);
    };

    DialogController.prototype.error = function error(message) {
      var _this = this;

      return (0, _lifecycle.invokeLifecycle)(this.viewModel, 'deactivate').then(function () {
        return _this.renderer.hideDialog(_this);
      }).then(function () {
        _this.controller.unbind();
        _this._reject(message);
      });
    };

    DialogController.prototype.close = function close(ok, output) {
      var _this2 = this;

      if (this._closePromise) {
        return this._closePromise;
      }

      this._closePromise = (0, _lifecycle.invokeLifecycle)(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
        if (canDeactivate) {
          return (0, _lifecycle.invokeLifecycle)(_this2.viewModel, 'deactivate').then(function () {
            return _this2.renderer.hideDialog(_this2);
          }).then(function () {
            var result = new _dialogResult.DialogResult(!ok, output);
            _this2.controller.unbind();
            _this2._resolve(result);
            return result;
          });
        }

        _this2._closePromise = undefined;
      }, function (e) {
        _this2._closePromise = undefined;
        return Promise.reject(e);
      });

      return this._closePromise;
    };

    return DialogController;
  }();
});
define('aurelia-dialog/lifecycle',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.invokeLifecycle = invokeLifecycle;
  function invokeLifecycle(instance, name, model) {
    if (typeof instance[name] === 'function') {
      var result = instance[name](model);

      if (result instanceof Promise) {
        return result;
      }

      if (result !== null && result !== undefined) {
        return Promise.resolve(result);
      }

      return Promise.resolve(true);
    }

    return Promise.resolve(true);
  }
});
define('aurelia-dialog/dialog-result',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var DialogResult = exports.DialogResult = function DialogResult(cancelled, output) {
    

    this.wasCancelled = false;

    this.wasCancelled = cancelled;
    this.output = output;
  };
});
define('aurelia-dialog/ai-dialog-body',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogBody = undefined;

  

  var _dec, _dec2, _class;

  var AiDialogBody = exports.AiDialogBody = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-body'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialogBody() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-footer',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogFooter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _class3, _temp;

  var AiDialogFooter = exports.AiDialogFooter = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-footer'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n\n    <template if.bind="buttons.length > 0">\n      <button type="button" class="btn btn-default" repeat.for="button of buttons" click.trigger="close(button)">${button}</button>\n    </template>\n  </template>\n'), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
    function AiDialogFooter(controller) {
      

      _initDefineProp(this, 'buttons', _descriptor, this);

      _initDefineProp(this, 'useDefaultButtons', _descriptor2, this);

      this.controller = controller;
    }

    AiDialogFooter.prototype.close = function close(buttonValue) {
      if (AiDialogFooter.isCancelButton(buttonValue)) {
        this.controller.cancel(buttonValue);
      } else {
        this.controller.ok(buttonValue);
      }
    };

    AiDialogFooter.prototype.useDefaultButtonsChanged = function useDefaultButtonsChanged(newValue) {
      if (newValue) {
        this.buttons = ['Cancel', 'Ok'];
      }
    };

    AiDialogFooter.isCancelButton = function isCancelButton(value) {
      return value === 'Cancel';
    };

    return AiDialogFooter;
  }(), _class3.inject = [_dialogController.DialogController], _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'buttons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'useDefaultButtons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-dialog/attach-focus',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AttachFocus = undefined;

  

  var _dec, _class, _class2, _temp;

  var AttachFocus = exports.AttachFocus = (_dec = (0, _aureliaTemplating.customAttribute)('attach-focus'), _dec(_class = (_temp = _class2 = function () {
    function AttachFocus(element) {
      

      this.value = true;

      this.element = element;
    }

    AttachFocus.prototype.attached = function attached() {
      if (this.value && this.value !== 'false') {
        this.element.focus();
      }
    };

    AttachFocus.prototype.valueChanged = function valueChanged(newValue) {
      this.value = newValue;
    };

    return AttachFocus;
  }(), _class2.inject = [Element], _temp)) || _class);
});
define('aurelia-dialog/dialog-configuration',['exports', './renderer', './dialog-renderer', './dialog-options', 'aurelia-pal'], function (exports, _renderer, _dialogRenderer, _dialogOptions, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogConfiguration = undefined;

  

  var defaultRenderer = _dialogRenderer.DialogRenderer;

  var resources = {
    'ai-dialog': './ai-dialog',
    'ai-dialog-header': './ai-dialog-header',
    'ai-dialog-body': './ai-dialog-body',
    'ai-dialog-footer': './ai-dialog-footer',
    'attach-focus': './attach-focus'
  };

  var defaultCSSText = 'ai-dialog-container,ai-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ai-dialog-overlay{opacity:0}ai-dialog-overlay.active{opacity:1}ai-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ai-dialog-container.active{opacity:1}ai-dialog-container>div{padding:30px}ai-dialog-container>div>div{display:block;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto}ai-dialog-container,ai-dialog-container>div,ai-dialog-container>div>div{outline:0}ai-dialog{display:table;box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ai-dialog>ai-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ai-dialog>ai-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ai-dialog>ai-dialog-body{display:block;padding:16px}ai-dialog>ai-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ai-dialog>ai-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ai-dialog>ai-dialog-footer button:disabled{cursor:default;opacity:.45}ai-dialog>ai-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ai-dialog-open{overflow:hidden}';

  var DialogConfiguration = exports.DialogConfiguration = function () {
    function DialogConfiguration(aurelia) {
      

      this.aurelia = aurelia;
      this.settings = _dialogOptions.dialogOptions;
      this.resources = [];
      this.cssText = defaultCSSText;
      this.renderer = defaultRenderer;
    }

    DialogConfiguration.prototype.useDefaults = function useDefaults() {
      return this.useRenderer(defaultRenderer).useCSS(defaultCSSText).useStandardResources();
    };

    DialogConfiguration.prototype.useStandardResources = function useStandardResources() {
      return this.useResource('ai-dialog').useResource('ai-dialog-header').useResource('ai-dialog-body').useResource('ai-dialog-footer').useResource('attach-focus');
    };

    DialogConfiguration.prototype.useResource = function useResource(resourceName) {
      this.resources.push(resourceName);
      return this;
    };

    DialogConfiguration.prototype.useRenderer = function useRenderer(renderer, settings) {
      this.renderer = renderer;
      this.settings = Object.assign(this.settings, settings || {});
      return this;
    };

    DialogConfiguration.prototype.useCSS = function useCSS(cssText) {
      this.cssText = cssText;
      return this;
    };

    DialogConfiguration.prototype._apply = function _apply() {
      var _this = this;

      this.aurelia.transient(_renderer.Renderer, this.renderer);
      this.resources.forEach(function (resourceName) {
        return _this.aurelia.globalResources(resources[resourceName]);
      });

      if (this.cssText) {
        _aureliaPal.DOM.injectStyles(this.cssText);
      }
    };

    return DialogConfiguration;
  }();
});
define('aurelia-dialog/renderer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var Renderer = exports.Renderer = function () {
    function Renderer() {
      
    }

    Renderer.prototype.getDialogContainer = function getDialogContainer() {
      throw new Error('DialogRenderer must implement getDialogContainer().');
    };

    Renderer.prototype.showDialog = function showDialog(dialogController) {
      throw new Error('DialogRenderer must implement showDialog().');
    };

    Renderer.prototype.hideDialog = function hideDialog(dialogController) {
      throw new Error('DialogRenderer must implement hideDialog().');
    };

    return Renderer;
  }();
});
define('aurelia-dialog/dialog-renderer',['exports', 'aurelia-pal', 'aurelia-dependency-injection'], function (exports, _aureliaPal, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogRenderer = undefined;

  

  var _dec, _class;

  var containerTagName = 'ai-dialog-container';
  var overlayTagName = 'ai-dialog-overlay';
  var transitionEvent = function () {
    var transition = null;

    return function () {
      if (transition) return transition;

      var t = void 0;
      var el = _aureliaPal.DOM.createElement('fakeelement');
      var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
      };
      for (t in transitions) {
        if (el.style[t] !== undefined) {
          transition = transitions[t];
          return transition;
        }
      }
    };
  }();

  var DialogRenderer = exports.DialogRenderer = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function () {
    function DialogRenderer() {
      var _this = this;

      

      this._escapeKeyEventHandler = function (e) {
        if (e.keyCode === 27) {
          var top = _this._dialogControllers[_this._dialogControllers.length - 1];
          if (top && top.settings.lock !== true) {
            top.cancel();
          }
        }
      };
    }

    DialogRenderer.prototype.getDialogContainer = function getDialogContainer() {
      return _aureliaPal.DOM.createElement('div');
    };

    DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
      var _this2 = this;

      var settings = dialogController.settings;
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];
      var wrapper = document.createElement('div');

      this.modalOverlay = _aureliaPal.DOM.createElement(overlayTagName);
      this.modalContainer = _aureliaPal.DOM.createElement(containerTagName);
      this.anchor = dialogController.slot.anchor;
      wrapper.appendChild(this.anchor);
      this.modalContainer.appendChild(wrapper);

      this.stopPropagation = function (e) {
        e._aureliaDialogHostClicked = true;
      };
      this.closeModalClick = function (e) {
        if (!settings.lock && !e._aureliaDialogHostClicked) {
          dialogController.cancel();
        } else {
          return false;
        }
      };

      dialogController.centerDialog = function () {
        if (settings.centerHorizontalOnly) return;
        centerDialog(_this2.modalContainer);
      };

      this.modalOverlay.style.zIndex = settings.startingZIndex;
      this.modalContainer.style.zIndex = settings.startingZIndex;

      var lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

      if (lastContainer) {
        lastContainer.parentNode.insertBefore(this.modalContainer, lastContainer.nextSibling);
        lastContainer.parentNode.insertBefore(this.modalOverlay, lastContainer.nextSibling);
      } else {
        body.insertBefore(this.modalContainer, body.firstChild);
        body.insertBefore(this.modalOverlay, body.firstChild);
      }

      if (!this._dialogControllers.length) {
        _aureliaPal.DOM.addEventListener('keyup', this._escapeKeyEventHandler);
      }

      this._dialogControllers.push(dialogController);

      dialogController.slot.attached();

      if (typeof settings.position === 'function') {
        settings.position(this.modalContainer, this.modalOverlay);
      } else {
        dialogController.centerDialog();
      }

      this.modalContainer.addEventListener('click', this.closeModalClick);
      this.anchor.addEventListener('click', this.stopPropagation);

      return new Promise(function (resolve) {
        var renderer = _this2;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this2.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this2.modalOverlay.classList.add('active');
        _this2.modalContainer.classList.add('active');
        body.classList.add('ai-dialog-open');

        function onTransitionEnd(e) {
          if (e.target !== renderer.modalContainer) {
            return;
          }
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      });
    };

    DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
      var _this3 = this;

      var settings = dialogController.settings;
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];

      this.modalContainer.removeEventListener('click', this.closeModalClick);
      this.anchor.removeEventListener('click', this.stopPropagation);

      var i = this._dialogControllers.indexOf(dialogController);
      if (i !== -1) {
        this._dialogControllers.splice(i, 1);
      }

      if (!this._dialogControllers.length) {
        _aureliaPal.DOM.removeEventListener('keyup', this._escapeKeyEventHandler);
      }

      return new Promise(function (resolve) {
        var renderer = _this3;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this3.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this3.modalOverlay.classList.remove('active');
        _this3.modalContainer.classList.remove('active');

        function onTransitionEnd() {
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      }).then(function () {
        body.removeChild(_this3.modalOverlay);
        body.removeChild(_this3.modalContainer);
        dialogController.slot.detached();

        if (!_this3._dialogControllers.length) {
          body.classList.remove('ai-dialog-open');
        }

        return Promise.resolve();
      });
    };

    return DialogRenderer;
  }()) || _class);


  DialogRenderer.prototype._dialogControllers = [];

  function centerDialog(modalContainer) {
    var child = modalContainer.children[0];
    var vh = Math.max(_aureliaPal.DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

    child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
    child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  }
});
define('aurelia-dialog/dialog-options',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dialogOptions = exports.dialogOptions = {
    lock: true,
    centerHorizontalOnly: false,
    startingZIndex: 1000,
    ignoreTransitions: false
  };
});
define('aurelia-dialog/dialog-service',['exports', 'aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './renderer', './lifecycle', './dialog-result', './dialog-options'], function (exports, _aureliaMetadata, _aureliaDependencyInjection, _aureliaTemplating, _dialogController, _renderer, _lifecycle, _dialogResult, _dialogOptions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogService = undefined;

  

  var _class, _temp;

  var DialogService = exports.DialogService = (_temp = _class = function () {
    function DialogService(container, compositionEngine) {
      

      this.container = container;
      this.compositionEngine = compositionEngine;
      this.controllers = [];
      this.hasActiveDialog = false;
    }

    DialogService.prototype.open = function open(settings) {
      return this.openAndYieldController(settings).then(function (controller) {
        return controller.result;
      });
    };

    DialogService.prototype.openAndYieldController = function openAndYieldController(settings) {
      var _this = this;

      var childContainer = this.container.createChild();
      var dialogController = void 0;
      var promise = new Promise(function (resolve, reject) {
        dialogController = new _dialogController.DialogController(childContainer.get(_renderer.Renderer), _createSettings(settings), resolve, reject);
      });
      childContainer.registerInstance(_dialogController.DialogController, dialogController);
      dialogController.result = promise;
      dialogController.result.then(function () {
        _removeController(_this, dialogController);
      }, function () {
        _removeController(_this, dialogController);
      });
      return _openDialog(this, childContainer, dialogController).then(function () {
        return dialogController;
      });
    };

    return DialogService;
  }(), _class.inject = [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine], _temp);


  function _createSettings(settings) {
    settings = Object.assign({}, _dialogOptions.dialogOptions, settings);
    settings.startingZIndex = _dialogOptions.dialogOptions.startingZIndex;
    return settings;
  }

  function _openDialog(service, childContainer, dialogController) {
    var host = dialogController.renderer.getDialogContainer();
    var instruction = {
      container: service.container,
      childContainer: childContainer,
      model: dialogController.settings.model,
      view: dialogController.settings.view,
      viewModel: dialogController.settings.viewModel,
      viewSlot: new _aureliaTemplating.ViewSlot(host, true),
      host: host
    };

    return _getViewModel(instruction, service.compositionEngine).then(function (returnedInstruction) {
      dialogController.viewModel = returnedInstruction.viewModel;
      dialogController.slot = returnedInstruction.viewSlot;

      return (0, _lifecycle.invokeLifecycle)(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(function (canActivate) {
        if (canActivate) {
          return service.compositionEngine.compose(returnedInstruction).then(function (controller) {
            service.controllers.push(dialogController);
            service.hasActiveDialog = !!service.controllers.length;
            dialogController.controller = controller;
            dialogController.view = controller.view;

            return dialogController.renderer.showDialog(dialogController);
          });
        }
      });
    });
  }

  function _getViewModel(instruction, compositionEngine) {
    if (typeof instruction.viewModel === 'function') {
      instruction.viewModel = _aureliaMetadata.Origin.get(instruction.viewModel).moduleId;
    }

    if (typeof instruction.viewModel === 'string') {
      return compositionEngine.ensureViewModel(instruction);
    }

    return Promise.resolve(instruction);
  }

  function _removeController(service, controller) {
    var i = service.controllers.indexOf(controller);
    if (i !== -1) {
      service.controllers.splice(i, 1);
      service.hasActiveDialog = !!service.controllers.length;
    }
  }
});
define('services/sharding-service',['exports', 'aurelia-framework', '../config/app-settings'], function (exports, _aureliaFramework, _appSettings) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ShardingService = undefined;

    var _appSettings2 = _interopRequireDefault(_appSettings);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var MAX_CONNECTIONS = 6;

    var ShardingService = exports.ShardingService = (_dec = (0, _aureliaFramework.singleton)(false), _dec(_class = function () {
        function ShardingService() {
            _classCallCheck(this, ShardingService);

            this.curIndex = 0;
            this.curConnections = 0;
        }

        ShardingService.prototype.getRemoteUrl = function getRemoteUrl() {

            if (this.curConnections >= MAX_CONNECTIONS) {
                this.curConnections = 0;
                this.curIndex++;
            }

            if (this.curIndex === _appSettings2.default.remoteUrls.length) {
                this.curIndex = 0;
            }

            this.curConnections++;
            return _appSettings2.default.remoteUrls[this.curIndex];
        };

        return ShardingService;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"semantic/semantic.css\"></require>\n  <require from=\"./styles/styles.css\"></require>\n\n  <router-view></router-view>\n\n</template>\n\n"; });
define('text!styles/styles.css', ['module'], function(module) { module.exports = "body {\n  margin: 0;\n}\n\n.splash {\n  text-align: center;\n  margin: 10% 0 0 0;\n  box-sizing: border-box;\n}\n\n.splash .message {\n  font-size: 72px;\n  line-height: 72px;\n  text-shadow: rgba(0, 0, 0, 0.5) 0 0 15px;\n  text-transform: uppercase;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n}\n\n.splash .fa-spinner {\n  text-align: center;\n  display: inline-block;\n  font-size: 72px;\n  margin-top: 50px;\n}\n\nai-dialog-container.active .ui.modal {\n  display: block;\n}\n\n.page-host {\n}\n\n@media print {\n  .page-host {\n    position: absolute;\n    left: 10px;\n    right: 0;\n    top: 50px;\n    bottom: 0;\n    overflow-y: inherit;\n    overflow-x: inherit;\n  }\n}\n\nsection {\n  margin: 0 20px;\n}\n\n/* Navbar */\n.ui.menu.navbar {\n  margin-top: 0;\n}\n\n.navbar-nav li.loader {\n  margin: 12px 24px 0 6px;\n}\n\n.pictureDetail {\n  max-width: 425px;\n}\n\n/* animate page transitions */\nsection.au-enter-active {\n  -webkit-animation: fadeInRight 1s;\n  animation: fadeInRight 1s;\n}\n\ndiv.au-stagger {\n  /* 50ms will be applied between each successive enter operation */\n  -webkit-animation-delay: 50ms;\n  animation-delay: 50ms;\n}\n\n/* Login aligned in middle */\ndiv.ui.login.grid {\n  height: 100%;\n}\n\n/* New and Edit Entry Form */\ntimesheet-entry {\n  width: 90%;\n}\n\n.timesheet-entry .ui.calendar {\n  margin-left: 0.5em;\n}\n\n.timesheet-entry + .ui.button {\n  margin-top: 20px;\n}\n\n/** List of previous timesheet entries **/\n.timesheet .ui.fluid.entries {\n  width: 90%;\n}\n\n.timesheet .ui.fluid.entries .title {\n  text-align: left;\n  background-color: #F8F8F9;\n}\n\n/** Admin allocation panel **/\n\n.user.timesheet,\n.user.report {\n  margin-bottom: 20px;\n}\n\n.user.timesheet .button {\n  vertical-align: middle;\n  margin: auto;\n  margin-left: 0;\n}\n\n/* Cards */\n\n.card-container.au-enter {\n  opacity: 0;\n}\n\n.card-container.au-enter-active {\n  -webkit-animation: fadeIn 2s;\n  animation: fadeIn 2s;\n}\n\n.card {\n  overflow: hidden;\n  position: relative;\n  border: 1px solid #CCC;\n  border-radius: 8px;\n  text-align: center;\n  padding: 0;\n  background-color: #337ab7;\n  color: rgb(136, 172, 217);\n  margin-bottom: 32px;\n  box-shadow: 0 0 5px rgba(0, 0, 0, .5);\n}\n\n.card .content {\n  margin-top: 10px;\n}\n\n.card .content .name {\n  color: white;\n  text-shadow: 0 0 6px rgba(0, 0, 0, .5);\n  font-size: 18px;\n}\n\n.card .header-bg {\n  /* This stretches the canvas across the entire hero unit */\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 70px;\n  border-bottom: 1px #FFF solid;\n  border-radius: 6px 6px 0 0;\n}\n\n.card .avatar {\n  position: relative;\n  margin-top: 15px;\n  z-index: 100;\n}\n\n.card .avatar img {\n  width: 100px;\n  height: 100px;\n  -webkit-border-radius: 50%;\n  -moz-border-radius: 50%;\n  border-radius: 50%;\n  border: 2px #FFF solid;\n}\n\n/** Flash Messages **/\n.flash {\n    margin-bottom: 20px;\n}\n\n.flash .message {\n    display: none;\n}\n\n.flash .message.background-animation-add,\n.flash .message.background-animation-remove {\n    display: block;\n}\n\n.background-animation-add.positive {\n    display: block;\n    -webkit-animation: flashSuccess 4s;\n    animation: flashSuccess 4s;\n}\n\n.background-animation-add.negative {\n    display: block;\n    -webkit-animation: flashError 8s;\n    animation: flashError 8s;\n    color: white;\n}\n\n@-webkit-keyframes flashSuccess {\n    0% { background-color: white; }\n    25% { background-color: #a3c293; }\n    50% { background-color: white; }\n    75% { background-color: #a3c293; }\n    100% { background-color: white; }\n}\n\n@keyframes flashSuccess {\n    0% { background-color: white; }\n    25% { background-color: #a3c293; }\n    50% { background-color: white; }\n    75% { background-color: #a3c293; }\n    100% { background-color: white; }\n}\n\n@-webkit-keyframes flashError {\n    0% { background-color: #FFF6F6; }\n    5% { background-color: #9f3a38; }\n    15% { background-color: #FFF6F6; }\n}\n\n@keyframes flashError {\n    0% { background-color: #FFF6F6; }\n    5% { background-color: #9f3a38; }\n    15% { background-color: #FFF6F6; }\n}\n\n@media only screen and (max-device-width: 767px) {\n\n  .timesheet-entry .ui.calendar {\n    margin-left: 0;\n  }\n\n  .timesheet-entry.ui.form .two.hours.fields > .field {\n    width: 50% !important;\n  }\n\n  .timesheet-entry.ui.form .two.hours.fields > .field input {\n    width: 60px;\n  }\n\n  .ui.monthly.timesheet.table thead {\n    display: none;\n  }\n}"; });
define('text!components/top-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n\n    <confirmation approve-callback></confirmation>\n\n    <div class=\"top-bar ui menu navbar\">\n        <div class=\"left menu\">\n            <div class=\"item\">\n                <i if.bind=\"isSynced\" class=\"green feed icon\"></i>\n                <i if.bind=\"!isSynced\" class=\"red feed icon\"></i>\n                <a \n                    route-href=\"route: error-report\"\n                    if.bind=\"error\"\n                >\n                    <i class=\"red alarm icon\"></i>\n                </a>\n            </div>\n        </div>\n        <div class=\"right menu\">\n\n            <a \n                route-href=\"route: admin-planning\"\n                class=\"item\"\n                if.bind=\"isAdmin\"\n            >\n                <i class=\"calculator icon\"></i>\n            </a>\n\n            <a \n                route-href=\"route: timesheets\"\n                class=\"item\"\n            >\n                <i class=\"add to calendar icon\"></i>\n            </a>\n\n            <a \n                route-href=\"route: planning\"\n                class=\"item\"\n            >\n                <i class=\"calendar icon\"></i>\n            </a>\n\n            <a \n                route-href=\"route: user\"\n                class=\"item\"\n            >\n                <i class=\"user icon\"></i>\n            </a>\n\n            <a href=\"#\" class=\"item\" click.delegate=\"logout()\">\n                 <i class=\"sign out icon\"></i>\n            </a>\n            \n        </div>\n    </div>\n</template>"; });
define('text!components/user-app-router.html', ['module'], function(module) { module.exports = "<template>\n\n    <require from=\"./top-bar\"></require>\n\n    <top-bar router.bind=\"router\"></top-bar>\n\n    <div class=\"divider\"></div>\n\n    <nav-bar router.bind=\"router\"></nav-bar>\n\n    <div class=\"full height ui grid\">\n        <div class=\"row\">\n            <compose class=\"sixteen wide column\" view-model=\"resources/flash/flash\"></compose>\n        </div>\n\n        <div class=\"row\">\n\n            <div class=\"page-host centered fourteen wide column pusher\">\n                <div class=\"main-panel-container\">\n                    <router-view></router-view>\n                </div>\n            </div>\n\n        </div>\n    </div>\n\n</template>\n"; });
define('text!pages/admin/admin-panel.html', ['module'], function(module) { module.exports = "<template>\n\n    <require from=\"./users-timesheets\"></require>\n    <require from=\"./admin-reports\"></require>\n\n    <div class=\"ui two item stackable tabs pointing huge admin panel menu\">        \n          <a class=\"active item\" data-tab=\"definition\"><i class=\"checkmark icon\"></i></a>\n          <a class=\"item\" data-tab=\"reports\"><i class=\"pie chart icon\"></i></a>\n    </div>\n\n    <div data-tab=\"definition\" class=\"ui tab segment active\">\n        <users-timesheets\n            month.bind=\"month\"\n        >\n        </users-timesheets>\n    </div>\n    <div data-tab=\"reports\" class=\"ui tab segment\">\n        <admin-reports\n            month.bind=\"month\"\n        >\n        </admin-reports>\n    </div>\n\n</template>"; });
define('text!pages/admin/admin-report.html', ['module'], function(module) { module.exports = "<template>\n\n    <table class=\"ui celled table\">\n        <thead>\n            <tr>\n                <th t=\"allocation\">Allocation</th>\n                <th t=\"ratio\">Ratio</th>\n                <th t=\"duration\">Duration</th>\n                <th t=\"salary\">Salary (641)</th>\n                <th t=\"charges\">Charges (645)</th>\n                <th t=\"provisionCP\">Prov. (641200)</th>\n                <th t=\"provision-charges\">Prov. Charges (645000)</th>\n                <th t=\"precaritebrut\">Precarite Brut</th>\n                <th t=\"precaritecharges\">Precarite Charges</th>                \n            </tr>\n        </thead>\n        <tbody>\n            <tr repeat.for=\"report of entries\">\n                <td>${report.allocationName}</td>\n                <td>${report.ratio.toFixed(2)}%</td>\n                <td>${report.duration.toFixed(2)}h</td>\n                <td>${report.salary.toFixed(2)}$</td>\n                <td>${report.accounts.charges.toFixed(2)}$</td>\n                <td>${report.accounts.provisionCPBrut.toFixed(2)}${ '$' | t }</td>\n                <td>${report.accounts.provisionCPCharges.toFixed(2)}${ '$' | t }</td>\n                <td>${report.accounts.primePrecariteBrut.toFixed(2)}${ '$' | t }</td>\n                <td>${report.accounts.primePrecariteCharges.toFixed(2)}${ '$' | t }</td>\n            </tr>\n        </tbody>\n        <tfoot>\n            <tr>\n                <th t=\"total\"></th>\n                <th>${ totals.ratio.toFixed(2) }%</th>\n                <th>${ totals.duration.toFixed(2) }h</th>\n                <th>${ totals.salary.toFixed(2) }${ '$' | t }</th>\n                <th>${ totals.accounts.charges.toFixed(2) }${ '$' | t }</th>\n                <th>${ totals.accounts.provisionCPBrut.toFixed(2) }${ '$' | t }</th>\n                <th>${ totals.accounts.provisionCPCharges.toFixed(2) }${ '$' | t }</th>\n                <th>${ totals.accounts.primePrecariteBrut.toFixed(2) }${ '$' | t }</th>\n                <th>${ totals.accounts.primePrecariteCharges.toFixed(2) }${ '$' | t }</th>\n            </tr>\n            <tr>\n                <th t=\"netpayable\"></th>\n                <th>${ totals.accounts.netPayable.toFixed(2) }${ '$' | t }</th>\n            </tr>\n            <tr>\n                <th t=\"ursaff\"></th>\n                <th>${ totals.accounts.ursaff.toFixed(2) }${ '$' | t }</th>\n            </tr>\n            <tr>\n                <th t=\"provisionCP\"></th>\n                <th>${ totals.accounts.provisionCP.toFixed(2) }${ '$' | t }</th>\n            </tr>\n            <tr>\n                <th t=\"provisionprecarite\"></th>\n                <th>${ totals.accounts.provisionPrecarite.toFixed(2) }${ '$' | t }</th>\n            </tr>\n        </tfoot>\n    </table>\n\n</template>"; });
define('text!pages/admin/admin-reports.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../../resources/dropdown/dropdown\"></require>\n    <require from=\"./admin-report\"></require>\n    \n    <div class=\"admin reports ui container fluid\">\n\n        <h2>${month}</h2>\n        <div class=\"ui horizontal segments\">       \n            <div class=\"left aligned ui segment\">\n                <dropdown \n                    selected-entry.two-way=\"accountingRuleEndKey\"\n                    route=\"accounting\"\n                    name=\"timesheet:accountingrules\"\n                    required.bind=true\n                    allow-add.bind=false\n                >\n                </dropdown>\n            </div>\n            <div class=\"right aligned ui segment\">\n                <a id=\"csv-export-link\" t=\"download\">Download</a>\n            </div>\n        </div>\n\n        <div class=\"ui grid basic segment\">\n            <div \n                class=\"ui toggle checkbox\"\n                id=\"showMonthAggregate\"\n            >\n                <input\n                    type=\"checkbox\"\n                    name=\"monthaggregate\"\n                >\n                <label t=\"report:showmonthaggregate\">Show month aggregate</label>\n            </div>\n        </div>\n\n        <div \n            class=\"user report\"\n            if.bind=\"!showMonthAggregate\"\n            repeat.for=\"[userName, userReport] of allocationUserReports\"\n        >\n            <h3>${ userName }</h3>\n            <div class=\"right aligned ui segment\">\n                <a \n                    id=\"${userName}-csv-export-link\"\n                    t=\"download\"\n                    data-user=\"${userName}\"\n                >\n                    Download\n                </a>\n            </div>\n\n            <admin-report entries.bind=\"userReport.entries\" totals.bind=\"userReport.totals\"></admin-report>\n            \n        </div>\n\n        <admin-report\n            if.bind=\"showMonthAggregate\"\n            entries.bind=\"allocationReports.entries\"\n            totals.bind=\"allocationReports.totals\"\n        >\n        </admin-report>        \n\n    </div>\n\n</template>"; });
define('text!pages/admin/admin-router.html', ['module'], function(module) { module.exports = "<template>\n    <router-view></router-view>\n</template>"; });
define('text!pages/admin/planning.html', ['module'], function(module) { module.exports = "<template>\n\n    <div \n        class=\"ui calendar\"\n        data-property=\"date\"\n    >\n        <div class=\"ui input left icon\">\n            <input\n                class=\"\"\n                type=\"hidden\"\n            />\n        </div>\n    </div>      \n\n</template>"; });
define('text!pages/admin/user-timesheet.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../../resources/formats/date-format\"></require>\n    <require from=\"../../resources/formats/truncate\"></require>\n\n    <require from=\"../../resources/dropdown/dropdown\"></require>\n\n    <div class=\"username\"><h2>${ userName }</h2></div>\n    \n    <div class=\"${ userName } ui middle aligned segment\">\n        <form\n            class=\"ui form\"\n            validation-renderer=\"semantic-form\"\n            validation-errors.bind=\"errors\"\n        >\n            <div class=\"three fields\">\n                <div class=\"salary inline four wide field\">\n                    <label>${ 'salary' | t}:</label>\n                    <input type=\"text\" value.bind=\"timesheet.salary & validate\"/>\n                </div>\n                <div class=\"precarite ui checkbox inline four wide field\">\n                    <label>${ 'precarite' | t}?</label>\n                    <input type=\"checkbox\" value.bind=\"timesheet.precarite & validate\"/>\n                </div>\n                <div class=\"inline middle aligned four wide field\">\n                    <button\n                        class=\"ui small primary button\"\n                        tabindex=\"0\"\n                        t=\"save\"\n                        click.delegate=\"saveTimesheet(userName)\"\n                    >\n                        Save\n                    </button>    \n                </div>\n            </div>\n        </form>\n    </div>\n    \n    <form\n        class=\"ui user timesheet form\"\n        validation-renderer=\"semantic-form\"\n        validation-errors.bind=\"errors\"\n    >\n\n        <table class=\"ui striped fixed monthly timesheet table\">\n            <thead>\n                <tr>\n                    <th t=\"date\">Date</th>\n                    <th t=\"purpose\">Purpose</th>\n                    <th t=\"duration\">Duration</th>\n                    <th t=\"description\">Observation</th>\n                    <th t=\"allocation\">Allocation</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr\n                    repeat.for=\"entity of timesheet.entries\"\n                    click.delegate=\"openEntry(entity.id)\"\n                    if.bind=\"entity.allocation === undefined || entity.allocation === null || !unallocatedOnly\"\n                >\n                    <td>${ entity.date | dateFormat }</td>\n                    <td>${ purposes.get(entity.purpose) }</td>\n                    <td>${ entity.duration }${ 'h' | t }</td>\n                    <td>${ entity.observation | truncate: 40 }</td>\n                    <td onclick=\"event.stopPropagation();\" style=\"overflow:visible;\">\n                        <dropdown \n                            selected-entry.two-way=\"entity.allocation\"\n                            route=\"allocation\"\n                            name=\"timesheet:allocation\"\n                            required.bind=false\n                            allow-add.bind=true\n                            select-action.call=\"allocationSelected(dropdown)\"\n                            add-action.call=\"allocationAdded(dropdown)\"\n                            data-username=\"${username}\"\n                            data-entryid=\"${entity.id}\"\n                        >\n                        </dropdown>\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n\n    </form>\n\n</template>"; });
define('text!pages/admin/users-timesheets.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./user-timesheet\"></require>\n\n    <div class=\"ui grid basic segment\">\n        <div \n            class=\"ui toggle checkbox\"\n            id=\"showAll\"\n        >\n            <input\n                type=\"checkbox\"\n                name=\"allentries\"\n            >\n            <label t=\"timesheet:showallentries\">Show all entries</label>\n        </div>\n    </div>\n\n\n    <div \n        repeat.for=\"[username, timesheet] of timesheets\"\n        class=\"user timesheet\"\n    >\n        <user-timesheet\n            class=\"\"\n            save-action.call=\"saveEntry(entity)\"\n            timesheet.bind=\"timesheet\"\n            user-name.bind=\"username\"\n            purposes.bind=\"purposes\"\n            unallocated-only.bind=\"unallocatedOnly\"\n            accounting-rules.bind=\"accountingRules\"\n        >\n        </user-timesheet>\n\n    </div>\n\n</template>"; });
define('text!pages/timesheets/monthly-timesheet.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../../resources/formats/date-format\"></require>\n    <require from=\"../../resources/formats/truncate\"></require>\n\n    <table class=\"ui striped fixed monthly timesheet table\">\n        <thead>\n            <tr>\n                <th t=\"date\">Date</th>\n                <th t=\"purpose\">Purpose</th>\n                <th t=\"duration\">Duration</th>\n                <th t=\"interpret\">Interpret</th>\n                <th t=\"interpret-time\">Time</th>\n                <th t=\"description\">Observation</th>\n                <th t=\"travel\">Travel</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr repeat.for=\"entity of entity.entries\" click.delegate=\"openEntry(entity.id)\">\n                <td>${ entity.date | dateFormat }</td>\n                <td>${ purposes.get(entity.purpose) }</td>\n                <td>${ entity.duration }${ 'h' | t }</td>\n                <td>${ interprets.get(entity.interpret) }</td>\n                <td>${ entity.interpret_duration }${ 'h' }</td>\n                <td>${ entity.observation | truncate: 40 }</td>\n                <td>${ entity.travel | truncate: 40 }</td>\n            </tr>\n        </tbody>\n    </table>\n\n</template>"; });
define('text!pages/timesheets/planning-router.html', ['module'], function(module) { module.exports = "<template>\n    <router-view></router-view>\n</template>"; });
define('text!pages/timesheets/planning.html', ['module'], function(module) { module.exports = "<template>\n\n    <div \n        class=\"ui calendar\"\n        data-property=\"date\"\n    >\n        <div class=\"ui input left icon\">\n            <input\n                class=\"\"\n                type=\"hidden\"\n            />\n        </div>\n    </div>      \n\n</template>"; });
define('text!pages/timesheets/timesheet-entry.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../../resources/dropdown/dropdown\"></require>\n\n    <form\n        class=\"ui timesheet-entry form\"\n        validation-renderer=\"semantic-form\"\n        validation-errors.bind=\"errors\"\n    >\n        \n        <div class=\"two fields\">\n\n            <div class=\"two fields\">\n\n                <div class=\"field\">\n                    <label t=\"date\">Date</label>\n                    <div \n                        class=\"date ui calendar\"\n                        data-property=\"date\"\n                    >\n                        <div class=\"ui input left icon\">\n                            <i class=\"calendar icon\"></i>\n                            <input\n                                class=\"\"\n                                type=\"text\"\n                                t=\"[placeholder]timesheet:date\"\n                                value.bind=\"dateInput & validate\"\n                            />\n                        </div>\n                    </div>      \n                </div>\n\n                <div class=\"field\">\n                    <label t=\"purpose\">Purpose</label>\n                    <dropdown \n                        selected-entry.two-way=\"entity.purpose & validate\"\n                        route=\"purpose\"\n                        name=\"timesheet:purpose\"\n                        required.bind=true\n                        allow-add.bind=true\n                    >\n                    </dropdown>                \n                </div>\n\n            </div>\n\n            <div class=\"field\">\n                <label t=\"time\">Time Spent</label>\n                <div class=\"two hours fields\">\n                    <div class=\"inline field\">\n                        <input\n                            class=\"short integer input\"\n                            id=\"HoursInput\"\n                            type=\"text\"\n                            t=\"[placeholder]timesheet:hours\"\n                            value.bind=\"entity.hours & validate\"\n                        />\n                        <label class=\"ui right floated\" t=\"timesheet:hours\">hours</label>\n                    </div>\n                    <div class=\"inline field\">\n                        <input\n                            class=\"short integer input\"\n                            type=\"text\"\n                            t=\"[placeholder]timesheet:minutes\"\n                            value.bind=\"entity.minutes & validate\"\n                        />\n                        <label class=\"ui right floated\" t=\"timesheet:minutes\">minutes</label>\n                    </div>\n                </div>\n            </div>\n        \n        </div>\n\n        <div class=\"two fields\">\n\n            <div class=\"field\">\n                <label t=\"interpret\">Interpret</label>\n                <dropdown \n                    selected-entry.two-way=\"entity.interpret & validate\"\n                    route=\"interpret\"\n                    name=\"timesheet:interpret\"\n                    required.bind=false\n                    allow-add.bind=true\n                >\n                </dropdown>\n            </div>\n\n            <div class=\"field\">\n                <label t=\"interpret-time\">Time for interpret</label>\n                <div class=\"two hours fields\">\n                    <div class=\"inline field\">\n                        <input\n                            class=\"\"\n                            type=\"text\"\n                            t=\"[placeholder]timesheet:hours\"\n                            value.bind=\"entity.interpret_hours & validate\"\n                        />\n                        <label class=\"ui right floated\" t=\"timesheet:hours\">hours</label>\n                    </div>\n                    <div class=\"inline field\">\n                        <input\n                            class=\"\"\n                            type=\"text\"\n                            t=\"[placeholder]timesheet:minutes\"\n                            value.bind=\"entity.interpret_minutes & validate\"\n                        />\n                        <label class=\"ui right floated\" t=\"timesheet:minutes\">minutes</label>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"field\">\n            <label t=\"observation\">Observation</label>\n            <textarea\n                class=\"\"\n                rows=\"2\"\n                t=\"[placeholder]timesheet:observation\"\n                value.bind=\"entity.observation & validate\"\n            >\n            </textarea>\n        </div>\n\n        <div class=\"field\">\n            <label t=\"travel\">Travel</label>\n            <textarea\n                class=\"\"\n                rows=\"2\"\n                t=\"[placeholder]timesheet:travel\"\n                value.bind=\"entity.travel & validate\"\n            >\n            </textarea>\n        </div>        \n\n    </form>\n\n    <button\n        class=\"ui primary fluid button\"\n        tabindex=\"0\"\n        t=\"save\"\n        if.bind=\"isEditable\"\n        click.trigger=\"doSave($event)\"\n    >\n        Save\n    </button>\n    \n</template>"; });
define('text!pages/timesheets/timesheets-router.html', ['module'], function(module) { module.exports = "<template>\n    <router-view></router-view>\n</template>"; });
define('text!pages/timesheets/timesheets.html', ['module'], function(module) { module.exports = "<template>\n\n    <require from=\"./timesheet-entry\"></require>\n    <require from=\"../../resources/formats/date-format\"></require>\n    <require from=\"../../resources/formats/limit-to-value\"></require>\n\n    <confirmation approve-callback></confirmation>\n\n    <div class=\"ui timesheets\">\n\n        <div class=\"ui centered fluid new timesheet\">\n            <div class=\"content\">\n                <div class=\"ui sixteen wide column grid\">\n                    <div class=\"centered row\">\n                        <timesheet-entry\n                            class=\"\"\n                            create.bind=\"true\"\n                            save-action.call=\"saveEntry(entity)\"\n                        >\n                        </timesheet-entry>\n                    </div>\n\n                    <div class=\"centered row\">\n                        <div class=\"ui styled fluid accordion entries\">\n                            <template repeat.for=\"entity of lastTimesheet.doc.entries | limitTo: 5\">\n                                <div class=\"title\">\n                                    <i class=\"dropdown icon\"></i>\n                                    ${ entity.date  | dateFormat } - \n                                    ${ entity.hours }${ 'h' | t }${ entity.minutes }${ 'mn' | t } -\n                                    ${ purposes.get(entity.purpose) }\n                                </div>\n                                <div class=\"content\">\n                                    <timesheet-entry\n                                        class=\"\"\n                                        create.bind=\"false\"\n                                        save-action.call=\"saveEntry(entity)\"\n                                        entity.bind=\"entity\"\n                                    >\n                                    </timesheet-entry>\n                                </div>\n                            </template>\n                        </div>\n                            \n                    </div>                    \n                </div>\n            </div>\n        </div>\n\n    </div>\n\n</template>"; });
define('text!pages/user/logged-redirect.html', ['module'], function(module) { module.exports = "<template>\n</template>"; });
define('text!pages/user/login.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"semantic/semantic.css\"></require>\n    <div class=\"ui login middle aligned center aligned grid\">\n        <div class=\"column\">\n            <h2 class=\"ui teal image header\">\n            <div class=\"content\" t=\"loginmessage\">\n                Log-in to your account\n            </div>\n            </h2>\n            <form class=\"ui large form\">\n            <div class=\"ui stacked segment\">\n                <div class=\"field\">\n                <div class=\"ui left icon input\">\n                    <i class=\"user icon\"></i>\n                    <input type=\"text\" name=\"username\" placeholder=\"${ 'username' | t }\" value.bind=\"username\">\n                </div>\n                </div>\n                <div class=\"field\">\n                <div class=\"ui left icon input\">\n                    <i class=\"lock icon\"></i>\n                    <input type=\"password\" name=\"password\" placeholder=\"${ 'password' | t }\" value.bind=\"password\">\n                </div>\n                </div>\n                <button \n                    class=\"ui fluid large teal submit button\"\n                    t=\"login\"\n                    click.delegate=\"login()\"\n                >\n                Login\n                </button>\n            </div>\n\n            <div class=\"ui login error message\">\n                ${ loginError }\n            </div>\n\n            </form>\n\n            <div class=\"ui message\" t=\"[html]nologin_message\">\n                ${ 'nologin_message'| t } <a href=\"mailto:${ settings.contact }\">${ settings.contact }</a>\n            </div>\n            \n        </div>\n    </div>\n</template>\n"; });
define('text!pages/user/password.html', ['module'], function(module) { module.exports = "<template>\n\n    <require from=\"../../resources/dropdown/dropdown\"></require>\n    \n    <form\n        class=\"ui form\"\n        validation-renderer=\"semantic-form\"\n        validation-errors.bind=\"errors\"\n    >\n\n        <div class=\"ui grid\">\n            <div class=\"thirteen wide column\">\n                <div class=\"field\">\n                    <label t=\"user:currentpassword\">Current Password</label>\n                    <input\n                        type=\"password\"\n                        value.bind=\"form.current_password & validate:rules\"\n                        t=\"[placeholder]user:currentpassword\"\n                    />\n                </div>            \n                <div class=\"field\">\n                    <label t=\"user:newpassword\">New Password</label>\n                    <input\n                        type=\"password\"\n                        value.bind=\"form.plain_password.first & validate:newrules\"\n                        t=\"[placeholder]user:newpassword\"\n                    />\n                </div>            \n                <div class=\"field\">\n                    <label t=\"user:repeatpassword\">Repeat Password</label>\n                    <input\n                        type=\"password\"\n                        value.bind=\"form.plain_password.second & validate:newrules\"\n                        t=\"[placeholder]user:repeatpassword\"\n                    />\n                </div>            \n\n                <button\n                    class=\"ui primary large submit button\"\n                    tabindex=\"0\"\n                    t=\"save\"\n                    click.trigger=\"save($event)\"\n                >\n                    Save\n                </button>              \n\n            </div>\n        </div>\n\n    </form>\n    \n</template>"; });
define('text!pages/user/user-router.html', ['module'], function(module) { module.exports = "<template>\n\n    <div class=\"ui grid user router\">\n\n        <div class=\"four wide column\">\n\n            <nav class=\"ui visible sticky vertical labeled icon menu\" role=\"navigation\">\n            <a \n                repeat.for=\"row of router.navigation\" \n                class=\"\n                ${row.isActive ? 'active' : ''} teal item menu\n                \"\n                href.bind=\"row.href\"\n            >\n                <desktop t=\"${row.title}\">\n                </desktop>\n                <i \n                class=\"\n                    ${row.settings.icon} icon\n                \"\n                >\n                </i>\n            </a>\n            </nav>\n        </div>\n    \n        <div class=\"twelve wide column\">\n            <router-view></router-view>\n        </div>\n\n    </div>\n\n</template>"; });
define('text!resources/confirmation/confirmation.html', ['module'], function(module) { module.exports = "<template>\n\n    <div tabindex=\"-1\" role=\"dialog\" class=\"ui small modal confirmation modal-dialog\">\n        <div class=\"header\" t=\"confirmation\">Confirmation</div>\n        <div class=\"content\">\n            <p>${message | t}</p>\n        </div>\n        <div class=\"actions\">\n            <div \n                class=\"ui cancel negative button\"\n                click.trigger=\"dialogController.cancel()\"\n                t=\"no\"\n            >\n                No\n            </div>\n            <div \n                class=\"ui positive approve right labeled icon button\"\n                click.trigger=\"dialogController.ok()\"\n            >\n                ${ 'yes' | t}\n                <i class=\"checkmark icon\"></i>\n            </div>\n        </div>\n    </div>\n    \n</template>"; });
define('text!resources/confirmation/delete-button.html', ['module'], function(module) { module.exports = "<template>\n    <a \n        class=\"negative ui\"\n        click.trigger=\"do($event)\"\n    >\n        <i class=\"trash icon\"></i>\n    </a>\n</template>"; });
define('text!resources/dropdown/dropdown.html', ['module'], function(module) { module.exports = "<template>\n\n    <div\n        class=\"ui fluid dropdown search selection ${multiple === true?'multiple':''}\"\n        tabindex=\"0\"\n    >\n        <input\n            if.bind=\"!multiple\"\n            type=\"hidden\"\n            name.bind=\"name\"\n            value.bind=\"selectedEntry\"\n        />\n\n        <select\n            if.bind=\"multiple === true\"\n            name.bind=\"name\"\n            multiple=\"\"\n        >        \n            <option if.bind=\"!required && !multiple\" t=\"All\" data-value=\"\" value=\"\">All</option>\n            <option\n                repeat.for=\"entry of entries\"\n                value=\"${entry.id}\"\n            >\n                ${entry.doc.name}\n            </option>\n        </select>\n        \n        <i class=\"dropdown icon\"></i>\n        <div \n            class=\"\n                ${selectedEntry?'':'default'}\n                text\n            \"\n            t=\"${name}\"\n            data-default=\"${name|t}\"\n            innerHTML.bind=\"selectedEntryName\"\n        >\n            Entry\n        </div>\n        <div class=\"menu transition\" tabindex=\"-1\">\n            <div if.bind=\"!required && !multiple\" class=\"item\" t=\"All\" data-value=\"\">All</div>\n            <div\n                repeat.for=\"entry of entries\"\n                data-value=\"${entry.id}\"\n                class=\"\n                    item\n                    ${selectedEntry == entry.id ? 'active selected':''}\n                \"\n            >\n                ${entry.doc.name}\n            </div>\n        </div>        \n    </div>\n\n</template>"; });
define('text!resources/flash/flash.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"one flash item\">\n        <div \n            class=\"ui message\"\n        >\n            ${ message }\n        </div>\n    </div>\n</template>"; });
define('text!resources/pagination/paginator.html', ['module'], function(module) { module.exports = "<template>\n    <div \n        if.bind=\"pagination.numberPages > 1 && hasLoadMore\"\n        class=\"pagination more\"\n    >\n        <button \n            class=\"fluid ui primary basic button\"\n            click.delegate=\"loadMore()\"\n            t=\"paginate.more\"\n        >\n        </button>\n    </div>\n\n    <div if.bind=\"!hasLoadMore\">\n\n        <div \n            if.bind=\"pagination.numberPages > 1\"\n            class=\"ui stackable pagination menu\"\n        >\n            <a \n                repeat.for=\"i of pagination.startPages\"\n                class=\"\n                    ${i+1 === pagination.currentPage ? 'active' : ''}\n                    item\n                \"\n                click.delegate=\"paginate(i+1)\"\n            >\n                ${i+1}\n            </a>     \n            <div\n                repeat.for=\"i of pagination.firstDisabledPages\" \n                class=\"disabled item\">\n                ...\n            </div>\n            <a \n                repeat.for=\"i of pagination.visiblePages\"\n                class=\"\n                    ${i+1 === pagination.currentPage ? 'active' : ''}\n                    item\n                \"\n                click.delegate=\"paginate(i+1)\"\n            >\n                ${i+1}\n            </a>\n            <div\n                repeat.for=\"i of pagination.lastDisabledPages\" \n                class=\"disabled item\">\n                ...\n            </div>\n            <a \n                repeat.for=\"i of pagination.endPages\"\n                class=\"\n                    ${i+1 === pagination.currentPage ? 'active' : ''}\n                    item\n                \"\n                click.delegate=\"paginate(i+1)\"\n            >\n                ${i+1}\n            </a> \n        </div>\n        <div class=\"ui pagination action input pages\">\n            <input\n                type=\"text\"\n                value.bind=\"pagination.itemsPerPage\"\n            >\n            <div \n                class=\"ui button\"\n                click.delegate=\"paginate()\"\n                t=\"paginate.go\"\n            >\n                Go\n            </div>\n        </div>\n    </div>\n\n</template>"; });
//# sourceMappingURL=app-bundle.js.map