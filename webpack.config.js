const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const config = (_, { mode }) => {
    // Determine environment
    mode = mode || "development";
    const isProduction = mode === "production";
    console.log(`Mode: ${mode}.`);

    // Derive configuration
    const context = path.resolve(__dirname, 'src');
    const entry = { index: "./index.ts" };
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
    const htmlPluginConfig = new HtmlWebpackPlugin({ title: "GoonSackGames - Cyborg", template: path.resolve(__dirname, "src/index.html") });
    const copyPlugin = new CopyPlugin({ patterns: [{ from: "assets", to: "assets" }] });
    const plugins = [cleanWebpackPlugin, htmlPluginConfig, copyPlugin];

    return {
        context,
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