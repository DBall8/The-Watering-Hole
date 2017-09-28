
document.addEventListener('DOMContentLoaded', function () {
    getTasks();

    var addform = (document.getElementsByName("task"))[0];
    addform.addEventListener("input", function (e) {
        if (this.value == '') {
            document.getElementById("hiddenform").style.display = "none";
        }
        else {
            document.getElementById("hiddenform").style.display = "block";
        }
        
    })
})

var selected = 0;
var numTasks = 0;

document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp" && selected > 0) {
        select(selected - 1);
    }
    if (e.key == "ArrowDown" && selected < numTasks-1) {
        select(selected + 1);
    }
})

function drawTasks(tasklist) {
    var tasks = document.getElementById("tasksdiv");
    var c
    while (c = tasks.firstChild) {
        tasks.removeChild(c);
    }

    tasklist.map(function (item) {
        tasks.appendChild(newTask(item));
    });


    numTasks = tasklist.length;
    select(0);
}

function select(index) {

    var tasks = document.getElementById("tasksdiv");
    var atask;

    atask = tasks.children[selected];
    atask.style.borderColor = 'black';
    atask.querySelector(".notes").style.display = "none";

    selected = index;

    atask = tasks.children[selected];
    atask.style.borderColor = 'blue';
    atask.querySelector(".notes").style.display = "block";
}

function newTask(task){
    var newtask = document.createElement("div");
    newtask.className = "task";
    newtask.addEventListener("mouseenter", function () {
        if (this.style.borderColor != "blue") {
            this.style.borderColor = "red";
        }
    })

    newtask.addEventListener("mouseleave", function () {
        if (this.style.borderColor != "blue") {
            this.style.borderColor = "black";
        }
    })

    newtask.addEventListener("mouseup", function () {
        var index = 0;
        var node = this;
        while (node = node.previousElementSibling) {
            index++;
        }
        select(index);
    })

    var s = ''
    s += '<h2>' + task.title + '</h2><p class="deadline">Deadline:' + task.deadline + '</p><br><pre class="notes">' + task.notes + '</pre>'
    s += '<button type="button">Done</button>'
    newtask.innerHTML = s;
    return newtask;
}

function addTask() {
    var titleinput = document.getElementsByName("task")[0];
    var notesinput = document.getElementsByName("notes")[0];
    var deadlineinput = document.getElementsByName("deadline")[0];
    if (titleinput.value != '' && notesinput.value != '' && deadlineinput.value != '') {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handle_res;
        xhr.open("POST", "/add");

        var task = { title: titleinput.value, notes: notesinput.value, deadline: deadlineinput.value };
        titleinput.value = '';
        notesinput.value = '';
        deadlineinput.value = '';
        notesinput.parentElement.style.display = "none";
        xhr.send(JSON.stringify(task));
    }
}

function getTasks() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handle_res;
    xhr.open("GET", "/tasks");
    xhr.send();
}


// handle response from XMLHttp request
function handle_res() {
    if (this.readyState != 4) {
        return;
    }
    if (this.status == 200) {
        var taskslist = JSON.parse(this.responseText);
        drawTasks(taskslist);

    }
};