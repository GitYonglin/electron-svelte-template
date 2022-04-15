import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path';

export function html_src(projectName: string) {
  console.log('ACC', (join(__filename, '../../', 'index.html')))
  const html = join(__filename, '../../', 'index.html');
  console.log('ACC', html)
  const str = readFileSync(html, 'utf-8')
  writeFileSync(html, str.replace(/[src]+="[^\s]*"/, `src="/src/${projectName}.ts"`))
  return true;
}
