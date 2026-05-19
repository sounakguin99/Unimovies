import sharp from "sharp";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const iconsDir = join(rootDir, "public", "icons");
const logoPath = join(rootDir, "public", "logo.svg");

// Ensure icons directory exists
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

const svgBuffer = readFileSync(logoPath);

// All required icon sizes and their purposes
const icons = [
  // Browser favicon (browser tab)
  { name: "favicon.png", size: 32, bg: "#111827", padding: 4 },

  // PWA / Android icons (manifest.json)
  { name: "icon-72.png",  size: 72,  bg: "#111827", padding: 8 },
  { name: "icon-96.png",  size: 96,  bg: "#111827", padding: 10 },
  { name: "icon-128.png", size: 128, bg: "#111827", padding: 14 },
  { name: "icon-144.png", size: 144, bg: "#111827", padding: 16 },
  { name: "icon-152.png", size: 152, bg: "#111827", padding: 18 },
  { name: "icon-192.png", size: 192, bg: "#111827", padding: 22 },
  { name: "icon-384.png", size: 384, bg: "#111827", padding: 44 },
  { name: "icon-512.png", size: 512, bg: "#111827", padding: 60 },

  // Maskable icon - extra padding for Android adaptive icon safe zone (must be 512x512)
  // Android clips to circle/square - logo must be within the central 80% = 409px safe zone
  { name: "icon-maskable.png", size: 512, bg: "#111827", padding: 100 },

  // Apple touch icon - iOS "Add to Home Screen" (180x180)
  { name: "apple-touch-icon.png", size: 180, bg: "#111827", padding: 20 },
];

console.log("🎬 Generating Unimovies icons from logo.svg...\n");

for (const icon of icons) {
  const logoSize = icon.size - icon.padding * 2;

  // Resize the SVG logo
  const resizedLogo = await sharp(svgBuffer)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Composite onto a dark background
  await sharp({
    create: {
      width: icon.size,
      height: icon.size,
      channels: 4,
      background: { r: 17, g: 24, b: 39, alpha: 1 }, // #111827
    },
  })
    .composite([
      {
        input: resizedLogo,
        top: icon.padding,
        left: icon.padding,
      },
    ])
    .png()
    .toFile(join(iconsDir, icon.name));

  console.log(`  ✅ ${icon.name.padEnd(24)} ${icon.size}x${icon.size}px  (logo: ${logoSize}x${logoSize}px, padding: ${icon.padding}px)`);
}

console.log("\n🚀 All icons generated successfully in public/icons/");
console.log("\nIcon usage summary:");
console.log("  favicon.png         → Browser tab favicon (32x32)");
console.log("  icon-72 to 192      → Android home screen & PWA manifest");
console.log("  icon-384 / 512      → PWA splash screen & install prompt");
console.log("  icon-maskable.png   → Android adaptive icon (safe zone padded)");
console.log("  apple-touch-icon    → iOS 'Add to Home Screen' icon (180x180)");
