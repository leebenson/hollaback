# Hollaback

#### Resolves a Promise when host(s)/port(s) are ready

If your app needs to wait for database connections, microservices or other stuff being available first, holla' has your back.

You can use it like this (assuming async/await in Node.js):

```
# ... inside an async function
await hollaback(
  'web-host:80',
  'arangodb-host:8529'
);

// Do other stuff after web and ArangoDB are ready
```

I wrote this because I use Docker Compose a lot.

Just though Docker _thinks_ a service is ready, doesn't mean it is. That means dependencies can break.

I wanted a simple way to await a promise before moving on.

Hollaback is it.

## Usage

Without hipster ES6/7 stuff:

```
const hollaback = require('hollaback');

hollaback('host1:port', 'host2:port').then(function () {
  // Our host names are available
});
```

For cool kids:

```
import hollaback from 'hollaback'

const hosts = [
  'host1:port',
  'host2:port'
];

(async function whenReady(){
  await hollaback(...hosts);
  // Our services are ready - go nuts...

}());

```

Pass either a list of `host:port` strings or an array of them, and hollaback will try all of them before resolving the promise.

## Options

Under the hood, it uses [Socket](https://nodejs.org/api/net.html#net_class_net_socket) to probe a host/port.

By default, retries occur every *500ms* until the port is available, and hollaback rejects after *30 seconds*.

You can override the defaults by passing an options object as the last param:

```
hollaback(hosts, {
    retry: 500, // per connection retry (in ms)
    timeout: 30 * 1000, // global timeout (rejects after this time, in ms)
    socketTimeout: 1000, // per connection timeout (in ms)
})
```

## Compatibility

Designed for Node 0.12.15 and above.

It won't work in a browser.

## Testing

Run `npm run test`

## Fair warning

Checking that a host/port accepts a connection isn't fool-proof.

Maybe the port accepts connections, but hasn't finished instantiating. Connections != ready to rock.

This does nothing more than attempt the initial connection. It doesn't 'speak' any underlying protocol other than raw TCP/IP, so it won't be able to tell, say, whether you're able to invoke SQL against a database.

With that said, it should be good enough for 95% of scenarios where you just want to test if there's something listening on the other end.

It's especially useful for stack orchestration using tools like Docker Compose, where services need to start in order and usually report (prematurely) that they're ready for linked services to spawn.

## License

[MIT](https://github.com/leebenson/hollaback/blob/master/LICENSE)
