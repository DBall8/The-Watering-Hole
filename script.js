var selected = -1;
var loadselected = -1;
var numTasks = 0;

const HOVERCOLOR = "cyan";
const SELECTCOLOR = "blue";


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

    for (var i = 0; i < tasklist.length; i++ ){
        tasks.appendChild(newTask(tasklist[i]));
    }


    numTasks = tasklist.length;
    select(loadselected);
}

function select(index) {
    if (selected != -1 && selected == index) {
        return;
    }

    
    var tasks = document.getElementById("tasksdiv");
    var atask;

    if (selected >= 0) {
        atask = tasks.children[selected];
        atask.style.borderColor = 'black';
        atask.querySelector(".notes").style.display = "none";
        hideEditor(atask);
    }
    

    selected = index;

    if (index >= 0) {
        
        atask = tasks.children[selected];
        atask.style.borderColor = SELECTCOLOR;
        atask.querySelector(".notes").style.display = "block";
    }
}

function newTask(task){
    var newtask = document.createElement("div");
    newtask.className = "task";
    newtask.addEventListener("mouseenter", function () {
        if (this.style.borderColor != SELECTCOLOR) {
            this.style.borderColor = HOVERCOLOR;
        }
    })

    newtask.addEventListener("mouseleave", function () {
        if (this.style.borderColor != SELECTCOLOR) {
            this.style.borderColor = "black";
        }
    })

    newtask.onclick = function () {
        select(findIndex(newtask));
    }

    var hiddendiv = document.createElement("div");
    hiddendiv.className = "hiddendiv";

    var area = document.createElement("textarea");
    area.rows = 10;
    area.cols = 50;
    area.className = "editnotes";
    area.addEventListener("keydown", function (e) { e.stopPropagation() });
    hiddendiv.appendChild(area);

    hiddendiv.appendChild(document.createElement("br"));

    var save = document.createElement("button");
    save.className = "savebutton";
    save.onclick = function (e) {
        updateTask(save);
        e.stopPropagation();
    }
    save.textContent = "Save";
    hiddendiv.appendChild(save);

    
    var button = document.createElement("button");
    button.className = "deletebutton";
    button.textContent = "Completed";
    button.addEventListener("click", function (e) {
        deleteTask(button);
        e.stopPropagation();
    }, false);
    

    newtask.innerHTML = '<h2>' + task.title + '</h2><p class="deadline">Deadline: ' + task.deadline + '</p>'
    newtask.appendChild(button);

    var pre = document.createElement("pre");
    pre.className = "notes";
    pre.textContent = task.notes;
    pre.addEventListener("dblclick", function (e) {
        this.style = "none";
        showEditor(hiddendiv);
        e.stopPropagation();
    })
    newtask.appendChild(pre);

    newtask.appendChild(hiddendiv);
    
    return newtask;
}

function findIndex(task) {
    var index = 0;
    var node = task;
    while (node = node.previousElementSibling) {
        index++;
    }

    return index;
}

function showEditor(el) {

    el.style.display = "block";
    var text = el.parentElement.children[3].textContent;
    el.firstChild.value = text;
 
}

function hideEditor(el) {
    el.lastChild.style.display = "none";
}

function addTask() {
    var titleinput = document.getElementsByName("task")[0];
    var notesinput = document.getElementsByName("notes")[0];
    var deadlineinput = document.getElementsByName("deadline")[0];
    if (titleinput.value != '' && notesinput.value != '' && deadlineinput.value != '') {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handle_res;
        xhr.open("POST", "/add");

        selected = -1;

        var task = { title: titleinput.value, notes: notesinput.value, deadline: deadlineinput.value };
        titleinput.value = '';
        notesinput.value = '';
        deadlineinput.value = '';
        notesinput.parentElement.style.display = "none";
        xhr.send(JSON.stringify(task));
    }
}

function deleteTask(b) {
    var title = b.parentElement.firstChild.textContent;
    if (title != '') {
        selected = -1;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handle_res;
        xhr.open("POST", "/delete");
        xhr.send(title);  
    }
}

function updateTask(button) {
    var task = button.parentElement.parentElement;
    var title = task.firstChild.textContent;
    var newnotes = task.querySelector("textarea").value;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handle_res;
    xhr.open("POST", "/update");

    selected = -1;
    loadselected = findIndex(task);
    console.log(loadselected);

    xhr.send("title=" + title + "&newnotes=" + newnotes);
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