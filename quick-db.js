var Qdb = (function () {

    if (window.localStorage) {
        var Local = function (userid) {
            this.userid = userid;
        };
        Local.prototype.set = function (name, obj) {
            localStorage.setItem(this.userid + "." + name, JSON.stringify(obj));
        };
        Local.prototype.get = function (name) {
            return JSON.parse(localStorage.getItem(this.userid + "." + name));
        };
        Local.prototype.rm = function (name) {
            return localStorage.removeItem(this.userid + "." + name);
        };
        Local.prototype.clear = function () {
            localStorage.clear();
        };
    } else {
        console.error("Sorry, quick-db requires localStorage support of browser");
        return null;
    }

    var BASE_URL = "https://quick-db.herokuapp.com/";

    var request = function (userid, method, data, callback) {
        var xhr = new XMLHttpRequest();
        var url = BASE_URL + userid;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (callback) {
                        callback(null, xhr.responseText && JSON.parse(xhr.responseText));
                    }
                } else {
                    if (callback) {
                        callback(new Error(method + " request to " + url + " failed with status " + xhr.status));
                    }
                }
            }
        };
        xhr.ontimeout = function () {
            if (callback) {
                callback(new Error(method + " request to " + url + " timed out"));
            }
        };

        if (data) {
            if (method == 'POST') {
                xhr.open(method, url, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(data));
            } else {
                var query = "?name=" + data;
                xhr.open(method, url + query, true);
                xhr.send();
            }
        } else {
            xhr.open(method, url, true);
            xhr.send();
        }
    };

    var Remote = function (userid) {
        this.userid = userid;
    };
    Remote.prototype.set = function (name, obj, callback) {
        request(this.userid, 'POST', { name: name, obj: obj }, callback);
    };
    Remote.prototype.get = function (name, callback) {
        request(this.userid, 'GET', name, callback);
    };
    Remote.prototype.rm = function (name, callback) {
        request(this.userid, 'DELETE', name, callback);
    };
    Remote.prototype.clear = function (callback) {
        request(this.userid, 'DELETE', null, callback);
    };

    return function (userid) {
        this.local = new Local(userid);
        this.remote = new Remote(userid);
    };
})();