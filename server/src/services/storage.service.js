var Imagekit = require("imagekit");

var imagekit = null;

if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
    imagekit = new Imagekit({
        publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
    });
}

async function uploadFile(file, fileName) {
    
    if (!imagekit) {
        console.warn('ImageKit not configured. Image upload skipped.');
        return {
            url: 'https://via.placeholder.com/400x300?text=Event+Image',
            fileId: 'local_' + Date.now(),
            name: fileName
        };
    }

    const result = await imagekit.upload({
        file: file,
        fileName: fileName
    });
    return result;
}

module.exports = {
    uploadFile
}