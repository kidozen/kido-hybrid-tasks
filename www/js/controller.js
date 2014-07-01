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

    this.signin = function (application, marketplace) {
        console.log('signing in');
        // call the KidoZen passive login strategy
        model.authenticate(application, marketplace)
            .done(function () {
                self.loadHome();
            })
            .fail(function (err) {
                view.alert('An error occurred while authenticating the user: ' + JSON.stringify(err));
            });
    };

    this.loadHome = function () {
        view.tasks.show();
    };

    this.loadTasks = function (filter) {

        var query = {};

        if (filter)
            query.completed = filter !== "pending";

        view.tasks.showLoadingView(filter);

        model.queryTasks(query)
            .done(function (tasks) {
                //1. if tasks is empty, display message.
                if (!tasks || !tasks.length)
                    view.tasks.showEmptyView();
                else
                //2. if tasks is not empty, display one <li> per task.
                    view.tasks.showListView(tasks);
            })
            .fail(view.alert);
    };

    this.newTask = function () {
        var title = view.newTask.title();
        var desc = view.newTask.description();
        model.insertTask(title, desc)
            .done(function () {
                //task saved. clean the form and load the pending tasks.
                view.newTask.clear();
                self.loadTasks('pending');
            })
            .fail(function (err) {
                view.alert("there's been a problem inserting the task.");
                console.log(err);
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
            .fail(function () {
                alert("There's been an problem loading the task");
            });
    };

    this.completeTask = function () {
        var _id = view.task.id();
        model.completeTask(_id)
            .done(function () {
                self.loadTasks('pending');
            })
            .fail(function (err) {
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
            .fail(function (err) {
                view.alert('unable to delete task');
                console.log(err);
            });
    };
};