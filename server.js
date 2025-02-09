// Importing the express library we've installed; This library allows us to create a simple web server.
let express = require('express');

// Create the web server.
let app = express();

// Tell the web server to use the "public" folder for serving static files (html, css, javascript, media.)
app.use(express.static('public'));

// Create a test endpoint; This is not required, but it allows us to verify whether the server is working.
app.get('/test', function (req, res) {
  res.send('Hello World!')
});

// And finally start the server. We start the server on port 80, which is the default port for http.
// If you want to learn more about ports, read this: https://www.cloudflare.com/learning/network-layer/what-is-a-computer-port/
app.listen(80, function () {
  console.log('Example app listening on port 80!')
});