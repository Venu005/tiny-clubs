#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const size = 1024;
const assetsDir = path.join(__dirname, "..", "assets");

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);

  length.writeUInt32BE(data.length, 0);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function makePng(pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;

  const rows = [];

  for (let y = 0; y < size; y += 1) {
    const row = Buffer.alloc(1 + size * 4);
    row[0] = 0;

    for (let x = 0; x < size; x += 1) {
      const offset = 1 + x * 4;
      const [r, g, b, a] = pixels(x, y);
      row[offset] = r;
      row[offset + 1] = g;
      row[offset + 2] = b;
      row[offset + 3] = a;
    }

    rows.push(row);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", zlib.deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function mix(start, end, amount) {
  return Math.round(start + (end - start) * amount);
}

function distanceFrom(cx, cy, x, y) {
  return Math.hypot(x - cx, y - cy);
}

function paintMark(x, y, transparentBackground) {
  const normalizedY = y / size;
  const background = transparentBackground
    ? [0, 0, 0, 0]
    : [
        mix(17, 32, normalizedY),
        mix(47, 114, normalizedY),
        mix(58, 105, normalizedY),
        255,
      ];

  const cx = size / 2;
  const cy = size / 2;
  const badgeRadius = 330;
  const badgeDistance = distanceFrom(cx, cy, x, y);

  let pixel = background;

  if (badgeDistance < badgeRadius) {
    const edge = Math.min(1, (badgeRadius - badgeDistance) / 48);
    pixel = [
      mix(background[0], 244, edge),
      mix(background[1], 241, edge),
      mix(background[2], 226, edge),
      Math.max(background[3], Math.round(255 * edge)),
    ];
  }

  const roof = y > 330 && y < 500 && Math.abs(x - cx) < 300 - (y - 330) * 1.35;
  if (roof) {
    return [42, 157, 143, 255];
  }

  const leftClub = distanceFrom(390, 575, x, y) < 90;
  const centerClub = distanceFrom(512, 525, x, y) < 105;
  const rightClub = distanceFrom(634, 575, x, y) < 90;
  const stem = x > 484 && x < 540 && y > 575 && y < 735;

  if (leftClub || centerClub || rightClub || stem) {
    return [231, 111, 81, 255];
  }

  return pixel;
}

fs.mkdirSync(assetsDir, { recursive: true });
fs.writeFileSync(
  path.join(assetsDir, "icon.png"),
  makePng((x, y) => paintMark(x, y, false))
);
fs.writeFileSync(
  path.join(assetsDir, "adaptive-icon.png"),
  makePng((x, y) => paintMark(x, y, true))
);
