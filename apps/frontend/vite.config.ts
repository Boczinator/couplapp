import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
	plugins: [
		tanstackRouter({
			target: 'react',
			autoCodeSplitting: true,
		}),
		svgr(),
		react(),
		babel({ presets: [reactCompilerPreset()] }),
		tailwindcss(),
		visualizer({
			filename: 'stats.html',
			gzipSize: true,
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
		},
	},
	server: {
		host: '0.0.0.0',
		allowedHosts: ['dev.couplapp.com'],
	},
})
