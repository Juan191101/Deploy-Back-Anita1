const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_secret: process.env.API_SECRET,
    api_key: process.env.API_KEY
})

module.exports = cloudinary;