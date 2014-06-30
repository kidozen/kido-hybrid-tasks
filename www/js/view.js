/****************************
*
* Views (DOM Manipulation)
*
*****************************/

var View = function ($) {

    return {

        alert: function (msg) {
            //TODO: do something fancier.
            alert(msg);
        },

        login: {
            load: function (opts) {
                $("#sign-in-page .loading").hide();
                $("#sign-in-page .loaded").show();
                $("#username").val(opts.username);
                $("#password").val(opts.password);
                $("#application").val(opts.application);
                $("#marketplace").val(opts.marketplace);
            },
            show: function () {
                $.mobile.changePage("#sign-in-page");
            },
            username: function () {
                return $("#username").val();
            },
            password: function () {
                return $("#password").val();
            },
            application: function () {
                return $("#application").val();
            },
            marketplace: function () {
                return $("#marketplace").val();
            }
        },

        tasks: {
            show: function () {
                $.mobile.changePage("#home");
            },
            showLoadingView: function ( tab ) {
                $("#tasks-filter > li > a").removeClass("ui-btn-active");
                //activate the right tab.
                $("#tasks-filter > li > a#" + tab + "-tasks").addClass("ui-btn-active");
                //clean the tasks list and indicate loading.
                $("#tasks-list").html('<li>Loading...</li>');
                $("#tasks-list").listview("refresh").trigger("create");
            },
            showEmptyView: function () {
                $("#tasks-list").html('<li>No tasks yet</li>');
                //refresh the UI
                $("#tasks-list").listview("refresh").trigger("create");
            },
            showListView: function ( tasks ) {
                console.log("showing list of tasks");
                //clean the tasks list
                $("#tasks-list").html('');
                //add a list item per task
                $.each(tasks, function ( index, task ) {
                    $("#tasks-list").append(
                        '<li>' +
                            '<a data-id="' + task._id + '" href="#">' +
                                task.title +
                            '</a>' +
                        '</li>'
                    );
                });
                //refresh the UI
                $("#tasks-list").listview("refresh").trigger("create");
            },
            showErrorView: function ( err ) {
                $("#tasks-list").html('<li>An error occured while querying the tasks</li>');
                //refresh the UI
                $("#tasks-list").listview("refresh").trigger("create");
            }
        },

        newTask: {
            title: function () {
                return $("#task-title").val();
            },
            description: function () {
                return $("#task-desc").val();
            },
            clear: function () {
                $("#task-title").val('');
                $("#task-desc").val('');
            }
        },

        task: {
            id: function () {
                return $("#task-id").val();
            },
            showLoadingView: function () {
                $.mobile.changePage("#details");
                //get the form ready.
                $("#details div[data-role=header] h1").html('loading...');
                $("#details pre").html('');
            },
            showDetails: function  ( task ) {
                $("#details div[data-role=header] h1").html( task.title );
                $("#details #task-id").val( task._id );
                $("#details pre").html( task.desc );
            }
        }
    };
};