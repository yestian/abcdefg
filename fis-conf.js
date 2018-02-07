//使用commonjs模块
fis.hook('commonjs', {  
    paths: {
        designnode:'/static/js/components-design.js'
    }
});

// widget源码目录下的资源被标注为组件
//标为组件的js会自动添加define声明，组件都hi匿名方式
fis.match('/widget/**/*', {
    isMod: true,
    release:'/static/$0'
});

fis.match('/static/js/*.js',{
    isMod:true
});

fis.match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    })
});

//开启同名依赖
fis.match('*.{html,js,css}', {
    useSameNameRequire: true
  });



































//FIS3 会读取全部项目目录下的资源，如果有些资源不想被构建，通过以下方式排除
/* fis.set('project.ignore', [
    'node_modules/**',
    '.git/**',
    'package.json',
    'fis-conf.js'
]); */

//发布到tp5目录，设置后只需直接fis3 release即可
//   /user 直接到D盘根目录
/* fis.match('*.html', {
    deploy: fis.plugin('local-deliver', {
        to: '../../tp5/application/tpl/view/site'
    })
});
 */










// optimize
fis.media('prod')
    .match('*.js', {
        optimizer: fis.plugin('uglify-js', {
            mangle: {
                expect: ['require', 'define', 'some string'] //不想被压的
            }
        })
    })
    .match('*.css', {
        optimizer: fis.plugin('clean-css', {
            'keepBreaks': true //保持一个规则一个换行
        })
    });

// pack
fis.media('prod')
    // 启用打包插件，必须匹配 ::package
    .match('::package', {
        packager: fis.plugin('map'),
        spriter: fis.plugin('csssprites', {
            layout: 'matrix',
            margin: '15'
        })
    })
    .match('/widget/**/*.js', {
        packTo: '/static/designer.js'
    })
    .match('/static/js/*.js', {
        packTo: '/static/jquery2.js'
    })
    .match('/widget/**/*.css', {
        packTo: '/static/designer.css'
    });