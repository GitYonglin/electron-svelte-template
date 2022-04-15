import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path';

console.log('vite_confit', __dirname);
const projectName = process.env.PROJECT_NAME
console.log('vite_confit', projectName);

function html_src() {
  const html = join(__filename, '../', 'index.html');
  console.log('ACC', html)
  const str = readFileSync(html, 'utf-8')
  writeFileSync(html, str.replace(/[src]+="[^\s]*"/, `src="/src/${projectName}/index.ts"`))
  return true;
}
html_src();
// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  plugins: [svelte()],
  base: './',
  // server: {
  //   host: '127.0.0.1',
  //   port: 3000,
  // },
  build: {
    outDir: `./dist/${projectName}`
  }
})
