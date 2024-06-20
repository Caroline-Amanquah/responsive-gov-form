// server.js
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

      // Route to handle form submissions
    // server.route({
    //     method: 'POST',
    //     path: '/submit-form',
    //     options: {
    //         payload: {
    //             output: 'stream',
    //             parse: true,
    //             allow: 'multipart/form-data' // Important for file uploads
    //         }
    //     },
    //     handler: async (request, h) => {
    //         const data = request.payload;

    //         // Process the form data here

    //         // Extract text inputs
    //         const fullName = data.fullName;
    //         const email = data.eventName;
    //         const nationalInsuranceNumber = data.nationalInsuranceNumber;
    //         const password = data['password-input-with-error-message'];
    //         const dateOfBirth = `${data['passport-issued-day']}-${data['passport-issued-month']}-${data['passport-issued-year']}`;
    //         const placeOfOrigin = data.whereDoYouLive;
    //         const telephoneNumber = data.telephoneNumber;

    //         // Extract checkbox inputs
    //         const accountPurpose = [];
    //         if (data.waste) accountPurpose.push('Benefits and Financial Services');
    //         if (data['waste-2']) accountPurpose.push('Personal and Family Services');
    //         if (data['waste-3']) accountPurpose.push('Travel and Legal Services');

    //         // Process file upload
    //         const file = data.fileUpload1;
    //         let filePath = null;
    //         if (file && file.hapi && file.hapi.filename) {
    //             const filename = file.hapi.filename;
    //             filePath = Path.join(__dirname, 'uploads', filename);
    //             const fileStream = fs.createWriteStream(filePath);
    //             file.pipe(fileStream);

    //             await new Promise((resolve, reject) => {
    //                 file.on('end', (err) => {
    //                     if (err) {
    //                         reject(err);
    //                     } else {
    //                         resolve();
    //                     }
    //                 });
    //             });
    //         }

    //         // Logging the processed data
    //         console.log({
    //             fullName,
    //             email,
    //             nationalInsuranceNumber,
    //             password,
    //             dateOfBirth,
    //             placeOfOrigin,
    //             telephoneNumber,
    //             accountPurpose,
    //             filePath
    //         });

    //         return h.response('Form submitted successfully').code(200);
    //     }
    // });



    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
