var FileDependenciesTracker = require("../FileDependenciesTracker");
var assert = require("assert")
require("mocha");

describe("FileDependenciesTracker", function () {

    var tracker;
    beforeEach(function () {
        tracker = new FileDependenciesTracker("appmodule");
    });

    it("should require a file in the app modules directory", function () {
        tracker.register("appmodule", "d1", []);
        assert.equal(tracker.fileIsRequired("d1/f1.js"), true);
    });

    it("should require a file in a dependency modules directory", function () {
        tracker.register("appmodule", "d1", ["depmodule"]);
        tracker.register("depmodule", "d2", []);
        assert.equal(tracker.fileIsRequired("d2/f1.js"), true);
    });

    it("should require a file in a dependency modules subdirectory", function () {
        tracker.register("appmodule", "d1", ["depmodule"]);
        tracker.register("depmodule", "d2", []);
        assert.equal(tracker.fileIsRequired("d2/s1/s2/f1.js"), true);
    });

    it("should not require a file in a non dependency modules directory", function () {
        tracker.register("appmodule", "d1", ["depmodule"]);
        tracker.register("depmodule", "d3", []);
        tracker.register("nondepmodule", "d2", []);
        assert.equal(tracker.fileIsRequired("d2/f1.js"), false);
    });

    it("should not require a file outside module directories", function () {
        tracker.register("appmodule", "d1", ["depmodule"]);
        tracker.register("depmodule", "d2", []);
        assert.equal(tracker.fileIsRequired("d3/f1.js"), false);
    });

    it("should handle arbitrary deep dependency graphs", function () {
        tracker.register("appmodule", "d1", ["dep1"]);
        tracker.register("dep1", "d2", ["dep2"]);
        tracker.register("dep2", "d3", ["dep3"]);
        tracker.register("dep3", "d4", []);

        assert.equal(tracker.fileIsRequired("d4/f1.js"), true);
    });

    it("should handle circular dependencies", function () {
        tracker.register("appmodule", "d1", ["dep1"]);
        tracker.register("dep1", "d2", ["dep2"]);
        tracker.register("dep2", "d3", ["appmodule"]);

        assert.equal(tracker.fileIsRequired("d3/f1.js"), true);
        assert.equal(tracker.fileIsRequired("d4/f1.js"), false);

    })
});