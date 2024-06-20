const joi =  require('joi')
const { isValidObjectId } = require('../../middleware/validation.middleware.js')

const addCategorySchema = joi.object({
    name:joi.string().min(2).max(20).required(),
}).required()



const upDateCategorySchema = joi.object({
    name:joi.string().min(2).max(20),
    id:joi.string().custom(isValidObjectId).required()
}).required()


const deleteCategorySchema = joi.object({
    id:joi.string().custom(isValidObjectId).required()
}).required()

module.exports = {
    addCategorySchema,
    upDateCategorySchema,
    deleteCategorySchema
}