import net from 'net';
import hollaback from '../src/index';
import getPort from 'get-port';
import { assert } from 'chai';

describe('Init', function () {

  this.timeout(0);

  it('should reach google', function () {
    return hollaback('google.com:80');
  });

  it('should allow multiple hosts', function() {
    return hollaback('linkedin.com:80', 'yahoo.com:80');
  });

  it('should timeout on non-reachable host after 500ms', async function() {

    const localPort = await getPort();
    const notReachable = `localhost:${localPort}`;

    const result = hollaback(notReachable, {
      timeout: 500,
    });

    return assert.isRejected(result);
  });

  it('should succeed on new host after 2000ms', async function() {

    const localPort = await getPort();
    const result = hollaback(`localhost:${localPort}`);

    // Create new host after 2 seconds
    setTimeout(function() {
      const server = net.createServer(function() {
        server.end();
      });

      server.listen(localPort);
    }, 2000);

    return assert.isFulfilled(result);

  });
});