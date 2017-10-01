Damon Ball  
http://a6-dball8.herokuapp.com/


**IMPORTANT NOTE FOR GRADERS**
I have included a sample account of a filled in page of tasks. Simply use the login "tasks" on the
login screen to go to this page.

This project shows the ability to use event listeners to create an interactive web page.

The page is a task list for users to store tasks that they have to complete. Each task has a title and
a due date listed. When a task is selected, it also displays a notes section that can be used for
storing the steps needed to complete a task or general notes that could be useful for its completion.
There is also a "Completed" button to click when the task is finished, which simply deletes the task.
The notes can be edited inline by double clicking them, and a new task can be added by typing in
the field at the bottom of the page.

The included events are as follow:
	- keydown: pressing the up arrow or down arrow scrolls through the tasks
	- mouseenter: when a mouse enters a task div, it highlights the div
	- mouseleave: when a mouse leaves a task div, it removes the highlight from the div
	- onclick: when a task div is clicked, it selects that task div (implemented with onclick)
		- click: a few buttons (like the save button and the completed button) use click event listeners
	- dblclick: when a task's notes are double clicked, it switches to a text area input
		field for inline editing of the note
	- DOMContentLoaded: when the document is finished loading, it asks the server for all the tasks
		and displays the tasks

The dblclick event uses textContent to set the value of the text area field to be the notes of the task
when it is displayed.
When the document loads and creates all the tasks, it uses innerHTML as a easier way to create the
elements to be displayed.

## Technical Achievements
- **Used cookies to store user sessions**: When first coming to the page, a login screen is encountered
instead of a list of tasks. When the user gives a login, it creates a database of tasks for that username
and stores a cookie with the username. While the cookie is present, any time the user visits the page or
reloads the page it will immediately take them to their tasks instead of the login screen. To wipe the
cookie the user must click logout, which brings them back to the login screen.
NOTE: There is no password so anybody can edit anybody else's task list.

### Design Achievements
- **Used complementary colors**: The choice of a orange background and blue task items was to use 
complementary colors and make the page looking appealing.
- **The add form hides when not in use**: So as to save space on the screen and not confuse the user,
the add a new task form only appears when the user starts to create the new task (types in the new task
field).
- **Tasks highlight when moused over**: To make it more apparent that the tasks can be clicked on, the
tasks will highlight when the mouse moves over them indication that there is an interaction.
