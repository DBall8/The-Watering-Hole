Assignment 6 - Events
===

You are now skilled in the art of sending data from client to server and vice-versa.

Now, to really move into Web 2.0 land, your web-pages should become more interactive, responding to user input and other events in various ways.

Luckily modern browsers implement a huge number of Events you can leverage while designing your site.

In this assignment, you will experiment with a number of events and techniques for manipulating HTML on the client side.

Assignment details
---

Do the following to complete this assignment:

1. Clone the [starting project code](https://github.com/cs4241-16b/A6-Events). **DO NOT FORK THE REPO and DO NOT MAKE IT PUBLIC.** This is not an extension of previous projects, though you are free to re-use code. 
2. One goal of this project is to experiment with Events: 
    * Add listeners for five different types of events.
    * Don't choose randomly from the MDN events list. Choose something cohesive.
    * To show your work, add a bulleted list to your README explaining what event you used and how. A simple example:
        * "`click`: Used on the Tweet divs, the `click` event un-hides a menu div"
    * One of the events **must** be set with `onclick` rather than `addEventListener`. Think about why you might want to use one over the other, since `addEventListener` can essentially do the same as `onclick` if you specify tell it to use the `click` event. Documentation for `onclick` is [here on MDN](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onclick)
3. A second goal of this project is to become familiar with several methods of manipulating the DOM:
    * One of your events should hide an element, using the `display` CSS property.
    * One of your events should reveal a hidden element.
    * At least one of the events should modify the DOM using `innerText`
    * At least one of the events should modify the DOM using `innerHTML` -- learn the difference between this and `innerText`.
3. Deploy your project to Heroku.
    * Ensure that your project has the proper naming scheme (`cs4241-a6-yourGitHubUsername`) so we can find it.
4. The project will be graded against the following rubric (120 total):
    * 100: Fulfilling the requirements above
    * 10: Good theming and layout
    * 10: Technical Achievement: Have fun here! Check out advanced resources for some ideas. Don't forget to include an explanation of your achievement on your page.
5. Include a README.md describing your technical achievement to recieve credit. 
    * Your README.md should be served when an attempt to access `<your-url>/README.md` is made.
    * Pay attention to capitalization of your filename -- it matters on git/heroku. Be sure to test that the readme is accessible from heroku.
