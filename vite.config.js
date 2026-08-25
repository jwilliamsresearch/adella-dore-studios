import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));
const renderModule = pathToFileURL(resolve(root, 'src/render.js')).href;

/**
 * Renders the page markup at build time (and on every dev request) so the
 * served index.html is complete static HTML rather than a JS-hydrated shell.
 */
function prerender() {
  return {
    name: 'adella-prerender',
    async transformIndexHtml(html) {
      // Import fresh each time so edits to data/render show up in dev.
      const mod = await import(/* @vite-ignore */ `${renderModule}?t=${Date.now()}`);
      return html.replace('<!--#HEAD#-->', mod.renderHead()).replace('<!--#BODY#-->', mod.renderBody());
    },
  };
}

export default defineConfig({
  plugins: [prerender()],
  build: {
    target: 'es2020',
    cssTarget: 'chrome90',
    assetsInlineLimit: 2048,
    reportCompressedSize: true,
  },
});
