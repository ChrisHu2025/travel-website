import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@layouts': path.resolve('./src/layouts'),
            '@components': path.resolve('./src/components'),
            '@content': path.resolve('./src/content'),
            '@pages': path.resolve('./src/pages')
        }
    },
    build: {
        rollupOptions: {
            external: []
        }
    }
});