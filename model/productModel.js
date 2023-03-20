
import mongoose from "mongoose";
import { APP_URL } from "../config";
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    price: {
        type: Number,
        required: [true, 'Price must be privided!'],
        trim: true,
    },
    features: {
        type: Boolean,
        default: true,
        trim: true,
    },
    rating: {
        type: Number,
        default: 1,
        trim: true,
    },
    size: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        enum: {
            values: ['micromax', 'apple', 'sumsung', 'dell', 'hp', 'lenovo', 'acer'],
            message: `{values} is not supported`
        },
        lowercase: true
    },
    // Here will be store image path in database becuase path is a string
    image: {
        type: String,
        required: true,
        get: (image) => {
            // http://localhost:4000/uploads\1674112011388-185122547.jpg
            return `${APP_URL}/${image}`;
        }
    }

}, { timestamps: true, toJSON: { getters: true }, id: false })  // mongoose ko batana padta hai ki jo getter ko create kiya gaya hai now you can use it.

// productSchema.pre("save", function (next) {
//     this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
//     next();
// });

export default mongoose.model("Product", productSchema, 'products')


