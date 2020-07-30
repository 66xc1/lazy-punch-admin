const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

module.exports = {
    publicPath: './',
    outputDir: 'dist', // 构建输出目录
    assetsDir: 'static', // 静态资源目录 (js, css, img, fonts)
    css: { // 配置高于chainWebpack中关于css loader的配置
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
    },
    devServer: {
        hot: true,
        open: true,
        host: '0.0.0.0',
        port: 8888,
        https: false,
        //以上的ip和端口是我们本机的;下面为需要跨域的
        proxy: { //配置跨域
            '/api': {
                target: 'http://192.168.201.100:8080/',
                // target: 'http://192.168.1.19:100/', //
                // target: 'http://192.168.201.100:8080/', //
                ws: true,
                changOrigin: true, //允许跨域
                pathRewrite: {
                    '^/api': '' //请求的时候使用这个api就可以
                }
            }

        }
    },
    chainWebpack: config => {
        config.resolve.symlinks(true);
    },
    configureWebpack: {
        performance: {
            hints: false
        },
        plugins: [
            new CompressionWebpackPlugin({
                asset: '[path].gz[query]', // 提示 compression-webpack-plugin@3.0.0的话asset改为filename
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            })
        ]
    }
};
