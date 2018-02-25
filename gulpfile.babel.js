/*
 * @Author: Edward
 * @Date: 2017-12-20 23:40:02
 * @Last Modified by: Edward
 * @Email: 809537981@qq.com
 * @Last Modified time: 2018-01-14 19:57:00
 */




/**
 * 配置插件引用
 */

import gulp from 'gulp';                             // gulp 主程序
import cssmin from 'gulp-clean-css';                 // css压缩
import autoprefixer from 'gulp-autoprefixer';        // 解析CSS文件并且添加浏览器前缀到CSS规则里
// import rename from 'gulp-rename';                    //重命名,与minifycss配合做压缩css 并添加命名.min  缺点重命名文件后无法替换资源文件
import rev from 'gulp-rev';                          //添加引用文件哈希值版本号
import revCollector from 'gulp-rev-collector';       //静态资源路径替换 配合rev生成静态资源映射表
import runSequence from 'run-sequence';              // 串行执行任务

/**
 * 配置目录 
 */

const baseDir = {
    dev: './dist/',
    work: './www/'
};

const project = 'bookuu-warehouse';

const dir = function (dir) {
    return {
        css: `${dir}${project}/css/`,
        js: `${dir}${project}/js/`,
        font: `${dir}${project}/font/`,
        img: `${dir}${project}/images/`,
        lib: `${dir}${project}/lib/`,
        home: `${dir}${project}/`,
    }
}

const dev = {
    css: `${ dir(baseDir.dev).css }**/*.css`,
    font: `${ dir(baseDir.dev).font}**/*.*`,
    img: `${ dir(baseDir.dev).img }**/*.*`,
    js: `${ dir(baseDir.dev).js }**/*.js`,
    lib: `${ dir(baseDir.dev).lib }**/*.js`,
    home: `${ dir(baseDir.dev).home}`,
}

const work = {
    css: `${ dir(baseDir.work).css }`,
    font: `${ dir(baseDir.work).font}`,
    img: `${ dir(baseDir.work).img }`,
    js: `${ dir(baseDir.work).js }`,
    lib: `${ dir(baseDir.work).lib }`,
    home: `${ dir(baseDir.work).home }`,
}


/**
*
*  @param {cssmin} 处理css 第一阶段任务： 添加前缀 和 压缩css
*
*/

gulp.task('cssmin', () => {
    return gulp.src(`${dev.css}`)
	    // .pipe(rename({suffix: '.min'}))
		.pipe(autoprefixer({
            browsers: ['> 3%', 'last 4 versions', 'Chrome>=38', 'Android >= 4.0', 'Firefox ESR', 'Firefox >= 36','iOS 7'],
	        cascade: false, //是否美化属性值 默认：true 像这样：
	        //-webkit-transform: rotate(45deg);
	        //        transform: rotate(45deg);
	        remove: false //是否去掉不必要的前缀 默认：true
		}))
        .pipe(cssmin({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
		.pipe(gulp.dest(work.css));
});



// 为css中引入的图片/字体等添加hash编码
gulp.task('assetRev', ['cssmin','assetFont', 'assetImg'], () => {
    return gulp.src([`${work.img}**/*.json`, `${work.font}**/*.json`, `${work.css}/**/*.css`])
        .pipe(revCollector())
        .pipe(gulp.dest(work.css));
});


// 为字体文件生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('assetFont', () => {
    return gulp.src(dev.font)
        .pipe(rev())
        .pipe(gulp.dest(work.font))
        .pipe(rev.manifest())
        .pipe(gulp.dest(work.font));
})


// 为图片生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('assetImg', () => {
    return gulp.src(dev.img)
        .pipe(rev())
        .pipe(gulp.dest(work.img))
        .pipe(rev.manifest())
        .pipe(gulp.dest(work.img));
})



// CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', () => {
    return gulp.src(`${work.css}**/*.css`)
        .pipe(rev())
        .pipe(gulp.dest(work.css))
        .pipe(rev.manifest())
        .pipe(gulp.dest(work.css));
});



//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', () => {
    return gulp.src([dev.js])
        .pipe(rev())
        .pipe(gulp.dest(work.js))
        .pipe(rev.manifest())
        .pipe(gulp.dest(work.js));
});


// 生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revlib', () => {
    return gulp.src(dev.lib)
        .pipe(rev())
        .pipe(gulp.dest(work.lib))
        .pipe(rev.manifest())
        .pipe(gulp.dest(work.lib));
})


// 创建js 成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revAlljs', ['revJs', 'revlib']);



//Html替换css、js文件版本 根据rev-manifest.json 对照映射
gulp.task('revHtml', () => {
    return gulp.src([`${work.home}**/*.json`, `${dev.home}**/*.html`])
        .pipe(revCollector())
        .pipe(gulp.dest(work.home));
});



gulp.task('default', (done) => {
    // condition = false;
    runSequence(       //需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
        ['assetRev'],
        ['revCss'],
        ['revAlljs'],
        ['revHtml'],
        done);
});