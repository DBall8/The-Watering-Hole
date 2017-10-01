// Globals
var selected = -1; // index of the task that is selected (-1 when none)
var loadselected = -1; // index of the task that should be selected after an XMLHttp request
var numTasks = 0; // number of tasks loaded

const HOVERCOLOR = "cyan"; // color of border when mouse over a task
const SELECTCOLOR = "blue"; // color of border when a task is selected

// On load event
document.addEventListener('DOMContentLoaded', function () {
    getTasks(); // get the user's tasks from the server

    // Create event for the add form
    var addform = (document.getElementsByName("task"))[0];
    // this event will show the entire form only when something is typed into the Task title input field
    addform.addEventListener("input", function (e) {
        if (this.value == '') {
            // hide form if it becomes empty again
            document.getElementById("hiddenform").style.display = "none";
        }
        else {
            // show form when not empty
            document.getElementById("hiddenform").style.display = "block";
        }
        
    })

    // change the url to just the domain so as to ensure you copy pasting or
    // hitting back will always get you to the same palce
    history.replaceState(null, "To Do", "/");
})

// create Key down event
document.addEventListener("keydown", function (e) {
    // on arrow up, change the selected task to a higher one
    if (e.key == "ArrowUp" && selected > 0) {
        select(selected - 1);
    }
    // on arrow down, change the selected task to a lower one
    if (e.key == "ArrowDown" && selected < numTasks-1) {
        select(selected + 1);
    }
})

/* draws the entire list of tasks
* @param tasklist JSON of all the tasks to draw
*/
function drawTasks(tasklist) {
    // get the tasks div
    var tasks = document.getElementById("tasksdiv");
    // remove all loaded tasks
    var c;
    while (c = tasks.firstChild) {
        tasks.removeChild(c);
    }

    // fill the div with new tasks
    for (var i = 0; i < tasklist.length; i++ ){
        tasks.appendChild(newTask(tasklist[i]));
    }

    // store the number of tasks loaded
    numTasks = tasklist.length;
    // select the task previously set to be selected after a new load
    select(loadselected);
}

// creates a new task div to display a task
function newTask(task) {

    // create the div containing all parts of the task
    var newtask = document.createElement("div");
    newtask.className = "task";
    // add a mouseneter event which highlights the task when the mouse moves over the div
    newtask.addEventListener("mouseenter", function () {
        // doesnt do anything if the task is already selected
        if (this.style.borderColor != SELECTCOLOR) {
            this.style.borderColor = HOVERCOLOR;
        }
    })
    // add a mouseleave event which removes the highlight when mouse stops mousing over the div
    newtask.addEventListener("mouseleave", function () {
        // doesnt do anything if the task is already selected
        if (this.style.borderColor != SELECTCOLOR) {
            this.style.borderColor = "black";
        }
    })

    // create an onclick event to select the task when clicked
    newtask.onclick = function () {
        select(findIndex(newtask));
    }

    // create the hidden div that holds the needed elements for editng the task
    var hiddendiv = document.createElement("div");
    hiddendiv.className = "hiddendiv";

    // this is the text area for inline editing of the task notes
    var area = document.createElement("textarea");
    area.rows = 10;
    area.cols = 50;
    area.className = "editnotes";
    // throw in a quick event to stop propogation so you can use arrow keys in the text area without changing the selected task
    area.addEventListener("keydown", function (e) { e.stopPropagation() });
    hiddendiv.appendChild(area);

    // quick line break
    hiddendiv.appendChild(document.createElement("br"));

    // save button for saving
    var save = document.createElement("button");
    save.className = "savebutton";
    // when the save button is clicked, update the server and stop the propogation to the task div
    save.addEventListener("click", function (e) {
        updateTask(save);
        e.stopPropagation();
    })
    save.textContent = "Save";
    hiddendiv.appendChild(save);

    // create the "Completed"  button to delete a task
    var button = document.createElement("button");
    button.className = "deletebutton";
    button.textContent = "Completed";
    button.addEventListener("click", function (e) {
        deleteTask(button);
        e.stopPropagation();
    }, false);

    // first, create the title and dealine to be displayed on the task
    newtask.innerHTML = '<h2>' + task.title + '</h2><p class="deadline">Deadline: ' + task.deadline + '</p>'
    // add Completed button
    newtask.appendChild(button);

    // add a hidden 'pre' element with the task notes that only show when the task is selected
    var pre = document.createElement("pre");
    pre.className = "notes";
    pre.textContent = task.notes;
    // give it a doubleclick event that hides the pre element and shows the hidden notes editor div instead
    pre.addEventListener("dblclick", function (e) {
        this.style = "none";
        showEditor(hiddendiv);
        e.stopPropagation();
    })
    // add this pre element
    newtask.appendChild(pre);

    // finally, add the hidden edit div (created earlier to be used in the pre dblclick event)
    newtask.appendChild(hiddendiv);

    return newtask;
}

// Selects the task at the given index
function select(index) {
    // does nothing if the task is already selected
    if (selected != -1 && selected == index) {
        return;
    }

    // get tasks div
    var tasks = document.getElementById("tasksdiv");
    var atask;

    // deselcts old task
    if (selected >= 0) {
        atask = tasks.children[selected];
        atask.style.borderColor = 'black';
        atask.querySelector(".notes").style.display = "none";
        hideEditor(atask);
    }
    
    // updates selected index
    selected = index;

    // selects new task
    if (index >= 0) {
        atask = tasks.children[selected];
        atask.style.borderColor = SELECTCOLOR;
        atask.querySelector(".notes").style.display = "block";
    }
}



// finds the given task's index in the list of tasks
function findIndex(task) {
    var index = 0;
    var node = task;
    // keep crawling back through siblings incrementing the count until out of siblings
    while (node = node.previousElementSibling) {
        index++;
    }

    return index;
}

// shows the inline notes editor
// @param el the editing div to be shown
function showEditor(el) {
    // show the element containing the editing field
    el.style.display = "block";
    // set its text to be the notes
    var text = el.parentElement.children[3].textContent;
    el.firstChild.value = text;
}

// hides the inline note editor
// @param el the element to hide
function hideEditor(el) {
    el.lastChild.style.display = "none";
}

// get all tasks from the server
function getTasks() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handle_res;
    xhr.open("GET", "/get");
    xhr.send();
}

// Adds a task to the server's database
function addTask() {
    // gets the title, notes, and deadline fields
    var titleinput = document.getElementsByName("task")[0];
    var notesinput = document.getElementsByName("notes")[0];
    var deadlineinput = document.getElementsByName("deadline")[0];

    // ensures none are empty
    if (titleinput.value != '' && notesinput.value != '' && deadlineinput.value != '') {

        // create request
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handle_res;
        xhr.open("POST", "/add");

        // reset selected counter so it does not try to deselect anything upon loading new tasks
        selected = -1;

        // create object
        var task = { title: titleinput.value, notes: insertNewlines(notesinput.value), deadline: deadlineinput.value };
        // empty out the fields
        titleinput.value = '';
        notesinput.value = '';
        deadlineinput.value = '';
        // hide form
        notesinput.parentElement.style.display = "none";
        // send request
        xhr.send(JSON.stringify(task));
    }
    else {
        alert("Please fill in all fields.");
    }
}

// delete a task from the server's database
// @param b button pressed to send this delete
function deleteTask(b) {
    // get title from the button's div
    var title = b.parentElement.firstChild.textContent;
    // only delete if not empty
    if (title != '') {
        selected = -1;
        // send request
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handle_res;
        xhr.open("POST", "/delete");
        xhr.send(title);  
    }
}

// updates a task's notes section
// @param button button pressed to send this update
function updateTask(button) {
    // get the task containing the button
    var task = button.parentElement.parentElement;
    // get the title to update and the notes to change to
    var title = task.firstChild.textContent;
    var newnotes = task.querySelector("textarea").value;
    // create newlines where needed to prevent overflow
    newnotes = insertNewlines(newnotes);

    // create request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handle_res;
    xhr.open("POST", "/update");

    // set it so that the same task is selected after the redraw
    selected = -1;
    loadselected = findIndex(task);

    // send request
    xhr.send("title=" + title + "&newnotes=" + newnotes);
}

// inserts newlines every 70 characters
function insertNewlines(str) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charAt(i) == '\n') { // if newline found, reset count
            count = 0;
        }
        else {
            count++;
        }
        if (count > 70) { // once count reached, insert the newline
            str = str.substr(0, i) + '\n' + str.substr(i);
            count = 0;
        }
    }

    return str
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

// logs the user out
function logout() {
    // destroys cookie
    document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    // refreshes page, but since there is no longer a cookie it will lead to the login screen
    window.location.href = "/";
}