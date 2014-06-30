/****************************
*
* Model
*
*****************************/

var Model = function () {

    /** private variables **/
    var self = this,
        kido = new Kido(),
        tasksSet  = kido.storage().objectSet("tasks", true),
        logging   = kido.logging(),
        config    = kido.config();

    this.authenticate = function (username, password, application, marketplace, provider) {
        // if we are running in localhost, then it means we are developing,
        // so we are already authenticated
        if (window.location.hostname == "localhost") {
            return $.Deferred().resolve();
        }
        var kido = new Kido(application, marketplace);
        return kido.authenticate(username, password, provider)
            .done(function () {
                // the user authenticated
                tasksSet = kido.storage().objectSet("tasks", true);
                logging  = kido.logging();
                config   = kido.config();
            });
    };

    this.signout = function () {
        kido      = new Kido();
        tasksSet  = kido.storage().objectSet("tasks");
        logging   = kido.logging();
        config    = kido.config();
    };

    this.getTask = function ( _id ) {
        return tasksSet.get(_id);
    };

    this.queryTasks = function ( filter ) {
        return tasksSet.query(filter);
    };

    this.insertTask = function ( title, desc ) {

        var t = { title: title, desc: desc, completed: false };

        return tasksSet
                .insert( t )
                .done(function () {
                    logging.writeInfo("new task '" + title + "' has been created.");
                })
                .fail(function ( err ) {
                    logging.writeError("an error occured trying to insert a task: " + JSON.stringify(err, 0, 2));
                });
    };

    this.completeTask = function( _id ) {
        //for updating an object in kidozen, the _metadata must be sent,
        //and the sync property must match the version on the server (
        //for concurrency check).
        return tasksSet
            .get(_id)
            .pipe(function( task ) {
                if (task.completed) return task;
                task.completed = true; //complete the task.
                return tasksSet.update(task);
            })
            .done(function ( t ) {
                logging.writeInfo("task '" + t.title + "' has been completed.");
            })
            .fail(function () {
                logging.writeError("an error occured trying to complete a task: " + JSON.stringify(err, 0, 2));
            });
    };

    this.deleteTask = function ( _id ) {
        return tasksSet
            .del(_id)
            .done(function ( ) {
                logging.writeInfo("task '" + _id + " has been deleted.");
            })
            .fail(function() {
                logging.writeError("an error occured trying to delete task " + _id);
            });
    };

    this.getLogs = function ( ) {
        return logging.get();
    };
};