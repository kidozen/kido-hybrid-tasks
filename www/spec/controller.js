// some constants for the tests
var username = 'username1';
var password = 'pass1';
var application  = 'app1';
var marketplace  = 'https://mykido1.kidocloud.com';

describe('controller', function() {
    var view = new View($);
    var model = new Model();

    describe('signin', function() {

        it('should signin user', function() {
            spyOn(model, 'authenticate').andReturn($.Deferred());
            spyOn(view.login, 'username').andReturn(username);
            spyOn(view.login, 'password').andReturn(password);
            spyOn(view.login, 'application').andReturn(application);
            spyOn(view.login, 'marketplace').andReturn(marketplace);

            var controller = new Controller(view, model);
            controller.signin();
            expect(model.authenticate).toHaveBeenCalledWith(username, password, application, marketplace);
        });

        it('should alert when authentication fails', function () {
            spyOn(model, 'authenticate').andReturn($.Deferred().reject());
            spyOn(view, 'alert');

            var controller = new Controller(view, model);
            controller.signin();
            expect(view.alert).toHaveBeenCalled();
        });

        it('should load home when authentication succeeds', function () {
            spyOn(model, 'authenticate').andReturn($.Deferred().resolve());
            var controller = new Controller(view, model);
            spyOn(controller, 'loadHome');
            controller.signin();
            expect(controller.loadHome).toHaveBeenCalled();
        });
    });

    describe('loadTasks', function () {

        it('should show a loading view while tasks are retrieved', function () {
            spyOn(view.tasks, 'showLoadingView');
            var controller = new Controller(view, model);
            controller.loadTasks();
            expect(view.tasks.showLoadingView).toHaveBeenCalled();
        });

        it('should show an empty view when no results', function () {
            spyOn(model, 'queryTasks').andReturn($.Deferred().resolve([]));
            spyOn(view.tasks, 'showLoadingView');
            spyOn(view.tasks, 'showEmptyView');
            var controller = new Controller(view, model);
            controller.loadTasks();
            expect(view.tasks.showEmptyView).toHaveBeenCalled();
        });

        it('should show the tasks when they are retrieved', function () {
            var result = [{},{}];
            spyOn(model, 'queryTasks').andReturn($.Deferred().resolve(result));
            spyOn(view.tasks, 'showLoadingView');
            spyOn(view.tasks, 'showListView');
            var controller = new Controller(view, model);
            controller.loadTasks();
            expect(view.tasks.showListView).toHaveBeenCalledWith(result);
        });

        it('should alert the user if an error occurs', function () {
            spyOn(model, 'queryTasks').andReturn($.Deferred().reject());
            spyOn(view.tasks, 'showLoadingView');
            spyOn(view, 'alert');
            var controller = new Controller(view, model);
            controller.loadTasks();
            expect(view.alert).toHaveBeenCalled();
        });

        it('should create a query object for pending tasks', function () {
            spyOn(model, 'queryTasks').andReturn($.Deferred());
            spyOn(view.tasks, 'showLoadingView');
            var controller = new Controller(view, model);
            controller.loadTasks('pending');
            expect(model.queryTasks).toHaveBeenCalledWith({completed: false});
        });

        it('should create a query object for completed tasks', function () {
            spyOn(model, 'queryTasks').andReturn($.Deferred());
            spyOn(view.tasks, 'showLoadingView');
            var controller = new Controller(view, model);
            controller.loadTasks('completed');
            expect(model.queryTasks).toHaveBeenCalledWith({completed: true});
        });

        it('should create a query object for all tasks', function () {
            spyOn(model, 'queryTasks').andReturn($.Deferred());
            spyOn(view.tasks, 'showLoadingView');
            var controller = new Controller(view, model);
            controller.loadTasks();
            expect(model.queryTasks).toHaveBeenCalledWith({});
        });
    });
});