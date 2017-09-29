var http = require('http')
    , qs = require('querystring')
    , fs = require('fs')
    , url = require('url')
    , sql = require('sqlite3')
    , port = 8080

var db;

// create the server
var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url)

    // handle url file paths
    switch (uri.pathname) {
        case '/add':
            addTask(req, res);
            break;
        case '/delete':
            deleteTask(req, res);
            break;
        case '/update':
            updateTask(req, res);
            break;
        case '/tasks':
            sendTasks(req, res);
            break;
        case '/login':
            handleLogin(req, res);
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
});

function createDB(username) {

    db = new sql.Database(username + '.db');
    db.run('CREATE TABLE tasks (title varchar(255), notes varchar(800), deadline varchar(255))');
}

function loadDB(username) {
    // open database
    db = new sql.Database(username + '.db', sql.OPEN_READWRITE, function (err) {
        if (err) {
            console.error("Error: could not load database.");
        }
        else {
            console.log("Connected to movies database.")
        }
    });
}


server.listen(process.env.PORT || port)
console.log('listening on 8080')

function handleLogin(req, res) {
    var data = '';
    req.on('data', function (d) {
        data += d;
    });

    req.on('end', function () {
        var post = qs.parse(data);

        if (post.username == 'Damon') {
            loadDB('tasks');
        }
        else if (post.newuser == 1) {
            createDB(post.username);
        }
        else {
            loadDB(post.username);
        }


        sendFile(res, 'main.html', 'text/html');
    });
    
}

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

function deleteTask(req, res) {
    var data = '';
    req.on('data', function (d) {
        data += d;
    });

    req.on('end', function () {
        db.run('DELETE FROM tasks WHERE title=(?)', data);
        sendTasks(req, res);
    });
}

function updateTask(req, res) {
    var data = '';
    req.on('data', function (d) {
        data += d;
    });

    req.on('end', function () {
        var post = qs.parse(data);
        if (post.title && post.newnotes) {
            db.run("UPDATE tasks SET notes=(?) WHERE title=(?)", post.newnotes, post.title);
            sendTasks(req, res);
        } 
    });
}

function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html'

    fs.readFile(filename, function (error, content) {
        res.writeHead(200, { 'Content-type': contentType })
        res.end(content, 'utf-8')
    })

}