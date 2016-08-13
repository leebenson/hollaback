'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// Func to attempt the connection
let handleConnect = (() => {
  var _ref = _asyncToGenerator(function* (opt) {
    return Promise.race([

    // global timeout
    new Promise(function timeout(_, reject) {
      setTimeout(function didTimeout() {
        reject(new Error(`Timed out after ${ opt.options.timeout }ms`));
      }, opt.options.timeout);
    }),

    // connection handler
    new Promise((() => {
      var _ref2 = _asyncToGenerator(function* (resolve) {

        // Loop forever --  our race condition will GC this
        while (true) {

          const client = _net2.default.connect(opt.socket, function hasConnected() {
            client.end();
            resolve(`${ opt.socket.host }:${ opt.socket.port } connected`);
          });

          // Set socket timeout
          client.setTimeout(opt.options.socketTimeout);

          // Error handler - catch and ignore
          client.on('error', function () {});

          // Retry after a delay...
          yield (0, _delay2.default)(opt.options.retry);
        }
      });

      function handleConnectResolver(_x2) {
        return _ref2.apply(this, arguments);
      }

      return handleConnectResolver;
    })())]);
  });

  return function handleConnect(_x) {
    return _ref.apply(this, arguments);
  };
})();

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _delay = require('delay');

var _delay2 = _interopRequireDefault(_delay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

// Recursively flatten an array
function recursiveFlatten(arr, res = []) {
  for (const val of arr) {
    Array.isArray(val) && recursiveFlatten(val, res) || res.push(val);
  }
  return res;
}
exports.default = (() => {
  var _ref3 = _asyncToGenerator(function* (...args) {

    // Promises to resolve
    const promises = [];

    // Set up our default options
    const options = {
      retry: 500, // half a second
      timeout: 30 * 1000, // 30 seconds
      socketTimeout: 1000 };

    // Is the last type an object? Overwrite our defaults with
    // whatever is passed in
    if (!!args[args.length - 1] && args[args.length - 1].constructor === Object) {
      Object.assign(options, args.pop());
    }

    // Whatever remains, we'll treat as our hosts -- we'll treat arrays
    // as collections of strings, so flatten
    for (const hosts of recursiveFlatten(args)) {
      const [host, port] = hosts.split(':');
      promises.push(handleConnect({
        socket: {
          host,
          port
        },
        options
      }));
    }

    // Resolve once all of the promises are ready to go
    return Promise.all(promises);
  });

  function hollaback(_x3) {
    return _ref3.apply(this, arguments);
  }

  return hollaback;
})();