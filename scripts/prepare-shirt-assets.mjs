import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

// Explicit filenames keep selections stable as the raw folder grows.
const selections = {
  'campaign-hero': 'DSC06999-sharpen-standard-face-recovery-v3.jpg',
  'campaign-shirt': 'DSC07041-sharpen-standard-face-recovery-v3.jpg',
  'campaign-flatlay': 'DSC06979-sharpen-standard-face-recovery-v3.jpg',
  'campaign-group': 'DSC07127-unblur.jpg',
  'campaign-portrait': 'DSC06983-sharpen-standard-face-recovery-v3.jpg',
  'campaign-detail': 'DSC07057-sharpen-standard-face-recovery-v3.jpg',
  'campaign-door': 'DSC07048-sharpen-standard-face-recovery-v3.jpg',
};
const output = 'public/images/scs';
await mkdir(output, { recursive: true });
const manifest = {};
for (const [name, filename] of Object.entries(selections)) {
  const source = `images spc/shirt pics/${filename}`;
  const result = await sharp(source).rotate()
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88 }).toFile(`${output}/${name}.webp`);
  manifest[name] = { source, width: result.width, height: result.height, bytes: result.size };
}
await writeFile(`${output}/shirt-manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log('Prepared seven campaign images; raw originals are unchanged.');
