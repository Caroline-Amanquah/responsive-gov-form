const Hapi = require('@hapi/hapi');
const Path = require('path');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // Register the Inert plugin for serving static files
    await server.register(require('@hapi/inert'));

    // Serve static files from the "dist" directory
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: Path.join(__dirname, 'dist'),
                index: ['index.html']  // This will serve "index.html" for the root URL
            }
        }
    });

    // Serve static files from the "public" directory
    server.route({
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: Path.join(__dirname, 'public')
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
