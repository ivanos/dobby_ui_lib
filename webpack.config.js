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
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ["react-hot", "babel-loader"]
        }, {
            test: /\.html$/,
            loader: "file?name=[name].[ext]"
        }, {
            test: /\.css$/,
            loader: "style!css"
        }]
    }
};
