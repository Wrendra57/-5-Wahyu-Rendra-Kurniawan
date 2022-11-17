const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: "dhtypvjsk",
    api_key: "288711213593925",
    api_secret: "rCvBQ9jbETpNtG_B7Aec13Zel3U",
    secure: true
});

module.exports = cloudinary;