const images = require("./images.json")

const gulp = require("gulp")
const less = require("gulp-less")
const autoprefixer = require("gulp-autoprefixer")
const browserSync = require("browser-sync")
const imagemin = require("gulp-imagemin")
const include = require("gulp-include")
const clean = require("gulp-clean")
const typograf = require("gulp-typograf")
const beautify = require("gulp-html-beautify")
const template = require("gulp-template")

// Сервер
gulp.task("server", function () {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
    ghostMode: false,
  })

  gulp.watch("src/*.less").on("change", browserSync.reload)
  gulp.watch("src/**/*.less").on("change", browserSync.reload)
  gulp.watch("src/*.html").on("change", browserSync.reload)
  gulp.watch("src/**/*.html").on("change", browserSync.reload)
  gulp.watch("src/*.js").on("change", browserSync.reload)
})

// Наблюдатели
gulp.task("watch", () => {
  gulp.watch("src/*.less").on("change", gulp.task("build"))
  gulp.watch("src/**/*.less").on("change", gulp.task("build"))
  gulp.watch("src/*.html").on("change", gulp.task("build"))
  gulp.watch("src/**/*.html").on("change", gulp.task("build"))
  gulp.watch("src/scripts/*.js").on("change", gulp.task("build"))
})

// Удаление папки dist
gulp.task("delete-dist", () => {
  return gulp
    .src("dist", {
      allowEmpty: true,
    })
    .pipe(clean())
})

// Обработка index.html
gulp.task("html", () => {
  return gulp.src("src/*.html").pipe(gulp.dest("dist/"))
})

// Обработка глобальных стилей
gulp.task("styles", () => {
  return gulp
    .src("src/styles/global.less")
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest("dist/"))
})

// Обработка скриптов
gulp.task("scripts", () => {
  return gulp
    .src("src/scripts/main.js")
    .pipe(include())
    .pipe(gulp.dest("dist/"))
})

// Обработка изображений
gulp.task("images", () => {
  return (
    gulp
      .src("src/images/*")
      // .pipe(imagemin())
      .pipe(gulp.dest("dist/images"))
  )
})

// Обработка стилей компонентов
gulp.task("blocksStyles", () => {
  return gulp
    .src("src/blocks/**/*.less")
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest("dist/blocks"))
})

// Обработка компонентов
gulp.task("blocksHtml", () => {
  return gulp.src("src/blocks/**/*.html").pipe(gulp.dest("dist/blocks"))
})

// Вставка inline стилей
gulp.task("includeStyleBlocks", () => {
  return gulp
    .src("dist/blocks/**/*.html")
    .pipe(include())
    .pipe(gulp.dest("dist/blocks"))
})

// Генерация index.html
gulp.task("includeBlocks", () => {
  return gulp
    .src("dist/*.html")
    .pipe(include())
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.stream())
})

// Удаление лишних CSS файлов
gulp.task("clean", () => {
  return gulp
    .src("dist/blocks/**/*.css", {
      read: false,
    })
    .pipe(clean())
})

// Типография текста
gulp.task("typograf", () => {
  return gulp
    .src("dist/blocks/**/*.html")
    .pipe(
      typograf({
        locale: ["ru"],
        htmlEntity: {
          type: "name",
        },
      })
    )
    .pipe(gulp.dest("dist/blocks"))
})

// Форматирование кода
gulp.task("html-beautify", () => {
  return gulp
    .src("./dist/**/*.html")
    .pipe(
      beautify({
        indentSize: 2,
      })
    )
    .pipe(gulp.dest("dist/"))
})

// Шаблонизация данных
gulp.task("template", () => {
  return gulp
    .src("./dist/blocks/**/*.html")
    .pipe(template(images))
    .pipe(gulp.dest("dist/blocks"))
})

gulp.task(
  "build",
  gulp.series(
    // 'delete-dist',
    "styles",
    "scripts",
    "images",
    "html",
    "blocksStyles",
    "blocksHtml",
    "includeStyleBlocks",
    "template",
    "includeBlocks",
    "html-beautify",
    "typograf",
    "clean"
  )
)

gulp.task("watcher", gulp.parallel("watch", "server"))

gulp.task("default", gulp.series("build", "watcher"))
