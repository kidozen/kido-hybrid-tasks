// var e = document.getElementById('stage').innerHTML;

// beforeEach(function () {
// 	document.getElementById('stage').innerHTML = e;
// });
afterEach(function() {
    document.getElementById('stage').innerHTML = '';
});

var helper = {
    trigger: function(obj, name) {
        var e = document.createEvent('Event');
        e.initEvent(name, true, true);
        obj.dispatchEvent(e);
    }
};
