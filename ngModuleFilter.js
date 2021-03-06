var through = require('through2');
var moduleInfoParser = require("./moduleInfoParser")
var FileDependenciesTracker = require("./FileDependenciesTracker");
var path = require('path');

module.exports = function (options) {
    var tracker = new FileDependenciesTracker(options.appModule);
    var files = [];

    var stream = through.obj(function (file, enc, cb) {
        moduleInfoParser(file.contents.toString()).forEach(function (moduleDep) {
            tracker.register(moduleDep.name, path.dirname(file.path), moduleDep.dependencies);
        });
        files.push(file);
        cb();
    }, function (cb) {
        files.
            filter(function (file) {
                return tracker.fileIsRequired(file.path);
            }).
            forEach(function (file) {
                stream.push(file);
            });
        cb();
    });

    return stream;
};