// *************************************
//
//   Gulpfile
//
// *************************************
//
// Available tasks:
//   `gulp`
//   `gulp clean` deletes the compiled and minified css file in dist
//   `gulp build` minify and vendor then copy to dist
//   `gulp watch`
//
// *************************************
// -------------------------------------
//   Modules
// -------------------------------------
//
// gulp              : The streaming build system
// gulp-sass         : Compile Sass
// del               : Delete files and folders using globs
// gulp-uglify       : Minify JavaScript
// gulp-clean-css    : Minify CSS
// gulp-rename       : Renames "_" to "-"
// merge-stream      : Combines parts of a task
// gulp-html-replace : Replace build blocks in HTML
// gulp-autoprefixer : Prefix CSS
// browser-sync      : Auto reloading of the browser on save
//
// -------------------------------------

// Load Gulp
"use strict";

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    merge = require('merge-stream'),
    htmlreplace = require('gulp-html-replace'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

// Clean task
gulp.task('clean', function() {
    return del(['dist', "assets/css/app.css"]);
});

// Copy third party libraries from node_modules into /vendor
gulp.task('vendor:js', function() {
    return gulp
        .src([
            "./node_modules/bootstrap/dist/js/*",
            "./node_modules/jquery/dist/*",
            "!./node_modules/jquery/dist/core.js",
            "./node_modules/popper.js/dist/umd/popper.*"
        ])
        .pipe(gulp.dest("./assets/js/vendor"));
});

// Copy font-awesome from node_modules into /fonts
gulp.task('vendor:fonts', function() {
    return gulp
        .src([
            "./node_modules/@fortawesome/fontawesome-free/**/*",
            "!./node_modules/@fortawesome/fontawesome-free/{less,less/*}",
            "!./node_modules/@fortawesome/fontawesome-free/{scss,scss/*}",
            "!./node_modules/@fortawesome/fontawesome-free/.*",
            "!./node_modules/@fortawesome/fontawesome-free/*.{txt,json,md}"
        ])
        .pipe(gulp.dest("./assets/fonts/font-awesome"));
});

// vendor task
gulp.task('vendor', gulp.parallel('vendor:fonts', 'vendor:js'));

// Copy vendor's js to /dist
gulp.task('vendor:build', function() {
    var jsStream = gulp
        .src([
            "./assets/js/vendor/bootstrap.bundle.min.js",
            "./assets/js/vendor/bootstrap.min.js",
            "./assets/js/vendor/jquery.min.js",
            "./assets/js/vendor/popper.min.js",
            "./assets/js/vendor/jquery.magnific-popup.min.js"
        ])
        .pipe(gulp.dest("./dist/assets/js/vendor"));
    var fontStream = gulp
        .src(["./assets/fonts/font-awesome/**/*.*"])
        .pipe(gulp.dest("./dist/assets/fonts/font-awesome"));
    return merge(jsStream, fontStream);
});

// Copy Bootstrap SCSS(SASS) from node_modules to /assets/scss/bootstrap
gulp.task('bootstrap:scss', function() {
    return gulp
        .src(["./node_modules/bootstrap/scss/**/*"])
        .pipe(gulp.dest("./assets/scss/bootstrap"));
});

// Compile SCSS(SASS) files
gulp.task(
    'scss',
    gulp.series('bootstrap:scss', function compileScss() {
        return gulp
            .src(["./assets/scss/*.scss"])
            .pipe(
                sass
                .sync({
                    outputStyle: 'expanded'
                })
                .on('error', sass.logError)
            )
            .pipe(autoprefixer())
            .pipe(gulp.dest("./assets/css"));
    })
);

// Minify CSS
gulp.task(
    'css:minify',
    gulp.series('scss', function cssMinify() {
        return gulp
            .src(["./assets/css/app.css",
                "./assets/css/magnific-popup.css"
            ])
            .pipe(cleanCSS())
            .pipe(
                rename({
                    suffix: '.min'
                })
            )
            .pipe(gulp.dest("./dist/assets/css"))
            .pipe(browserSync.stream());
    })
);

// Minify Js
gulp.task('js:minify', function() {
    return gulp
        .src(["./assets/js/app.js"])
        .pipe(uglify())
        .pipe(
            rename({
                suffix: '.min'
            })
        )
        .pipe(gulp.dest("./dist/assets/js"))
        .pipe(browserSync.stream());
});

// Minify Vendor Js
gulp.task('vendor:minify', function() {
    return gulp
        .src(["./assets/js/vendor/lazy.js", "./assets/js/vendor/modernizr-custom.js"])
        .pipe(uglify())
        .pipe(
            rename({
                suffix: '.min'
            })
        )
        .pipe(gulp.dest("./dist/assets/js/vendor"))
        .pipe(browserSync.stream());
});

// Replace HTML block for Js and Css file upon build and copy to /dist
gulp.task('replaceHtmlBlock', function() {
    return gulp
        .src(["*.html"])
        .pipe(
            htmlreplace({
                js: "assets/js/app.min.js",
                vendor: ["assets/js/vendor/lazy.min.js","assets/js/vendor/modernizr-custom.min.js"],
                css: ["assets/css/app.min.css", "assets/css/magnific-popup.min.css"]
            })
        )
        .pipe(gulp.dest("dist/"));
});

// Configure the browserSync task and watch file path for change
gulp.task('watch', function browserDev(done) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(
        [
            "assets/scss/*.scss",
            "assets/scss/**/*.scss",
            "!assets/scss/bootstrap/**"
        ],
        gulp.series('css:minify', function cssBrowserReload(done) {
            browserSync.reload();
            done(); //Async callback for completion.
        })
    );
    gulp.watch(
        "assets/js/app.js",
        gulp.series('js:minify', function jsBrowserReload(done) {
            browserSync.reload();
            done();
        })
    );
    gulp.watch(["*.html"]).on('change', browserSync.reload);
    done();
});

// Build task
gulp.task(
    'build',
    gulp.series(
        gulp.parallel('css:minify', 'js:minify', 'vendor:minify', 'vendor'),
        'vendor:build',
        function copyAssets() {
            return gulp
                .src(["*.html", "favicon.ico", "assets/img/**"], {
                    base: "./"
                })
                .pipe(gulp.dest('dist'));
        }
    )
);

// Default task
gulp.task('default', gulp.series('clean', 'build', 'replaceHtmlBlock'));