/****************************
 *
 * Model
 *
 *****************************/

var Model = function () {

    /** private variables **/
    var kido = new Kido(),
        tasksSet = kido.storage().objectSet("tasks", { caching: true, queueing: true }), // 2nd param enables client-side caching
        logging = kido.logging(),
        config = kido.config();

    this.authenticate = function (application, marketplace) {
        // if we are running in localhost, then it means we are developing,
        // so we are already authenticated
        if (window.location.hostname == "localhost") {
            return $.Deferred().resolve();
        }
        // kido passive auth strategy
        kido = new Kido(application, marketplace);
        return kido.authenticate()
            .done(function () {
                // user authenticated
                tasksSet = kido.storage().objectSet("tasks", { caching: true, queueing: true });
                logging = kido.logging();
                config = kido.config();
            });
    };

    this.signout = function () {
        kido = new Kido();
        tasksSet = kido.storage().objectSet("tasks", { caching: true, queueing: true });
        logging = kido.logging();
        config = kido.config();
    };

    this.getTask = function (_id) {
        return tasksSet.get(_id);
    };

    this.queryTasks = function (filter) {
        return tasksSet.query(filter);
    };

    this.insertTask = function (title, desc) {

        var t = { title: title, desc: desc, completed: false };

        return tasksSet
            .insert(t)
            .done(function () {
                logging.writeInfo("new task '" + title + "' has been created.");
            })
            .fail(function (err) {
                logging.writeError("an error occured trying to insert a task: " + JSON.stringify(err));
            });
    };

    this.completeTask = function (_id) {
        //for updating an object in kidozen, the _metadata must be sent,
        //and the sync property must match the version on the server (
        //for concurrency check).
        return tasksSet
            .get(_id)
            .pipe(function (task) {
                if (task.completed) return task;
                task.completed = true; //complete the task.
                return tasksSet.update(task);
            })
            .done(function (t) {
                logging.writeInfo("task '" + t.title + "' has been completed.");
            })
            .fail(function (err) {
                logging.writeError("an error occured trying to complete a task: " + JSON.stringify(err));
            });
    };

    this.deleteTask = function (_id) {
        return tasksSet
            .del(_id)
            .done(function () {
                logging.writeInfo("task '" + _id + " has been deleted.");
            })
            .fail(function () {
                logging.writeError("an error occured trying to delete task " + _id);
            });
    };

    this.getLogs = function () {
        return logging.get();
    };
};