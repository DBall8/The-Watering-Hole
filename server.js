var http = require('http')
  , qs   = require('querystring')
  , fs   = require('fs')
  , url = require('url')
  , port = 8080


// create the server
var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url)


  // handle url file paths
  switch (uri.pathname) {
 
    case '/':
          sendFile(res, 'index.html', 'text/html')
          break
    case '/index.html':
        sendFile(res, 'index.html', 'text/html')
        break
    case '/style.css': // stylehseet
        sendFile(res, 'style.css', 'text/css')
        break
    case '/script.js': // scripts
        sendFile(res, 'script.js', 'text/javascript')
        break
    default:
      res.end(uri.pathname + ' 404 not found')
  }

})

server.listen(process.env.PORT || port)
console.log('listening on 8080')


function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html'

    fs.readFile(filename, function (error, content) {
        res.writeHead(200, { 'Content-type': contentType })
        res.end(content, 'utf-8')
    })

}