const joi =  require('joi')
const { isValidObjectId } = require('../../middleware/validation.middleware.js')


const createProductSchema = joi.object({
name:joi.string().min(2).max(20).required(),
description:joi.string().min(10).max(500),
quantity:joi.number().integer().min(1),
price:joi.number().integer().min(1).required(),
discount:joi.number().min(0).max(100),
Category:joi.string().custom(isValidObjectId).required(),
subCategory:joi.string().custom(isValidObjectId).required(),
brand:joi.string().custom(isValidObjectId).required(),
}).required()



const deleteProductVal = joi.object({
id:joi.string().custom(isValidObjectId).required()
}).required()


module.exports = {
    createProductSchema,
    deleteProductVal
}