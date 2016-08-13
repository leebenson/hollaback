import net from 'net';
import delay from 'delay';

// Recursively flatten an array
function recursiveFlatten(arr, res=[]) {
  for (const val of arr) {
    (Array.isArray(val) && recursiveFlatten(val, res)) || res.push(val);
  }

  return res;
}

// Func to attempt the connection
async function handleConnect(opt) {
  return Promise.race([

    // global timeout
    new Promise(function timeout(_, reject) {
      setTimeout(function didTimeout() {
        reject(new Error(`Timed out after ${opt.options.timeout}ms`));
      }, opt.options.timeout);
    }),

    // connection handler
    new Promise(async function handleConnectResolver(resolve) {

      // Loop forever --  our race condition will GC this
      while (true) {

        const client = net.connect(opt.socket, function hasConnected() {
          client.end();
          resolve(`${opt.socket.host}:${opt.socket.port} connected`);
        });

        // Set socket timeout
        client.setTimeout(opt.options.socketTimeout);

        // Error handler - catch and ignore
        client.on('error', function () {});

        // Retry after a delay...
        await delay(opt.options.retry);
      }
    }),
  ]);
}

module.exports = async function hollaback(...args) {

  // Promises to resolve
  const promises = [];

  // Set up our default options
  const options = {
    retry: 500, // half a second
    timeout: 30 * 1000, // 30 seconds
    socketTimeout: 1000, // 1 second
  };

  // Is the last type an object? Overwrite our defaults with
  // whatever is passed in
  if (!!args[args.length - 1] && args[args.length - 1].constructor === Object) {
    Object.assign(options, args.pop());
  }

  // Whatever remains, we'll treat as our hosts -- we'll treat arrays
  // as collections of strings, so flatten
  for (const hosts of recursiveFlatten(args)) {
    const [host, port] = hosts.split(':');
    promises.push(
      handleConnect({
        socket: {
          host,
          port,
        },
        options,
      }),
    );
  }

  // Resolve once all of the promises are ready to go
  return Promise.all(promises);
};
