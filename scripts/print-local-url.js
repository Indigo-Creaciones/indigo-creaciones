const os = require('os');

function getLocalExternalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const port = 5100; // Puerto fijo para que coincida con Next.js
const ip = getLocalExternalIp();
console.log(`- Celular:      http://${ip}:${port}`);
