import { dirname, resolve as resolvePath } from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ResolveTypeScriptPlugin from "resolve-typescript-plugin"; // Maybe remove

const config = (_, { mode }) => {
	if (!mode) throw new Error("Mode not provided");
	const debugBuild = mode !== "production";
	const src = "./src/client";
	const dist = "./dist/client";
	var absRoot = dirname(fileURLToPath(import.meta.url));

	console.log(`Mode: ${debugBuild ? "Debug" : "Release"}`);
	console.log(`Root: ${absRoot}\nSource: ${src}\nDistributables: ${dist}`);

	const entry = `${src}/index.ts`;

	const devtool = debugBuild ? "inline-source-map" : false;
	const devServer = {
		static: {
			directory: dist
		},
		port: 8080
	};

	const resolveTypeScriptPlugin = new ResolveTypeScriptPlugin.default();
	const resolve = {
		extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
		plugins: [resolveTypeScriptPlugin]
	};

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

	var absDist = resolvePath(absRoot, dist);
	const output = { filename: "app.[contenthash].js", path: absDist, clean: true };

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

export default config;
