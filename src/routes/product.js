const Product = require('../models/product')
const express = require('express')
const router = new express.Router()

router.post('/product/add', async (req, res) => {
   
    const product = new Product(req.body)


    try{
        //save to Db
        await product.save()

        res.status(201).send({
            success: true,
            product})
    }catch(e) {
        console.log(e)
        res.status(400).send({
            success: false,
            message: "Something went wrong."
        })
    }
})

//"http:\/\/38.242.207.204\/storage\/EventPhotos\/o5r44ii0aoXxdijC8HWW49PGA2NG4Iyunxmx3wmt.jpg"
//"http:\/\/38.242.207.204\/storage\/EventPhotos\/6KngDe7tN0xGiN2qaQuzJM7iAgZJNgcwkD4up6TK.jpg"
//"http:\/\/38.242.207.204\/storage\/EventPhotos\/Tc6b5E4HgncEjBcKWqhZjCTyRxN4MCbHsshlrapY.jpg"
//"http:\/\/38.242.207.204\/storage\/EventPhotos\/9Evuk3dt8AM1ROBFF9463YGZDHsT6K11A4gAUgar.jpg"
//"http:\/\/38.242.207.204\/storage\/EventPhotos\/Nezrn2wGCvL8IwV5wcC675FpnfGnF6UWtM3aoVzT.jpg"
//"http:\/\/38.242.207.204\/storage\/EventPhotos\/vsN5Cb2UsISlJCM427mTB6zgcS7YFtp5oHVQisF0.jpg"

//endpoint for users to get their list of products
router.get('/products', async(req, res) => {

    try{
        const products = await Product.find({})

        res.status(200).send({
            success: true,
            products,
            total_size: products.length,
        })
        console.log(products.length)
    }catch(e){
        console.log(e)
        res.send(404).send({
            success: false,
            message : "Could not fetch products",
            e
        })
    }
})

module.exports = router