// Root dizinden Backend sunucusunu başlat
const path = require('path');
process.chdir(path.join(__dirname, 'Backend'));
require('./server.js');

