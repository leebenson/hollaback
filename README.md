# Hollaback

## Note: WIP. Check back in a few days!

#### Resolves a Promise when a host/port is ready

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

I wanted a simple wait to await a promise before moving on.

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

By default, retries occur every *500ms* until the port is available, and times out after *60 seconds*.

You can override the defaults with:

```
hollaback(..., {
  retry: 250, // retry every, in ms
  timeout: 30 * 1000 // timeout and throw, in ms
})
```


## License

[MIT](https://github.com/leebenson/hollaback/blob/master/LICENSE)