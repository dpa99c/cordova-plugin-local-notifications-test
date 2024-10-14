var fs = require('fs');
var path = require('path');
var parser  = require('xml2js');
var Q = require('q');
var deferred;

var sourceDir = 'res/notification_icon';
var sourceFiles = ['notification.png'];

module.exports = function(ctx) {
    if (ctx.opts.platforms.indexOf('ios') < 0) {
        return;
    }

    deferred = Q.defer();

    var configXml = fs.readFileSync(path.resolve(process.cwd(), 'config.xml'));
    parser.parseString(configXml, function(err, root) {
        if (err) {
            deferred.reject(err);
            return console.log(PLUGIN_NAME, " ERROR: ", err);
        }

        var appName = root.widget.name[0];
        var customResourcesDir = path.resolve("./platforms/ios/" + appName + "/Resources/");

        sourceFiles.forEach(function (sourceFile) {
            var filePath = path.join(ctx.opts.projectRoot, sourceDir, sourceFile);
            var destPath = path.join(customResourcesDir, sourceFile);
            copy(filePath, destPath);
        });
        deferred.resolve();
    });
    return deferred.promise;
};

function copy(src, dest) {
    fs.stat(src, function(err, stats) {
        if (err || !stats.isFile()) {
            console.log("ERROR: Source file " + src + " does not exist");
            return deferred.reject(err);
        }

        fs.stat(path.dirname(dest), function(err, stats) {
            if (err || !stats.isDirectory()) {
                console.log("Creating target resource directory: " + path.dirname(dest));
                fs.mkdirSync(path.dirname(dest));
            }

            var rs = fs.createReadStream(src);

            rs.on('error', function(err) {
                console.error(err.stack);
                deferred.reject(err);
            });

            var ws = fs.createWriteStream(dest);

            ws.on('error', function(err) {
                console.error(err.stack);
                deferred.reject(err);
            });

            ws.on('close', function() {
                deferred.resolve();
            });

            rs.pipe(ws);
        });
    });

    return deferred.promise;
}
