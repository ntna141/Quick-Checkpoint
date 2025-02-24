const esbuild = require("esbuild");
const path = require('path');
const fs = require('fs');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

const wasmPath = path.join(__dirname, 'node_modules/sql.js/dist/sql-wasm.wasm');

const config = {
	entryPoints: ['./src/extension.ts'],
	bundle: true,
	external: ['vscode'],
	format: 'cjs',
	platform: 'node',
	outfile: 'dist/extension.js',
	sourcemap: !production,
	minify: production,
	define: {
		'process.env.SQLJS_WASM_PATH': JSON.stringify('./sql-wasm.wasm'),
	},
	logLevel: 'info',
	loader: {
		'.wasm': 'file'
	}
};

async function main() {
	const ctx = await esbuild.context(config);
	if (watch) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}

main().catch(e => {
	console.error('Build failed:', e);
	process.exit(1);
});
