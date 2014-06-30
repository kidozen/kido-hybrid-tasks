/****************************
*
* Controllers
*
* controller methods handle the interaction between the view and the models.
* it will execute the necessary model methods and then call the appropiate view
* to display the response.
*
*****************************/

var Controller = function (view, model) {
    var self = this;
    if (!view) view = View($);
    if (!model) model = new Model();

    this.loadSignin = function () {
        if (window.localStorage) {
            console.log("checking browser's localStorage");
            // If the user authenticated once, then the credentials are being
            // cached in `localStorage`
            var get = localStorage.getItem.bind(localStorage);
            options.username    = get("username")    || options.username;
            options.password    = get("password")    || options.password;
            options.application = get("application") || options.application;
            options.marketplace = get("marketplace") || options.marketplace;
        }
        // populate Sign In Page with cached values
        view.login.load(options);
        if (options.username &&
            options.password &&
            options.application &&
            options.marketplace) {
            // No need to present the login screen, we have the credentials
            // let's authenticate the user automatically.
            controller.signin(true);
        } else {
//            view.login.show();
            controller.signin(false);
        }
    };

    this.signin = function (has_credentials) {
        console.log('signing in');

        //TODO: validate input
        var username = view.login.username();
        var password = view.login.password();
        var application = view.login.application();
        var marketplace = view.login.marketplace();

        if (has_credentials) {
            model.authenticate(username, password, application, marketplace)
                .done(function () {
                    self.loadHome();
                    //authentication settings are valid, so store them
                    if (window.localStorage) {
                        localStorage.setItem("username", username);
                        localStorage.setItem("password", password);
                        localStorage.setItem("application", application);
                        localStorage.setItem("marketplace", marketplace);
                    }
                })
                .fail(function (err) {
                    view.alert('An error occurred while authenticating the user: ' + JSON.stringify(err));
                });
        } else {
            model.passiveAuth(application, marketplace)
                .done(function () {
                    self.loadHome();
                })
                .fail(function (err) {
                    view.alert('An error occurred while authenticating the user: ' + JSON.stringify(err));
                });
        }

    };

    this.signout = function () {
        console.log('signing out');
        model.signout();
        view.login.show();
    };

    this.loadHome = function () {
        view.tasks.show();
    };

    this.loadTasks = function (filter) {

        var query = {};

        if ( filter )
            query.completed = filter === "pending" ? false : true;

        view.tasks.showLoadingView(filter);

        model.queryTasks(query)
            .done(function ( tasks ) {
                //1. if tasks is empty, display message.
                if ( !tasks || !tasks.length )
                    view.tasks.showEmptyView();
                else
                    //2. if tasks is not empty, display one <li> per task.
                    view.tasks.showListView(tasks);
            })
            .fail(view.alert);
    };

    this.newTask = function () {
        var title = view.newTask.title();
        var desc  = view.newTask.description();
        model.insertTask( title, desc )
            .done( function ( ) {
                //task saved. clean the form and load the pending tasks.
                view.newTask.clear();
                self.loadTasks('pending');
            })
            .fail( function ( err ) {
                view.alert("there's been a problem inserting the task." );
                console.log( err );
            });
    };

    this.cancelNewTask = function () {
        view.newTask.clear();
    };

    this.loadTask = function (_id) {
        view.task.showLoadingView();

        model
            .getTask(_id)
            .done(view.task.showDetails)
            .fail(function() {
                alert("There's been an problem loading the task");
            });
    };

    this.completeTask = function () {
        var _id = view.task.id();
        model.completeTask(_id)
            .done(function () {
                self.loadTasks('pending');
            })
            .fail(function ( err ) {
                view.alert('unable to complete task');
                console.log(err);
            });
    };

    this.deleteTask = function () {
        var _id = view.task.id();
        model.deleteTask(_id)
            .done(function () {
                self.loadTasks('pending');
            })
            .fail(function ( err ) {
                view.alert('unable to delete task');
                console.log(err);
            });
    };
};