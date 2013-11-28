describe('view', function() {
    //mock jquery mobile
    $.mobile = { changePage: function () {} };
    $.fn.listview = function () {
        this.trigger = function () {};
        return this;
    };
    //load the index.html to make tests on actual real HTML
    beforeEach(function () {
        var done = false;
        runs(function () {
            $( "#stage" ).load( "index.html #home", function () {
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        }, 500);
    });
    
    describe('tasks', function() {

        it('should have the tasks placeholder', function () {
            var e = $("#home").get(0);
            expect(!!e).toBe(true);
        });

        describe('showLoadingView', function () {
            it('should activate the right page', function () {
                spyOn($.mobile, 'changePage');
                var view = new View($);
                view.tasks.showLoadingView();
                expect($.mobile.changePage).toHaveBeenCalledWith('#home');
            });

            it('should activate the right tab', function () {
                spyOn($.mobile, 'changePage');
                var view = new View($);
                view.tasks.showLoadingView('pending');
                var active = $("#tasks-filter > li > a#pending-tasks").hasClass("ui-btn-active");
                expect(active).toBe(true);
            });

            it('should display a loading message', function () {
               spyOn($.mobile, 'changePage');
                var view = new View($);
                view.tasks.showLoadingView('pending');
                var content = $("#tasks-list").html();
                expect(content.indexOf('Loading') > -1).toBe(true);
            });
        });
    });
});
