const http = require('http');

// Create a proxy server that forwards requests to our actual server
const proxyServer = http.createServer((req, res) => {
  // Options for the proxy request
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  // Forward the request to our actual server
  const proxyReq = http.request(options, (proxyRes) => {
    // Set the status code and headers
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    // Pipe the response data
    proxyRes.pipe(res);
  });

  // Handle errors
  proxyReq.on('error', (err) => {
    console.error('Proxy request error:', err);
    res.writeHead(500);
    res.end('Proxy Error: Unable to forward request to server');
  });

  // Pipe the original request data to the proxy request
  req.pipe(proxyReq);
});

// Listen on port 5000
proxyServer.listen(5000, () => {
  console.log('Proxy server listening on port 5000, forwarding to port 8080');
});