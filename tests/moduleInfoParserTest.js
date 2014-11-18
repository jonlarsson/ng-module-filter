var moduleInfoParser = require("../moduleInfoParser");
var assert = require("assert")
require("mocha");

describe("extractModuleInfo", function () {

    it("should extract single module with name and dependencies", function () {
        var source = 'angular.module("mod", ["dep1", "dep2"])';
        assert.deepEqual(moduleInfoParser(source), [
            {
                name: "mod",
                dependencies: [
                    "dep1",
                    "dep2"
                ]
            }
        ]);
    });

    it("should extract multiple modules with names and dependencies", function () {
        var source = 'angular.module("mod1", []); \n angular . module ( "mod2", ["dep1" , "dep2"] )';
        assert.deepEqual(moduleInfoParser(source), [
            {
                name: "mod1",
                dependencies: []
            },
            {
                name: "mod2",
                dependencies: [
                    "dep1",
                    "dep2"
                ]
            }
        ]);
    });

    it("should handle single quotes", function () {
        var source = "angular.module('mod', ['dep1'])";
        assert.deepEqual(moduleInfoParser(source), [
            {
                name: "mod",
                dependencies: [
                    "dep1"
                ]
            }
        ]);
    });
});