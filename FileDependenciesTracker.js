var path = require('path');

function FileDependenciesTracker(appModule) {
    this.moduleDeps = {};
    this.directoriesWithModule = {};
    this.appModule = appModule;
}

FileDependenciesTracker.prototype.directoryIsRequiredByModule = function (module, dir, cdc) {
    var moduleDep = this.moduleDeps[module];
    if (cdc.indexOf(module) !== cdc.length - 1) {
        console.warn("Module", module, "was found in a dependency cycle", cdc);
        return false;
    }
    if (!moduleDep) {
        return false;
    } else if (moduleDep.directory === dir) {
        return true;
    } else {
        return moduleDep.dependencies.some(function (dep) {
            cdc.push(dep);
            var dependencyResult = this.directoryIsRequiredByModule(dep, dir, cdc);
            cdc.pop();
            return dependencyResult;
        }.bind(this));
    }
};

FileDependenciesTracker.prototype.register = function (module, directory, moduleDependencies) {
    this.moduleDeps[module] = {
        module: module,
        directory: directory,
        dependencies: moduleDependencies
    };
    this.directoriesWithModule[directory] = module;
};

FileDependenciesTracker.prototype.closestDirWithModule = function (filePath) {
    var dirName = path.dirname(filePath);
    if (!dirName || dirName === filePath) {
        return null;
    }
    if (this.directoriesWithModule[dirName]) {
        return dirName;
    } else {
        return this.closestDirWithModule(dirName);
    }
};

FileDependenciesTracker.prototype.fileIsRequired = function (filePath) {
    return this.directoryIsRequiredByModule(this.appModule, this.closestDirWithModule(filePath), [this.appModule]);
};

module.exports = FileDependenciesTracker;