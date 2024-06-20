const express  = require('express')
const router = express.Router()

const isAuthenticated = require('../../middleware/authentication.middeleware.js')
const isAuthorized = require('../../middleware/authoriztion.middelware.js')
const fileUpload = require('../../utils/fileUpload.js')
const {validation} = require('../../middleware/validation.middleware.js')

const  {createProductSchema, deleteProductVal} = require('./product.validation.js') 
const  { createProduct, deleteProduct, getAllProducts } = require('./product.controller.js') 

const reviewRouter = require('../Qesustion/Questions.routes.js')


router.use("/:productId/Review",reviewRouter)

router.post("/",
isAuthenticated,
isAuthorized("admin","user"),
fileUpload().fields([ {name:"defaultImage",maxCount:1} ,{name:"images",maxCount:3}]),
validation(createProductSchema),
createProduct)


router.delete("/:id",
isAuthenticated,
isAuthorized("admin"),
validation(deleteProductVal),
deleteProduct
)


router.get("/",getAllProducts)


module.exports = router