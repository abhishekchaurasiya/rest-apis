import { ProductModel } from "../model";
import multer from "multer";
import path from 'path';
import fs from "fs"
import CustomErrorHandler from "../service/CustomErrorHandler";
import productSchema from "../validators/productValidotor";
import mongoose from "mongoose";
let objectid = mongoose.Types.ObjectId;

// Initial configration from multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        // image file ka unique name create karna 
        let uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
});

// store image in database
const handleMultiPartFormData = multer({
    storage,
    limits: {
        fileSize: 1000000 * 5  // or fileSize: 5 * 1024 * 1024 = 5mb
    }
}).single('image');


const productController = {
    //*******************  Create a product **************************** //
    async store(req, res, next) {
        // multipart/form-data
        // Multipart form data ki service by default Express.js me provide nahi hai then use Multer NPM library ka use karte hai 
        handleMultiPartFormData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            const filePath = req.file.path;

            // validation for request fileds
            const { error } = productSchema.validate(req.body)
            if (error) {
                // Delete the upload file means request hit karne par request success nahi hoti to upload file ko delete ho jaye
                // Here create a rootpat like (rootfolder/uploads/filename.jpg)
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    // error is callback parameter then call automatically
                    if (err) {
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                })
                // this is validation error
                return next(error)
            }
            const { name, price, features, rating, company, size } = req.body;
            let document;
            try {
                document = await ProductModel.create({
                    name, price, features, rating, company, size,
                    image: filePath
                })
            } catch (error) {
                return next(error)
            }
            res.status(201).json(document)
        })
    },

    //*******************  Update a product **************************** //
    async update(req, res, next) {
        let productId = req.params.id;
        if (!objectid.isValid(productId)) {
            return next(new Error("Not valid product id."))
        }
        handleMultiPartFormData(req, res, async (err) => {
            if (err) { return next(CustomErrorHandler.serverError(err.message)) }
            // Here update method working and image ko optional karte hai and request file hai to tabhi change karte hai 
            let filePath;
            if (req.file) {
                filePath = req.file.path;
            }

            // validation for request fileds
            const { error } = productSchema.validate(req.body)
            if (error) {
                // Delete the upload file means request hit karne par request success nahi hoti to upload file ko delete ho jaye
                // Here create a rootpat like (rootfolder/uploads/filename.jpg)
                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        // error is callback parameter then call automatically
                        if (err) {
                            return next(CustomErrorHandler.serverError(err.message));
                        }
                    })
                }
                // this is validation error
                return next(error)
            }
            const { name, price, size } = req.body;
            let document;
            try {
                document = await ProductModel.findOneAndUpdate({ _id: req.params.id }, {
                    name,
                    price,
                    size,
                    ...(req.file && { image: filePath }) // use here spread operator  and optional karne ke liye
                }, { new: true })
            } catch (error) {
                return next(error)
            }
            res.status(201).json(document)
        })
    },

    //*******************  Delete a product **************************** //
    async deleteProduct(req, res, next) {
        let productId = req.params.id;
        if (!objectid.isValid(productId)) {
            return next(new Error("Not valid product id."))
        }

        const document = await ProductModel.findOneAndRemove({ _id: req.params.id }, { new: true });
        if (!document) {
            return next(new Error("This product already deleted"));
        }

        // image delete
        const imagepath = document._doc.image;

        fs.unlink(`${appRoot}/${imagepath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError())
            }
        });
        res.json({ message: "Product is deleted", document })
    },

    //*******************  Get All Product list **************************** //
    async getProductList(req, res, next) {
        let { company, name, features, size, sort, select } = req.query;
        let queryObject = {};
        if (company) {
            queryObject.company = company;
        }
        if (name) {
            queryObject.name = { $regex: name, $options: "i" }
        }
        if (features) {
            queryObject.features = features;
        }
        if (size) {
            queryObject.size = { $regex: size, $options: 1 };
        }

        // sorting 
        let apiData = ProductModel.find(queryObject);
        if (sort) {
            let sortFix = sort.split(",").join(" ");
            console.log(sortFix)
            apiData = apiData.sort(sortFix)
        }
        if (select) {
            // let selectFix = select.replace(",", " ");
            let selectFix = select.split(",").join(" ");
            console.log(selectFix)
            apiData = apiData.select(selectFix)
        }
        // Using pagination of mongoose-pagination library
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 3;
        let skip = (page - 1) * limit;
        apiData = apiData.skip(skip).limit(limit);

        let document;
        try {
            document = await apiData.select("-updatedAt -__v").sort('name')
        } catch (error) {
            return next(CustomErrorHandler.serverError())
        }
        res.status(200).json({ products: document, nbHits: document.length })
    },

    //*******************  Get All Product list **************************** //

    async getSingleProduct(req, res, next) {
        let productId = req.params.id;
        if (!objectid.isValid(productId)) {
            return next(new Error("Not valid product id."))
        }

        let document;
        try {
            document = await ProductModel.findById({ _id: productId }).select('-__v -updatedAt')
        } catch (error) {
            return next(CustomErrorHandler.serverError())
        }
        if (!document) {
            return res.status(200).json({ msg: "Product is deleted!" })
        }
        res.status(200).json(document)
    }
}

export default productController;

