const CopyWebpackPlugin = require("copy-webpack-plugin")
const path = require('path');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';



module.exports = {
    context: __dirname,
    entry: {
        index: './src/index.js'
    },
    target:'node',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
        sourcePrefix: '',
        libraryTarget: 'umd',
        // publicPath: '/dist/'
    },
    amd: {
        // Enable webpack-friendly use of require in Cesium
        toUrlUndefined: true
    },
    node: {
        // Resolve node module use of fs
        fs: 'empty'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        }, {
            test: /\.(png|gif|jpg|jpeg|svg|xml)$/,
            use: [ 'url-loader' ],
        },{
            test: /\.less$/,
            loader: ['less-loader']
        },{
            test:   /\.md/,
            loader: 'markdown-it'
        },{
            test: /\.js$/,
            exclude: /node_modules/,
            loader:'babel-loader'
        }]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     template: 'src/index.html'
        // }),
        // Copy Cesium Assets, Widgets, and Workers to a static directory
        new CopyWebpackPlugin([ { from: path.join(cesiumSource, cesiumWorkers), to: 'Source/Workers' } ]),
        new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Assets'), to: 'Source/Assets' } ]),
        new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Widgets'), to: 'Source/Widgets' } ]),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('Source/')
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist")
    },
    resolve: {
        alias: {
            // Cesium module name
            cesium: path.resolve(__dirname, cesiumSource)
        }
    },
};
