var PackageChecker = function (api, model) {
    this.api = api;
    this.model = model;
} ;

var checkForNewPackages = function checkForNewPackages() {
    var self = this; // Preserve instance for callbacks in other modules
    self.api.getInitialPackages(function(packages) {
        self.model.persistPackagesAsNeeded(packages, newPackageCallback);
    });    
};
PackageChecker.prototype.check = checkForNewPackages;

function newPackageCallback(isAvailable, packageJson) {
    if (isAvailable == true) {
        console.log("new packages are up: ", packageJson);
    }
    else {
        console.log("no new package yet");
    }
}

module.exports = PackageChecker;