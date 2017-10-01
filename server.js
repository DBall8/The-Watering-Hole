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
        case '/add': // for adding a task
            addTask(req, res);
            break;
        case '/delete': // for deleting a task
            deleteTask(req, res);
            break;
        case '/update': // for updating a task
            updateTask(req, res);
            break;
        case '/get': // gets all tasks
            sendTasks(req, res);
            break;
        case '/login': // for logging a user in
            // get the username from the GET query
            var q = qs.parse(uri.query) 
            handleLogin(res, q.username);
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

server.listen(process.env.PORT || port)
console.log('listening on 8080')


// initializes a new database for a new user
function createDB(username) {

    db = new sql.Database(username + '.db');
    db.run('CREATE TABLE tasks (title varchar(255), notes varchar(800), deadline varchar(255))');
}

// loads the user base for the given user. If none exists than create a new one.
function loadDB(username) {
    // open database
    db = new sql.Database(username + '.db', sql.OPEN_READWRITE, function (err) {
        if (err) {
            createDB(username);
        }
        else {
            console.log("Connected to database for User: " + username)
        }
    });
}

// on login, loads the user's tasks database and sends the main.html page
function handleLogin(res, username) {
    if (username != '') {
        loadDB(username);
        sendFile(res, 'main.html', 'text/html');
    }
}

// sends all tasks as a JSON
function sendTasks(req, res) {
    var result = [];

    res.writeHead(200, { 'Content-type': 'application/json' });

    db.each("SELECT title, notes, deadline FROM tasks", function (err, row) {
        result.push(row);
    }, function () {
        res.end(JSON.stringify(result));
    });

}

// adds a task to the database
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

// deletes a task from the database
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

// updates the notes section of a task in the database
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

// sends a page
function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html'

    fs.readFile(filename, function (error, content) {
        res.writeHead(200, { 'Content-type': contentType })
        res.end(content, 'utf-8')
    })

}