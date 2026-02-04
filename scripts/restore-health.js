const fs = require('fs');
const path = require('path');

const healthRoutePath = path.join(__dirname, '../src/app/api/health/route.ts');
const backupPath = healthRoutePath + '.backup';

console.log('🔄 Restoring original health check endpoint...');

if (fs.existsSync(backupPath)) {
  fs.copyFileSync(backupPath, healthRoutePath);
  fs.unlinkSync(backupPath);
  console.log('✅ Health check endpoint restored to original version');
} else {
  console.log('❌ No backup found. Please manually restore the health check endpoint.');
}
