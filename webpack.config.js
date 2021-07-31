const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const config = (_, { mode }) => {
	if (!mode) throw new Error("Mode not provided");
	const debugBuild = mode !== "production";
	console.log(`Configuration: ${debugBuild ? "Debug" : "Release"}`);

	const entry = "./src/client/index.ts";

	const devtool = debugBuild ? "inline-source-map" : false;
	const devServer = { contentBase: path.join(__dirname, "dist/client"), port: 8080 };

	const resolve = { extensions: [".ts", ".tsx", ".js", ".jsx", ".json"] };

	const tsLoaderRule = {
		test: /\.ts(x?)$/,
		exclude: /node_modules/,
		use: [
			{
				loader: "ts-loader",
				options: {
					transpileOnly: !debugBuild,
					configFile: "tsconfig.client.json"
				}
			}
		]
	};
	const module = { rules: [tsLoaderRule] };

	const output = { filename: "app.[contenthash].js", path: path.join(__dirname, "dist/client"), clean: true };

	const htmlPluginConfig = new HtmlWebpackPlugin({ title: "GoonSackGames", template: "./src/client/index.html" });
	const copyPlugin = new CopyPlugin({ patterns: [{ from: "assets/*/*", context: "./src/client" }] });
	const plugins = [htmlPluginConfig, copyPlugin];

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
