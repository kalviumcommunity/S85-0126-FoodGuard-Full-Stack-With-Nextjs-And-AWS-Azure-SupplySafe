const fs = require('fs');
const path = require('path');
const {glob} = require('glob');

// Find all TSX and TS files
glob('src/**/*.{tsx,ts}', {cwd: __dirname + '/..'}).then(files => {
  files.forEach(file => {
    const fullPath = path.join(__dirname, '..', file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix </Badge>; followed by closing paren
    content = content.replace(/(<\/Badge>);(\s+)\);/g, '$1$2);');
    
    // Fix self-closing tags with semicolon
    content = content.replace(/(\/>);(\s+)\);/g, '$1$2);');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed: ${file}`);
  });
  console.log('All files fixed!');
}).catch(err => console.error(err));
