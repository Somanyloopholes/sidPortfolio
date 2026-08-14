const fs = require('fs');
const path = require('path');

const videoPath = path.join(__dirname, 'src', 'assets', 'landingPageDithered.mp4');
const outputPath = path.join(__dirname, 'src', 'assets', 'landingPageVidData.ts');

try {
  const videoBuffer = fs.readFileSync(videoPath);
  const base64Video = videoBuffer.toString('base64');
  const fileContent = `export const landingPageVidBase64 = 'data:video/mp4;base64,${base64Video}';\n`;
  
  fs.writeFileSync(outputPath, fileContent);
  console.log('Successfully generated Base64 video file!');
} catch (error) {
  console.error('Error generating file:', error.message);
}
