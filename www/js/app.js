/*
 #KidoZen Tasks Application
 This application will run either in a Cordova/PhoneGap native application
 or hosted in the KidoZen HTML5 Hosting Service.

 ##Cordova/PhoneGap
 When the application is ran using Cordova or PhoneGap, the user authentication
 is being handled by the "sign in" page, and the KidoZen SDK. This application
 will store the user credentials in `localStorage` as a way to remember the
 user.

 ##Web Application
 When the application is ran using the KidoZen hosting service, the
 authentication is being handled by the KidoZen platform itself, and the browser
 as the agent. If the user can access this file, is because he is already
 authenticated.
 */

//global variables
var view = new View($);
var controller = new Controller(view);

window.isNative = (document.URL.indexOf("http://") == -1);
console.log("running in " + (isNative ? "native" : "hosted") + " mode");

if (window.isNative) {
    // Cordova/PhoneGap.
    // to be able to use passive login you must
    // set 'application' and 'marketplace' options.
    var options = {
        application: 'tasks',
        marketplace: 'tenant.kidocloud.com'
    };
    // once the device ready event is triggered, sign into KidoZen
    // screen
    function deviceready() {
        console.log('device ready');
        controller.signin(options.application, options.marketplace);
    }

    document.addEventListener('deviceready', deviceready, false);
} else {
    // KidoZen hosted web application
    // if it's hosted in KidoZen or is in development mode forget
    // about signing in, and go straight into the list of tasks
    $(document).delegate("#splash", "pageinit", function () {
        console.log("splash init");
        controller.loadHome();
    });
}

//
// Register event handlers
//

// Tasks List Page init
$(document).delegate("#home", "pageinit", function () {
    console.log("home page init");
    controller.loadTasks('pending');
    //register event handler for save button.
    $("#new-task").click(controller.newTask);
    //register event handler for cancel button
    $("#cancel-new-task").click(controller.cancelNewTask);
    //register event handler for filters in the footer toolbar
    $("#pending-tasks").click(function () {
        controller.loadTasks('pending');
    });
    $("#completed-tasks").click(function () {
        controller.loadTasks('completed');
    });
    $("#all-tasks").click(function () {
        controller.loadTasks();
    });
    //register event for tasks list item.
    $(document).delegate("#tasks-list li a", "click", function () {
        var _id = $(this).attr("data-id");
        if (!_id) {
            return;
        } //no task selected
        controller.loadTask(_id);
    });
});

//Task Details Page Init
$(document).delegate("#details", "pageinit", function () {
    console.log('details init');
    // complete a task
    $("#complete-task").click(controller.completeTask);
    // delete a task
    $("#delete-task").click(controller.deleteTask);
    // send a task by email
    $("#send-task").click(function () {
        alert('TODO: try sending this task by email to somebody');
    });
});