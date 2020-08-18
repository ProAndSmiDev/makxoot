const gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    pugbem = require('gulp-pugbem'),
    rename = require('gulp-rename'),
    fs = require('fs'),
    concat = require('gulp-concat'),
    imgMin = require('gulp-imagemin'),
    prefix = require('gulp-autoprefixer'),
    pngQuant = require('imagemin-pngquant'),
    uglJS = require('gulp-uglify'),
    uglES = require('gulp-uglify-es').default,
    sync = require('browser-sync'),
    data = require('gulp-data'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    root = {
        'dev': './app',
        'prod': './public',
        'data': './data/data.json'
    },
    deploy = {
        'fonts': root.dev + '/assets/fonts/**/**',
        'libsCSS': root.dev + '/assets/libs/**/*.css',
        'libsJS': root.dev + '/assets/libs/**/*.js',
        'img': root.dev + '/assets/img/**/*',
        'svg': root.dev + '/assets/img/**/*.svg',
        'sass': root.dev + '/assets/sass/styles.sass',
        'pug': root.dev + '/views/index.pug',
        'es': root.dev + '/assets/es/**/*.js'
    },
    prod = {
        'fonts': root.prod + '/fonts',
        'img': root.prod + '/img',
        'css': root.prod + '/css',
        'js': root.prod + '/js',
    };

sass.compiler = require('node-sass');

gulp.task('sass', () => {
    return gulp.src(deploy.sass)
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest(prod.css))
});

gulp.task('img', () => {
    return gulp.src([deploy.img, '!' + root.dev + '/assets/img/**/*.svg'])
        .pipe(imgMin({
            interlaced: true,
            progressive: true,
            svgoPlugins: {removeViewBox: false},
            use: pngQuant()
        }))
        .pipe(gulp.dest(prod.img))
});

gulp.task('fonts', () => {
    gulp.src(deploy.fonts)
        .pipe(ttf2woff())
        .pipe(gulp.dest(prod.fonts));

    return gulp.src(deploy.fonts)
        .pipe(ttf2woff2())
        .pipe(gulp.dest(prod.fonts));
});

gulp.task('svg', () => {
    return gulp.src(deploy.svg)
        .pipe(gulp.dest(prod.img))
});

gulp.task('libsCSS', () => {
    return gulp.src(deploy.libsCSS)
        .pipe(rename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(gulp.dest(prod.css))
});

gulp.task('libsJS', () => {
    return gulp.src(deploy.libsJS)
        .pipe(uglJS())
        .pipe(rename({
            suffix: '.min',
            extname: '.js'
        }))
        .pipe(gulp.dest(prod.js))
});

gulp.task('es', () => {
    return gulp.src(deploy.es)
        .pipe(concat('app.min.js'))
        .pipe(uglES())
        .pipe(gulp.dest(prod.js))
});

gulp.task('pug', () => {
    return gulp.src(deploy.pug)
        .pipe(data(() => JSON.parse(fs.readFileSync(root.data, 'utf-8'))))
        .pipe(pug({
            pretty: true,
            locals: root.data,
            plugins: [pugbem],
        }))
        .pipe(gulp.dest(root.prod))
});

gulp.task('watch', () => {
    gulp.watch(root.dev + '/assets/es/**/*.js', gulp.series('es'));
    gulp.watch([root.data, root.dev + '/**/*.pug'], gulp.series('pug'));
    gulp.watch(root.dev + '/assets/sass/**/*.sass', gulp.series('sass'));
});

gulp.task('build', gulp.series([
    gulp.parallel(['img', 'svg']),
    gulp.parallel(['fonts', 'libsCSS', 'libsJS']),
    gulp.parallel(['sass', 'es', 'pug'])
]));

gulp.task('serve', () => {
    sync({
        server: {
            baseDir: root.prod
        },
        notify: false
    });

    sync.watch(root.dev);
});

gulp.task('default', gulp.series([
    gulp.parallel('build'),
    gulp.parallel(['serve', 'watch'])
]));