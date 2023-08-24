/*Dependencies*/
const http = require('http');
const fileSystem = require('fs');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {
    unifiedServer(req, res);
  });


server.listen(3000, '127.0.0.1', () => {
    console.log('Server running');
    console.log(undefined+ undefined);
});

  const unifiedServer = (req, res) => {
    /*parse url*/
    const parsedUrl = url.parse(req.url, true);
    /*get path*/
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    /*get query string*/
    const queryStringObject = parsedUrl.query;
    /*get method*/  
    const method = req.method.toLowerCase();
    /*get headers*/
    const headers = req.headers;
    /*get payload*/
    const decoder = new stringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
      buffer += decoder.write(data);
    });
    req.on('end', () => { 
      buffer += decoder.end();
      /*choose handler*/
      const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
      /*construct data object*/
      const data = {
        trimmedPath,
        queryStringObject,
        method,
        headers,
        payload: buffer
      };
      /*route request to handler*/
      chosenHandler(data, (statusCode, payload) => {
        /*use status code called back by handler or default to 200*/
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        /*use payload called back by handler or default to empty object*/
        payload = typeof(payload) == 'object' ? payload : {};
        /*convert payload to string*/
        const payloadString = JSON.stringify(payload);
        /*return response*/
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log('Returning this response: ', statusCode, payloadString);
      });
    });
  }

