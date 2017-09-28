var http = require('http')
    , qs = require('querystring')
    , fs = require('fs')
    , url = require('url')
    , sql = require('sqlite3')
    , port = 8081


// open database
var db = new sql.Database('tasks.db', sql.OPEN_READWRITE, function (err) {
    if (err) {
        console.error("Error: could not create database.");
    }
    else {
        console.log("Connected to movies database.")
    }
});

// create the server
var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url)

    // handle url file paths
    switch (uri.pathname) {
        case '/add':
            addTask(req, res);
        case '/tasks':
            sendTasks(req, res);
            break;
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

function sendTasks(req, res) {
    var result = [];

    res.writeHead(200, { 'Content-type': 'application/json' });

    db.each("SELECT title, notes, deadline FROM tasks", function (err, row) {
        result.push(row);
    }, function () {
        res.end(JSON.stringify(result));
    });

}

function addTask(req, res) {
    var data = '';
    req.on('data', function (d) {
        data += d;
    });

    req.on('end', function () {
        var newtask = JSON.parse(data);
        db.run('INSERT INTO tasks VALUES ("' + newtask.title + '", "' + newtask.notes + '", "' + newtask.deadline + '")');
        sendTasks(req, res);
    });
}

function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html'

    fs.readFile(filename, function (error, content) {
        res.writeHead(200, { 'Content-type': contentType })
        res.end(content, 'utf-8')
    })

}