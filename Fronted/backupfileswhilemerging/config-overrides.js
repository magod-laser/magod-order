/** @format */

const webpack = require("webpack");

module.exports = {
	webpack: (config) => {
		// Add fallback for Node.js core modules
		config.resolve.fallback = {
			fs: require.resolve("fs-browserify"),
			path: require.resolve("path-browserify"),
			stream: require.resolve("stream-browserify"),
			assert: require.resolve("assert"),
			crypto: require.resolve("crypto-browserify"),
		};

		// Provide process and Buffer globally
		config.plugins.push(
			new webpack.ProvidePlugin({
				process: "process/browser",
				Buffer: ["buffer", "Buffer"],
			})
		);

		return config;
	},
};
