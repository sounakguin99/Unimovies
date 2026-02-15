const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

async function convertSvgToPng(inputName, outputName, size) {
  const inputPath = path.join(ICONS_DIR, inputName);
  const outputPath = path.join(ICONS_DIR, outputName);
  
  try {
    await sharp(inputPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✅ Converted: ${outputName} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ Failed to convert ${inputName}:`, error.message);
  }
}

async function main() {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  for (const size of sizes) {
    await convertSvgToPng(`icon-${size}.svg`, `icon-${size}.png`, size);
  }
  
  // Maskable icon
  await convertSvgToPng('icon-maskable.svg', 'icon-maskable.png', 512);
  
  // Apple touch icon
  await convertSvgToPng('apple-touch-icon.svg', 'apple-touch-icon.png', 180);
  
  // Favicon
  await convertSvgToPng('favicon.svg', 'favicon.png', 32);
  
  console.log('\n🎉 All icons converted to PNG!');
}

main().catch(console.error);
