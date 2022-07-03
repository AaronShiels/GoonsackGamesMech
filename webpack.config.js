import { dirname, resolve as resolvePath } from "path";
import { fileURLToPath } from "url";
import ResolveTypeScriptPlugin from "resolve-typescript-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";

const config = (env, { mode }) => {
	if (!mode) throw new Error("Mode not provided");
	const debugBuild = mode !== "production";
	const src = "./src/client";
	const dist = "./dist/client";
	var absRoot = dirname(fileURLToPath(import.meta.url));

	console.log(`Mode: ${debugBuild ? "Debug" : "Release"}`);
	console.log(`Root: ${absRoot}\nSource: ${src}\nDistributables: ${dist}`);

	const entry = `${src}/index.ts`;

	const devtool = debugBuild ? "inline-source-map" : false;

	const tsLoaderRule = {
		test: /\.tsx?$/,
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

	const resolveTypeScriptPlugin = new ResolveTypeScriptPlugin();
	const resolve = {
		extensions: [".tsx", ".ts", ".js"],
		plugins: [resolveTypeScriptPlugin]
	};

	var absDist = resolvePath(absRoot, dist);
	const output = { filename: "app.[contenthash].js", path: absDist, clean: true };

	const htmlPluginConfig = new HtmlWebpackPlugin({ title: "GoonSackGames", template: "./src/client/index.html" });
	const definePlugin = new webpack.DefinePlugin({ SERVER_HOST: JSON.stringify(env.SERVER_HOST) });
	// const copyPlugin = new CopyPlugin({ patterns: [{ from: "assets/*/*", context: "./src/client" }] });
	const plugins = [htmlPluginConfig, definePlugin /*, copyPlugin*/];

	return {
		entry,
		mode,
		devtool,
		resolve,
		module,
		output,
		plugins
	};
};

export default config;
