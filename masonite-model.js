var MasoniteModel = function () {};

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo/packages');

var db = mongoose.connection;
MasoniteModel.prototype.db = db;

var packageSchema = mongoose.Schema({
    dealerMasoniteId: Number,
    newerDataVersionNumber: Number,
    url :String,
    type :String,
    date: {type: Date, default: Date.now}
});
Package =  mongoose.model('Package', packageSchema);
MasoniteModel.prototype.Package = Package;

var persistPackage = function persistPackage(packageJson) {
    var package = new Package(packageJson);
    package.save(function(err) {
        if (err) {
            console.error("Mongo save error: ", err);
        }
    });    
};

var packageExists = function packageExists(packageJson) {
    var promise = new Promise(function(resolve, reject) {
        Package.find(packageJson, function(err, packages) {
            if (err) {
                reject(err);
            }
            else if (packages.length == 0){
                resolve({"exists":false, "json":packageJson});
            }
            else {
                resolve({"exists":true, "json":packageJson});
            }
        });    
    });
    return promise;
};

MasoniteModel.prototype.persistPackagesAsNeeded = function persistPackagesAsNeeded(packages, callback) {
    var promises = [];
    
    for (var i = 0; i < packages.length; i++) {
        var packageJson = packages[i];
        var packageExistsPromise = packageExists(packageJson);
        promises.push(packageExistsPromise);
    }
    
    Promise.all(promises).then( values => {        
        var newPackages = [];
        for(var i = 0; i < values.length; i++) {
            value = values[i];
            if (value["exists"] == false) {
                persistPackage(value["json"]);
                newPackages.push(value);
            }
        }
        
        callback(newPackages.length > 0, newPackages);
    });
}

module.exports = MasoniteModel;