const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Try to load optional face detection dependencies
let faceapi, canvas;
let faceDetectionAvailable = false;

try {
  canvas = require('canvas');
  faceapi = require('@vladmandic/face-api');
  const { Canvas, Image, ImageData } = canvas;
  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
  faceDetectionAvailable = true;
  console.log('✅ Face detection libraries loaded');
} catch (error) {
  console.log('ℹ️ Face detection libraries not available, will use simple blur');
}

let modelsLoaded = false;

// Load face detection models (only if libraries available)
async function loadModels() {
  if (!faceDetectionAvailable || modelsLoaded) return;

  const modelPath = path.join(__dirname, '../models');

  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    modelsLoaded = true;
    console.log('✅ Face detection models loaded');
  } catch (error) {
    console.log('⚠️ Face detection models not found, will use simple blur');
  }
}

// Process image with face blur
async function processImageWithFaceBlur(inputPath, outputPath) {
  try {
    // If face detection not available, use simple blur
    if (!faceDetectionAvailable) {
      console.log('ℹ️ Using simple blur (face detection not available)');
      await applySimpleBlur(inputPath, outputPath);
      return;
    }

    // Load models if not already loaded
    await loadModels();

    if (!modelsLoaded) {
      console.log('ℹ️ Using simple blur (models not loaded)');
      await applySimpleBlur(inputPath, outputPath);
      return;
    }

    // Load image
    const img = await canvas.loadImage(inputPath);
    const cvs = canvas.createCanvas(img.width, img.height);
    const ctx = cvs.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Detect faces
    const detections = await faceapi.detectAllFaces(cvs);

    if (detections.length === 0) {
      console.log('ℹ️ No faces detected, using simple blur');
      await applySimpleBlur(inputPath, outputPath);
      return;
    }

    console.log(`🔍 Detected ${detections.length} face(s)`);

    // Apply blur to each detected face
    for (const detection of detections) {
      const { x, y, width, height } = detection.box;

      // Expand the box slightly to ensure full face coverage
      const padding = 20;
      const blurX = Math.max(0, x - padding);
      const blurY = Math.max(0, y - padding);
      const blurWidth = Math.min(img.width - blurX, width + padding * 2);
      const blurHeight = Math.min(img.height - blurY, height + padding * 2);

      // Extract face region
      const faceImageData = ctx.getImageData(blurX, blurY, blurWidth, blurHeight);

      // Apply blur effect using canvas filter
      ctx.save();
      ctx.filter = 'blur(15px)';
      ctx.putImageData(faceImageData, blurX, blurY);
      ctx.restore();
    }

    // Save blurred image
    const buffer = cvs.toBuffer('image/jpeg', { quality: 0.9 });
    fs.writeFileSync(outputPath, buffer);

    console.log('✅ Face blur applied successfully');
  } catch (error) {
    console.error('Error in face detection:', error);
    console.log('⚠️ Falling back to simple blur');
    await applySimpleBlur(inputPath, outputPath);
  }
}

// Alternative simpler blur using Sharp (fallback method)
async function applySimpleBlur(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .blur(10)
      .toFile(outputPath);
    console.log('✅ Simple blur applied (fallback method)');
  } catch (error) {
    console.error('Error applying blur:', error);
    fs.copyFileSync(inputPath, outputPath);
  }
}

module.exports = {
  processImageWithFaceBlur,
  applySimpleBlur
};
