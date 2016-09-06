var Network = require('./network.js');
var network = new Network();

var userName;
var passWord;

var MasoniteAPI = function (username, password) {
    userName = username;
    passWord = password;
};

var host = "configdemo.masonite.com";
var authenticationEndpoint = "/MaxMobileREST/v1/authentication/authenticate.htmx";
var initialPackageEndpoint = "/MaxMobileREST/v1/dataLoad/getInitialPackages.htmx";

function getAuthToken(callback) {
    var userPass = {
        "userName" : userName,
        "password" : passWord
    };
    network.request(host, authenticationEndpoint, 'POST', userPass, function(res) {
        var token = res["validationToken"];
        callback(token);
    });
}

MasoniteAPI.prototype.getInitialPackages = function getInitialPackages(callback) {
    getAuthToken(function(token) {
        var body = {
          "token" : token  
        };
        
        network.request(host, initialPackageEndpoint, 'POST', body, function(res) {
            var packages = res["packages"];
            callback(packages);
        });
        
    })
};

module.exports = MasoniteAPI;