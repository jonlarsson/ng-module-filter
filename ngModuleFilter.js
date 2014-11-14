var through = require('through2');
var extractModuleInfo = require("./extractModuleInfo");
var path = require('path');

module.exports = function (options) {
    var appModule = options.appModule;
    var moduleDeps = {};
    var files = [];
    var dirsWithModules = {};

    function requiredBy(module, dir) {
        var moduleDep = moduleDeps[module];
        if (!moduleDep) {
            return false;
        } else if (moduleDep.dir === dir || moduleDep.dir === dir) {
            return true;
        } else {
            return moduleDep.dependencies.some(function (dep) {
                return requiredBy(dep, dir);
            });
        }
    }

    function closestDirWithModule(filePath) {
        var dirName = path.dirname(filePath);
        if (!dirName) {
            return null;
        }
        if (dirsWithModules[dirName]) {
            return dirName;
        } else {
            return closestDirWithModule(dirName);
        }
    }

    var stream = through.obj(function (file, enc, cb) {
        var moduleDep = extractModuleInfo(file.contents);
        if (moduleDep) {
            moduleDep.dir = path.dirname(file.path);
            dirsWithModules[moduleDep.dir] = true;
            moduleDeps[moduleDep.name] = moduleDep;
        }

        files.push(file);
        cb();
    }, function (cb) {
        files.
            filter(function (file) {
                var moduleDir = closestDirWithModule(file.path);
                var isRequired = requiredBy(appModule, moduleDir);
                if (!isRequired) {
                    console.log("tar bort", file.path, moduleDir);
                }
                return  isRequired;
            }).
            forEach(function (file) {
                stream.push(file);
            });
        cb();
    });
    return stream;
};