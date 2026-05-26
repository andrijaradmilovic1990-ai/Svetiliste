const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawIcon(size, maskable) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const pad = maskable ? size * 0.1 : 0;
  const r = maskable ? size * 0.18 : size * 0.22;

  // Background
  ctx.fillStyle = '#0d0d0d';
  if (maskable) {
    ctx.fillRect(0, 0, size, size);
  } else {
    ctx.beginPath();
    ctx.moveTo(r, 0); ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();
  }

  // Gold "B"
  const fontSize = Math.round((size - pad * 2) * 0.62);
  ctx.fillStyle = '#c8a96e';
  ctx.font = `bold ${fontSize}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('B', size / 2, size / 2 + fontSize * 0.04);

  return canvas.toBuffer('image/png');
}

const outDir = path.join(__dirname, 'pwa');
fs.writeFileSync(path.join(outDir, 'icon-192.png'), drawIcon(192, false));
fs.writeFileSync(path.join(outDir, 'icon-512.png'), drawIcon(512, false));
fs.writeFileSync(path.join(outDir, 'icon-maskable.png'), drawIcon(512, true));
console.log('Icons generated.');
