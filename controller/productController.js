let Category = require("../model/Category.js");
let Subcategory = require("../model/Subcategory.js");
let Extracategory = require("../model/Extracategory.js");
const Type = require("../model/Type.js");
const Brand = require("../model/Brand.js");
const Product = require("../model/Product.js");
const path = require('path')
const fs = require('fs')

// --------------------- Prodcut -------------------------
module.exports.addProdcut = async (req, res) => {
    try {
        let catData = await Category.find({});
        let subcatData = await Subcategory.find({});
        let extracatData = await Extracategory.find({});
        let brandData = await Brand.find({});
        let typeData = await Type.find({});
        return res.render('product/add_product', {
            catData: catData,
            subcatData: subcatData,
            extracatData: extracatData,
            brandData: brandData,
            typeData: typeData
        });
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

// ---------------- Add Prodcut -----------------
module.exports.addProductData = async (req, res) => {
    try {
        let MultiImgArrey = [];
        if (req.files) {
            req.body.singleProductImg = Product.SingleImgPath + '/' + req.files.singleProduct[0].filename;

            for (i = 0; i < req.files.multiProduct.length; i++) {
                MultiImgArrey.push(Product.MultiImgPath + '/' + req.files.multiProduct[i].filename);
            }
        }
        else {
            return res.redirect('back')
        }
        if (req.body) {
            req.body.multiProductImg = MultiImgArrey;
            const path = require('path')
            req.body.isActive = true;
            req.body.createDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Product.create(req.body);
            if (data) {
                return res.redirect('back');
            }
            else {
                console.log("Add product Data note store in DB");
                return res.redirect('back')
            }
        }
        else {
            console.log("data not get from Admin form");
            return res.redirect('back')
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// ---------------- View Type -----------------
module.exports.viewProduct = async (req, res) => {
    try {
        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.page) {
            page = req.query.page;
        }
        else {
            page = 0;
        }
        var perPage = 5;
        let ProdcutData = await Product.find({
            $or: [
                { 'name': { $regex: `.*${search}.*`, $options: "i" } },
            ]
        }).limit(perPage)
            .skip(perPage * page)
            .populate('categoryId')
            .populate('subcategoryId')
            .populate('typeId')
            .populate('brandId')
            .populate('extracategoryId').exec();

        var totalDocumets = await Product.find({
            $or: [
                { 'name': { $regex: `.*${search}.*`, $options: "i" } },
            ]
        }).countDocuments();
        let totalPages = Math.ceil(totalDocumets / perPage);
        if (ProdcutData) {
            return res.render('product/view_product', {
                ProdcutData: ProdcutData,
                search: search,
                totalDocumets: totalPages,
                currentPage: page,
            });
        }
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

// -------------Active butotom ---------------
module.exports.active = async (req, res) => {
    try {
        let ProductData = await Product.findById(req.params.id);
        ProductData.isActive = false;
        await ProductData.save();
        return res.redirect('back')
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// -------------Deactive butotom ---------------
module.exports.deactive = async (req, res) => {
    try {
        let ProductData = await Product.findById(req.params.id);
        ProductData.isActive = true;
        await ProductData.save();
        return res.redirect('back')
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// -------------delete butotom ---------------
module.exports.delete = async (req, res) => {
    try {
        let ProductData = await Product.findById(req.params.id)

        if (ProductData) {

            if (ProductData.singleProductImg) {
                fs.unlinkSync(path.join(__dirname, "..", ProductData.singleProductImg))
            }
            else {
                console.log("single Image not found");
                return res.redirect('back');
            }

            if (ProductData.multiProductImg) {
                for (i = 0; i < ProductData.multiProductImg.length; i++) {
                    fs.unlinkSync(path.join(__dirname, "..", ProductData.multiProductImg[i]))
                }
            }
            else {
                console.log("multiple Image not found");
                return res.redirect('back');
            }

            await Product.findByIdAndDelete(req.params.id);

            return res.redirect('back')
        }
        else {
            console.log("Product data not foud")
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// // ---------------- Update Data -----------------
module.exports.update = async (req, res) => {
    try {
        let ProductData = await Product.findById(req.params.id);
        let catData = await Category.find();
        let subcatData = await Subcategory.find();
        let extracatData = await Extracategory.find();
        let brandData = await Brand.find();
        let typeData = await Type.find();
        return res.render('product/update_product', {
            ProdcutData: ProductData,
            catData: catData,
            subcatData: subcatData,
            extracatData: extracatData,
            brandData: brandData,
            typeData: typeData
        });
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

module.exports.UpdatedData = async (req, res) => {
    try {
        let ProductData = await Product.findById(req.body.id);
        if (req.files) {
            if (req.files.singleProduct) {
                fs.unlinkSync(path.join(__dirname, "..", ProductData.singleProductImg))
                req.body.singleProductImg = Product.SingleImgPath + '/' + req.files.singleProduct[0].filename
            };
            if (req.files.multiProduct) {
                let MultiImgArrey = [];
                for (i = 0; i < ProductData.multiProductImg.length; i++) {
                    fs.unlinkSync(path.join(__dirname, "..", ProductData.multiProductImg[i]))
                }

                for (i = 0; i < req.files.multiProduct.length; i++) {
                    MultiImgArrey.push(Product.MultiImgPath + '/' + req.files.multiProduct[i].filename);
                }

                req.body.multiProductImg = MultiImgArrey;
            }
        };
        if (req.body) {
            req.body.updateDate = new Date().toLocaleString();
            let updateData = await Product.findByIdAndUpdate(req.body.id, req.body);
            if (updateData) {
                return res.redirect('/admin/Product/view_product');
            }
            else {
                return res.redirect('back');
            }
        }
        else {
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('/admin/Product/view_product')
    }
}


// ---------------- remove One Img ------------------
module.exports.removeOneImg = async (req, res) => {
    try {
        let ProdcutData = await Product.findById(req.body.ProductId);
        if (ProdcutData) {
            fs.unlinkSync(path.join(__dirname,'..',req.body.path));
            let deletImg = ProdcutData.multiProductImg.splice(req.body.index, 1);
            if (deletImg) {
                await Product.findByIdAndUpdate(req.body.ProductId,ProdcutData);
                return res.render('product/deleteOneImg',{
                    ProId:req.body.ProductId,
                    Data : ProdcutData.multiProductImg
                })
            }
            else {
                console.log('Image Not delete in Mongodb');
                return res.redirect('back');
            }
        }
        else {
            console.log("Product Data not found");
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}