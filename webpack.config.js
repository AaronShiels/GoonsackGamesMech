const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = (_, { mode }) => {
    // Determine environment
    mode = mode || "development";
    const isProduction = mode === "production";
    console.log(`Mode: ${mode}.`);

    // Derive configuration
    const entry = { index: "./src/index.ts" };
    const devtool = isProduction ? false : "inline-source-map";
    const devServer = {
        contentBase: path.join(__dirname, 'dist'),
        port: 8080
    };
    const resolve = {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    };
    const tsLoaderRule = {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
            {
                loader: "ts-loader",
                options: {
                    transpileOnly: isProduction
                }
            }
        ]
    };
    const module = { rules: [tsLoaderRule] };
    const output = {
        filename: "app.[contenthash].js",
        path: path.resolve(__dirname, "dist")
    };
    const cleanWebpackPlugin = new CleanWebpackPlugin({ cleanStaleWebpackAssets: false });
    const htmlPluginConfig = new HtmlWebpackPlugin({ title: "GoonSackGames - Cyborg" });
    const plugins = [cleanWebpackPlugin, htmlPluginConfig];

    return {
        entry,
        mode,
        devtool,
        devServer,
        resolve,
        module,
        output,
        plugins
    };
};

module.exports = config;