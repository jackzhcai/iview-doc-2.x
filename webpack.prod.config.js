/**
 * Created by aresn on 16/7/5.
 */

var webpack = require('webpack');
var config = require('./webpack.base.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var fs = require('fs');
var CleanWebpackPlugin = require('clean-webpack-plugin')

// 必须带斜杠，注意千万别和out路径搞混调
// 本地build无法正常运行，除非是/dist/. 
// 代表的意思是所有资源的根路径，github pages是以项目为根路径的,所以...
config.output.publicPath = '/iview-docs/dist/';
config.output.filename = '[name].[hash].js';                 // 带hash值的入口js名称
config.output.chunkFilename = '[name].[hash].chunk.js';      // 带hash值的路由js名称


config.plugins = (config.plugins || []).concat([
    new CleanWebpackPlugin(['docs']),
    new ExtractTextPlugin({
        filename: '[name].[hash].css',
        disable: false,
        allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        filename: 'vendors.[hash].js'
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    new HtmlWebpackPlugin({
        // ../doc/index.html => docs/docs/index.html
        // ../index.html => docs/index.html
        filename: '../index.html',
        template: './src/template/index.ejs',
        inject: false
    })
]);

// 写入环境变量
fs.open('./src/config/env.js', 'w', function (err, fd) {
    var buf = 'export default "production";';
    fs.write(fd,buf,0,buf.length,0,function(err,written,buffer){});
});

module.exports = config;