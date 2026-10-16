import sharp from 'sharp';
import { access, readFile } from 'node:fs/promises';

// Use stable filenames, never directory indexes: new folders and removed raw
// exports must not silently assign unrelated photographs to existing assets.
const manifest = JSON.parse(await readFile('public/images/scs/manifest.json', 'utf8'));
for (const [name, filename] of Object.entries(manifest)) {
  const source = `images spc/${filename}`;
  try {
    await access(source);
  } catch {
    // Legacy apparel originals were removed before the new campaign update.
    // Retain their existing derivatives for any external references.
    await access(`public/images/scs/${name}.${name === 'logo' ? 'png' : 'webp'}`);
    console.log(`Retained existing ${name}: original ${filename} is unavailable.`);
    continue;
  }
  if (name === 'logo') {
    await sharp(source).trim().png().toFile('public/images/scs/logo.png');
    await sharp(source).trim().resize(180, 180, { fit: 'contain', background: '#050505' }).png().toFile('src/app/icon.png');
  } else {
    await sharp(source).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 86 }).toFile(`public/images/scs/${name}.webp`);
  }
}
await import('./prepare-shirt-assets.mjs');
