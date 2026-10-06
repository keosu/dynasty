import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Reuse the existing vector brand mark; no fonts or external images required.
const source = await readFile(new URL('../public/favicon.svg', import.meta.url));
const directory = new URL('../public/icons/', import.meta.url);
await mkdir(directory, { recursive: true });
for (const [name, size] of [
  ['pwa-192', 192],
  ['pwa-512', 512],
  ['apple-touch-icon', 180],
]) {
  await sharp(source)
    .resize(size, size)
    .png()
    .toFile(fileURLToPath(new URL(`${name}.png`, directory)));
}
// Keep the complete mark inside the maskable icon's central safe zone.
const mark = await sharp(source).resize(360, 360).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#256787' } })
  .composite([{ input: mark, gravity: 'centre' }])
  .png()
  .toFile(fileURLToPath(new URL('maskable-512.png', directory)));
