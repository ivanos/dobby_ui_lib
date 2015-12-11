var path = require("path");

module.exports = {
    context: path.join(__dirname, "app"),
    entry: {
        javascript: "./app.js",
        html: "./index.html",
        //css: "./app.css"
    },
    output: {
        path: path.join(__dirname, "www"),
        filename: "app.js"
    },
    devtool: 'source-map',
    devServer: {
        port: 8000,
        proxy: {
            '/*': {
                target: 'http://localhost:8080'
            }
        }
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ["react-hot", "babel-loader?stage=0"]
        }, {
            test: /\.html$/,
            loader: "file?name=[name].[ext]"
        }, {
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.scss$/,
            loader: "style!css!sass"
        }]
    }
};
