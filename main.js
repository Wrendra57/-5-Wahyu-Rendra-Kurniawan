const express = require('express');
const app = express();
app.use(express.json());

const { Cars } = require('./models')

// Upload to Cloud
const upload = require("./helpers/fileUploadCloudinary");
const cloudinary = require("./config/cloudinary");


const getCarsHandler = (req, res) => {
    Cars.findAll()
        .then(cars => {
            res.json({
                status: "OK",
                message: "success retriving data",
                data: cars
            })
        })
}
const createCarHandler = (req, res) => {
    const { name, tipemobil, price } = req.body;
    console.log(req.body)
    // validasi
    if (!name || !tipemobil || !price || !req.file) {
        res.status(400).send({
            status: "BAD_REQUEST",
            message: "name, tipemobil, price and image should not be empty",
            data: null,
        })

        return
    }

    // Upload file to cloudinary
    const fileToUpload = req.file;

    const fileBase64 = fileToUpload.buffer.toString("base64");
    const file = `data:${fileToUpload.mimetype};base64,${fileBase64}`;

    cloudinary.uploader.upload(file, (err, result) => {
        console.log(result)
        if (err) {
            res.status(400).send(`Gagal mengupload file ke cloudinary: ${err.message}`);

            return
        }

        Cars.create({
            name: name,
            tipemobil: tipemobil,
            price: price,
            image: result.url
        })
            .then(car => {
                res.json({
                    status: "OK",
                    message: "success create",
                    data: car
                })
            })
            .catch(err => {
                res.status(500).json({
                    status: "INTERNAL_SERVER_ERROR",
                    message: err.message,
                    data: null
                })
            })
    })
    return
}

const getCarDetailHandler = (req, res) => {
    Cars.findOne({
        where: { id: req.params.id }
    })
        .then(car => {
            if (car !== null) {
                res.json({
                    status: "OK",
                    message: "Success retrieving data",
                    data: car
                })


            } else {
                res.status(404).json({
                    status: "NOT_FOUND",
                    message: "Car Not Found",
                    data: null
                })
            }
        })

    return
}

const updateCarHandler = (req, res) => {
    const { name, tipemobil, price } = req.body;

    // validasi
    if (!name || !tipemobil || !price || !req.file) {
        res.send({
            status: "BAD_REQUEST",
            message: "Name, tipemobil, price and image should not be empty",
            data: null
        })

        return
    }

    // Upload file to cloudinary
    const fileToUpload = req.file;

    const fileBase64 = fileToUpload.buffer.toString("base64");
    const file = `data:${fileToUpload.mimetype};base64,${fileBase64}`;

    cloudinary.uploader.upload(file, (err, result) => {
        console.log(result)
        if (err) {
            res.status(400).send(`Gagal mengupload file ke cloudinary: ${err.message}`);

            return
        }

        Cars.update({
            name: name,
            tipemobil: tipemobil,
            price: price,
            image: result.url
        }, {
            where: { id: req.params.id }
        })
            .then(car => {
                res.json({
                    status: "OK",
                    message: "success update",
                    data: car
                })
            })
            .catch(err => {
                res.status(500).json({
                    status: "INTERNAL_SERVER_ERROR",
                    message: err.message,
                    data: null
                })
            })
    })
    return
}

const deleteCarByIDHandler = (req, res) => {
    Cars.destroy({
        where: { id: req.params.id }
    })
        .then(car => {
            console.log(car)
            if (car !== 0) {
                res.json({
                    status: "OK",
                    message: "deleted",
                    data: car
                })
            } else {
                res.status(404).json({
                    status: "NOT_FOUND",
                    message: "data not found",
                    data: null
                })
            }
        })

    return
}
app.get("/api/cars", getCarsHandler)
app.post("/api/cars", upload.single("picture"), createCarHandler)
app.get("/api/cars/:id", getCarDetailHandler)
app.put("/api/cars/:id", upload.single("picture"), updateCarHandler)
app.delete("/api/cars/:id", deleteCarByIDHandler)

app.listen(1000, () => {
    console.log("Server running at http://127.0.0.1:1000")
})