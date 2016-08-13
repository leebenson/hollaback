const hollaback = require('hollaback');
const results = await hollaback('google.com:80', 'yahoo.com:80', 'linkedin.com:80', {
  timeout: 10 * 1000 // 10 seconds
});

// Print out the results to the screen
for (const result of results) {
  console.log(result);
}
