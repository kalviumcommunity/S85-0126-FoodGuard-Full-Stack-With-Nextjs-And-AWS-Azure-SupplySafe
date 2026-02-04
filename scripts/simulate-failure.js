const fs = require('fs');
const path = require('path');

const healthRoutePath = path.join(__dirname, '../src/app/api/health/route.ts');
const healthFailRoutePath = path.join(__dirname, '../src/app/api/health/route-fail.ts');

console.log('🔧 Simulating deployment failure...');

// Backup original health route
fs.copyFileSync(healthRoutePath, healthRoutePath + '.backup');

// Replace with failing version
fs.copyFileSync(healthFailRoutePath, healthRoutePath);

console.log('✅ Health check endpoint replaced with failing version');
console.log('📝 To restore, run: node scripts/restore-health.js');
