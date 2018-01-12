Damon Ball
https://a7-dball8.herokuapp.com/

This projects show an implementation of an anonymous online web chat application. 
The application consists of Discussion Threads, which are pages containing posts from users.
Each discussion thread has a title and text content to get the discussions started. Then any 
user can reply or add to the discussion with posts on the thread's page.
When each user logs on they are given a unique ID. The user can than post in any discussion
thread or create a discussion thread themselves. Each user can edit and delete any post or
thread that they made, but none of the posts or threads of anybody else.

To Post a Thread:
- Click the Start Discussion button
- Enter a title in the first field
- Enter the content of the discussion starter in the second field

To Edit or Delete a Thread:
- Click on the Thread to open it
- When in the thread, if you are the creator of the thread a small blue edit button wil appear
at the bottom, click on it.
- Edit the contents in the field that appears
- Click save to save the changes, cancel to stop editing and discard changes, or delete to 
delete the thread

To Make a Post:
- Click on the thread you want to post in
- When in the thread, scroll to the bottom and find the field by the Post button
- type in the post field and click the post button or press enter

To Update or Delete a Post:
- Navigate to the Post
- If you were the person who made the post (and have not been given another ID)
then there will be a small blue edit button to the right of the post
- Click the edit button and make the changes to the post
- Either click save to save the changes, cancel to stop editing and discard changes,
or delete to delete the post

Seperation between model and view.
- The App.js file contains all functions for adding, deleting, and updating the database.
- The App.js then displays a few possible views.
	- ThreadQueue which holds ThreadHeads and a form for adding a Thread
	- ThreadHeads which are clickable links to a Thread
	- Thread which holds the discussion and all the Posts in it as well as a form for new posts
	- Post which dislays a message from a user in a discussion

## Technical Achievements
- **Gave each user a unique Animal ID**: Instead of just assigning users a numerical ID, each
user is given the name of animal to user as a username for the duration of their session. This
is done using a database of approximately 400 animal names. When a user logs on, the app asks
the database for a random id. If the ID is not taken, it marks the ID as taken in the database
and uses it. If it is taken, it keeps looking at the next ID until it finds one that is not taken.
If all ID's are taken, the database is refreshed and all ID's become available again, so duplicates
could happen after a large number of user sessions. However, as well as the animal name, the ID
also consists of the timestamp that they first logged in. Therefore, even though a duplicate name
may evently occur, the two users with the same name will still be considered different users 
because they were created at different times. Also, if two users log in at the same exact time,
the animal name assigned will still be different. This assures no user will ever be able to edit
or delete another user's post, and even when duplicate names exist only the user's posts will be
marked with '(ME).'
- **Used cookies to save user ids**: When a user logs on and obtains an ID, a cookie is stored 
with that ID. If the user leaves the site and returns when their browser is still open, they will
use the same ID they had previously instead of asking for a new one.

### Design Achievements
- **Broke Posts up into Discussion Threads**: Instead of having all users post in a giant
discussion, I broke up posts into Disucssion threads so that each group of posts can be
(encouraged to be) on the same topic. This allows users to look through different discussion
to see which ones they would like to add to.
- **OP and ME labels**: Any time a user makes a post, that post is label with a '(ME)' until
the user logs out, showing that they made the post. Also, any time the creator of a thread
posts in their own thread, they are labeled with (OP) showing that they were Orignal Poster
of the thread.
- **Users can press Enter so submit posts**: To align with most other sites and therefore be
familiar to users, users can press the enter button when writing a post to send that post.
-**Edit button changes cursor and underlines**: To signify that the word "edit" is clickable
they become underlined and change the cursor to the pointed finger cursor.
