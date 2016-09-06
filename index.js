if (process.argv.length < 4) {
    console.log("INCLUDE MASONITE API USER AND PASS AS COMMAND LINE ARGUMENTS:");
    console.log("    node index.js username password");
    process.exit(1);
}

var MasoniteAPI = require('./masonite-api.js');
var api = new MasoniteAPI(process.argv[2], process.argv[3]);

var MasoniteModel = require('./masonite-model.js');
var model = new MasoniteModel();
model.db.on('error', console.error.bind(console, 'mongoose connection error:'));
model.db.once('open', function(){
    start();
});

var PackageChecker = require('./package-checker.js');
var packageChecker = new PackageChecker(api, model);

function start() {
    packageChecker.model = model;
    packageChecker.check();
    
    // Repeat every minute hereafter
    setInterval(packageChecker.check.bind(packageChecker), 1000 * 60);
}

