const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
    name: 'PasteParty',
    description: 'PasteParty - Clipboard paste application web server',
    script: path.join(__dirname, 'server.js'),
    nodeOptions: [],
    env: [
        {
            name: 'NODE_ENV',
            value: 'production'
        }
    ]
});

svc.on('install', function() {
    console.log('✅ Service installed successfully!');
    console.log('Starting service...');
    svc.start();
});

svc.on('start', function() {
    console.log('✅ Service started successfully!');
    console.log('PasteParty is now running as a Windows service.');
    console.log('Access it at: http://localhost:8081');
});

svc.on('error', function(err) {
    console.error('❌ Service error:', err);
});

if (process.argv[2] === 'install') {
    svc.install();
} else if (process.argv[2] === 'uninstall') {
    svc.uninstall();
} else if (process.argv[2] === 'start') {
    svc.start();
} else if (process.argv[2] === 'stop') {
    svc.stop();
} else if (process.argv[2] === 'restart') {
    svc.restart();
} else {
    console.log('Usage: node install-service.js [install|uninstall|start|stop|restart]');
}
