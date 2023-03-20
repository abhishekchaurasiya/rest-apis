import Joi from "joi";

const productSchema = Joi.object({
    name: Joi.string().required().insensitive(),
    price: Joi.number().required(),
    features: Joi.boolean(),
    rating: Joi.number().optional(),
    size: Joi.string().required(),
    company: Joi.string().valid('micromax', 'apple', 'sumsung', 'dell', 'hp', 'lenovo', 'acer').insensitive(),
    image: Joi.string(),
});

export default productSchema;