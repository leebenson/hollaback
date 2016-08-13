'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

// Func to attempt the connection
var handleConnect = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(opt) {
    return _regenerator2.default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', _promise2.default.race([

            // global timeout
            new _promise2.default(function timeout(_, reject) {
              setTimeout(function didTimeout() {
                reject(new Error('Timed out after ' + opt.options.timeout + 'ms'));
              }, opt.options.timeout);
            }),

            // connection handler
            new _promise2.default(function () {
              var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
                var _this = this;

                var _loop;

                return _regenerator2.default.wrap(function _callee$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _loop = _regenerator2.default.mark(function _loop() {
                          var client;
                          return _regenerator2.default.wrap(function _loop$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  client = _net2.default.connect(opt.socket, function hasConnected() {
                                    client.end();
                                    resolve(opt.socket.host + ':' + opt.socket.port + ' connected');
                                  });

                                  // Set socket timeout

                                  client.setTimeout(opt.options.socketTimeout);

                                  // Error handler - catch and ignore
                                  client.on('error', function () {});

                                  // Retry after a delay...
                                  _context.next = 5;
                                  return (0, _delay2.default)(opt.options.retry);

                                case 5:
                                case 'end':
                                  return _context.stop();
                              }
                            }
                          }, _loop, _this);
                        });

                      case 1:
                        if (!true) {
                          _context2.next = 5;
                          break;
                        }

                        return _context2.delegateYield(_loop(), 't0', 3);

                      case 3:
                        _context2.next = 1;
                        break;

                      case 5:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee, this);
              }));

              function handleConnectResolver(_x3) {
                return _ref2.apply(this, arguments);
              }

              return handleConnectResolver;
            }())]));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee2, this);
  }));

  return function handleConnect(_x2) {
    return _ref.apply(this, arguments);
  };
}();

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _delay = require('delay');

var _delay2 = _interopRequireDefault(_delay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Recursively flatten an array
function recursiveFlatten(arr) {
  var res = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(arr), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var val = _step.value;

      Array.isArray(val) && recursiveFlatten(val, res) || res.push(val);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return res;
}

module.exports = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var promises, options, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, hosts, _hosts$split, _hosts$split2, host, port;

    return _regenerator2.default.wrap(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:

            // Promises to resolve
            promises = [];

            // Set up our default options

            options = {
              retry: 500, // half a second
              timeout: 30 * 1000, // 30 seconds
              socketTimeout: 1000 };

            // Is the last type an object? Overwrite our defaults with
            // whatever is passed in

            if (!!args[args.length - 1] && args[args.length - 1].constructor === Object) {
              (0, _assign2.default)(options, args.pop());
            }

            // Whatever remains, we'll treat as our hosts -- we'll treat arrays
            // as collections of strings, so flatten
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context4.prev = 6;
            for (_iterator2 = (0, _getIterator3.default)(recursiveFlatten(args)); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              hosts = _step2.value;
              _hosts$split = hosts.split(':');
              _hosts$split2 = (0, _slicedToArray3.default)(_hosts$split, 2);
              host = _hosts$split2[0];
              port = _hosts$split2[1];

              promises.push(handleConnect({
                socket: {
                  host: host,
                  port: port
                },
                options: options
              }));
            }

            // Resolve once all of the promises are ready to go
            _context4.next = 14;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4['catch'](6);
            _didIteratorError2 = true;
            _iteratorError2 = _context4.t0;

          case 14:
            _context4.prev = 14;
            _context4.prev = 15;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 17:
            _context4.prev = 17;

            if (!_didIteratorError2) {
              _context4.next = 20;
              break;
            }

            throw _iteratorError2;

          case 20:
            return _context4.finish(17);

          case 21:
            return _context4.finish(14);

          case 22:
            return _context4.abrupt('return', _promise2.default.all(promises));

          case 23:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee3, this, [[6, 10, 14, 22], [15,, 17, 21]]);
  }));

  function hollaback(_x4) {
    return _ref3.apply(this, arguments);
  }

  return hollaback;
}();