var vm = require('vm');
var mockupMethod = function () {
    return angularModuleMockup;
};
var angularModuleMockup = {
    animation: mockupMethod,
    config: mockupMethod,
    constant: mockupMethod,
    controller: mockupMethod,
    directive: mockupMethod,
    factory: mockupMethod,
    filter: mockupMethod,
    provider: mockupMethod,
    run: mockupMethod,
    service: mockupMethod,
    value: mockupMethod
};

module.exports = function (source) {
    var sandbox = {
        angular: {
            module: function (moduleName, dependencies) {
                if (dependencies) {
                    this.moduleDep = {
                        name: moduleName,
                        dependencies: dependencies
                    };
                }
                return angularModuleMockup;
            }
        },
        window: {}
    };
    try {
        if (source.toString().indexOf("angular.module") === -1) {
            return null;
        }
        vm.runInNewContext(source, sandbox);
        return sandbox.angular.moduleDep;
    }
    catch (e) {
        console.error(e);
        console.log(source.toString());
        return null;
    }
};
