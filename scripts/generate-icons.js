/**
 * PWA Icon Generator Script
 * Generates PNG icons from an SVG template for all required PWA sizes.
 * 
 * Usage: node scripts/generate-icons.js
 * 
 * This creates canvas-based PNG icons using the built-in Node.js capabilities.
 * For production, you should replace these with professionally designed icons.
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

/**
 * Generate an SVG icon string for a given size
 */
function generateSVG(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.1 : 0;
  const contentSize = size - padding * 2;
  const centerX = size / 2;
  const centerY = size / 2;

  // Play button triangle dimensions
  const triangleSize = contentSize * 0.3;
  const triLeft = centerX - triangleSize * 0.3;
  const triTop = centerY - triangleSize * 0.5;
  const triRight = centerX + triangleSize * 0.6;
  const triBottom = centerY + triangleSize * 0.5;

  // Film strip elements
  const stripWidth = contentSize * 0.06;
  const stripGap = contentSize * 0.08;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#60A5FA;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#A78BFA;stop-opacity:0.3" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bg)"/>
  
  <!-- Glow circle behind play button -->
  <circle cx="${centerX}" cy="${centerY}" r="${contentSize * 0.32}" fill="url(#glow)" opacity="0.5"/>
  
  <!-- Outer ring -->
  <circle cx="${centerX}" cy="${centerY}" r="${contentSize * 0.35}" fill="none" stroke="url(#accent)" stroke-width="${size * 0.02}" opacity="0.8"/>
  
  <!-- Inner gradient circle -->
  <circle cx="${centerX}" cy="${centerY}" r="${contentSize * 0.28}" fill="url(#accent)" opacity="0.15"/>
  
  <!-- Play button triangle -->
  <polygon points="${triLeft},${triTop} ${triRight},${centerY} ${triLeft},${triBottom}" fill="url(#accent)"/>
  
  <!-- Film strip holes - left side -->
  <rect x="${padding + contentSize * 0.08}" y="${centerY - stripGap * 2}" width="${stripWidth}" height="${stripWidth}" rx="${stripWidth * 0.2}" fill="#3B82F6" opacity="0.5"/>
  <rect x="${padding + contentSize * 0.08}" y="${centerY - stripGap * 0.5}" width="${stripWidth}" height="${stripWidth}" rx="${stripWidth * 0.2}" fill="#3B82F6" opacity="0.5"/>
  <rect x="${padding + contentSize * 0.08}" y="${centerY + stripGap}" width="${stripWidth}" height="${stripWidth}" rx="${stripWidth * 0.2}" fill="#3B82F6" opacity="0.5"/>
  
  <!-- Film strip holes - right side -->
  <rect x="${size - padding - contentSize * 0.08 - stripWidth}" y="${centerY - stripGap * 2}" width="${stripWidth}" height="${stripWidth}" rx="${stripWidth * 0.2}" fill="#8B5CF6" opacity="0.5"/>
  <rect x="${size - padding - contentSize * 0.08 - stripWidth}" y="${centerY - stripGap * 0.5}" width="${stripWidth}" height="${stripWidth}" rx="${stripWidth * 0.2}" fill="#8B5CF6" opacity="0.5"/>
  <rect x="${size - padding - contentSize * 0.08 - stripWidth}" y="${centerY + stripGap}" width="${stripWidth}" height="${stripWidth}" rx="${stripWidth * 0.2}" fill="#8B5CF6" opacity="0.5"/>
</svg>`;
}

// Generate SVG files (browsers can use these directly, and they look crisp at any size)
for (const size of sizes) {
  const svg = generateSVG(size);
  const svgPath = path.join(ICONS_DIR, `icon-${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`✅ Generated: icon-${size}.svg`);
}

// Generate maskable SVG
const maskableSvg = generateSVG(512, true);
fs.writeFileSync(path.join(ICONS_DIR, 'icon-maskable.svg'), maskableSvg);
console.log('✅ Generated: icon-maskable.svg');

// Generate Apple touch icon
const appleSvg = generateSVG(180);
fs.writeFileSync(path.join(ICONS_DIR, 'apple-touch-icon.svg'), appleSvg);
console.log('✅ Generated: apple-touch-icon.svg');

// Generate favicon
const faviconSvg = generateSVG(32);
fs.writeFileSync(path.join(ICONS_DIR, 'favicon.svg'), faviconSvg);
console.log('✅ Generated: favicon.svg');

console.log('\n📌 Note: For production, convert these SVGs to PNGs using a tool like:');
console.log('   - Sharp (npm install sharp)');
console.log('   - ImageMagick (convert icon.svg icon.png)');
console.log('   - Online SVG to PNG converter');
console.log('\n🎉 Icon generation complete!');
