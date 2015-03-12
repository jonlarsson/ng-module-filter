# gulp-ng-module-filter
gulp-ng-module-filter scans the dependencies of your main angular module and removes files from the stream that are not
located in directories that can be tied to any dependency.

The purpose of this plugin is to remove files in unused modules before concatenation. This way it is possible to build different applications from one codebase of angular modules.

The prerequisite is that all files that are needed by a module are located in the same directory or a subdirectory where the module definition is located.

## Usage
```shell
npm install --save-dev gulp-ng-module-filter
```

```javascript
var ngModuleFilter = require("gulp-ng-module-filter");
var concat = require("gulp-concat");
var filter = require("gulp-filter");
var templateCache = require('gulp-angular-templatecache');

gulp.src("src/**/*.js").
  pipe(ngModuleFilter({appModule: "myAppModule"}).
  pipe(concat("myApp.js")).
  pipe(gulp.dest("target"));
  
gulp.src("src/**/*.(js|html)").  // the js files is needed for the module definitions and module locations
  pipe(ngModuleFilter({appModule: "myAppModule"}).
  pipe(filter("**/*.html")). // we are henceforth only interested in html-files
  pipe(templateCache()).
  pipe(gulpe.dest("target");
```
## API
Very simple at this point:
### ngModuleFilter(options)

#### options
Type: `Object` `Required`

#### options.appModule
Type: `string` `Required`

The name of the main module of the angular application.
