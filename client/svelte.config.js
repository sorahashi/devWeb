import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			out: 'build',
			routes: (filepath) => !filepath.includes('/api/')
		})
	}
};

export default config;
