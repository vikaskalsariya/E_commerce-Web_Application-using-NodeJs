const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");
const ExtraCategory = require("../model/ExtraCategory");
const Product = require("../model/Product");
const fs = require("fs");
const path = require("path");

// Add Product
module.exports.addProduct = async (req,res) => {
    try {
        
        let categories = await Category.find({});
        let subCategories = await SubCategory.find({});
        let exCategories = await ExtraCategory.find({});
        if(categories){
            return res.render("Product/addProduct",{
                categories : categories,
                subCategories : subCategories,
                exCategories : exCategories
            });
        }
        else{
            console.log("Data not found");
            return res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : "+error);
        return res.redirect("back");
    }
}

module.exports.insertProduct = async (req,res) => {
    
    try {
        let pri_image = "";
        let multi_image = [];
        if(req.files){

            pri_image = Product.priImagePath + "/" + req.files.pri_image[0].filename;
            req.body.pri_image = pri_image;
            
            req.files.multi_image.map((v,i)=> {
                multi_image.push(Product.multiImagePath + "/" + v.filename);
            })
            req.body.multi_images = multi_image;

        } 
        else{
            console.log("File not found");
            res.redirect("back");
        }
        if(req.body){
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            let data = await Product.create(req.body);
            if(data){
                res.redirect("/admin/product/viewProducts");
                console.log("Inserted successfully");
            }
            else{
                console.log("Something wrong");
                res.redirect("back");
            }
        }
        else{
            console.log("Data not found")
            res.redirect("back");
        }
    } catch (error) {
        console.log("Something wrong");
        res.redirect("back");
    }

}

// View Product Data
module.exports.viewProducts = async (req,res) => {
    try {
        
        let adData = req.user;
        let search = '';
        let page = 0;

        if(req.query.page){
            page = req.query.page
        }
        let perPage = 2;

        if(req.query.search)
        {
            search = req.query.search;
        }
        if (adData) {
            let data = await Product.find({
                $or : [
                    {'title' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).populate("categoryId").populate("subCategoryId")
            .populate("exCategoryId").populate("brandId").populate("typeId")
            .limit(perPage)
            .skip(perPage*page).exec();

            let totalDocumets = await Product.find({
                $or : [
                    {'title' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).countDocuments();

            let totalPages = Math.ceil(totalDocumets/perPage);
            if(data){
                res.render("product/viewProducts",{
                    adData : data,
                    search : search,
                    totalPages : totalPages,
                    currentPage : page
                })
            }
        }
        else{
            console.log("No data found")
            res.redirect("/admin/dashboard");
        }

    } catch (error) {
        console.log("Something wrong : "+error);
    }
}


// Deactive Product
module.exports.deactive = async (req,res) => {
    try {
        if(req.params.id){
            let record = await Product.findByIdAndUpdate(req.params.id, {isActive : false});
            if(record){
                res.redirect("/admin/product/viewProducts");
            }
            else{
                console.log("Record not updated");
                res.redirect("back");
            }
        }
        else{
            console.log("Record not found");
            res.redirect("back");
        }
    } catch (error) {
        console.log("Record not found");
        res.redirect("back");
    }
}

// Active Extra Category
module.exports.active = async (req,res) => {
    try {
        if(req.params.id){
            let record = await Product.findByIdAndUpdate(req.params.id, {isActive : true});
            if(record){
                res.redirect("/admin/product/viewProducts")
            }
            else{
                console.log("Record not updated");
                res.redirect("back");
            }
        }
        else{
            console.log("Record not found");
            res.redirect("back");
        }
    } catch (error) {
        console.log("Record not found");
        res.redirect("back");
    }
}

// Delete Product
module.exports.deleteData = async (req,res) => {
    try {
        if(req.params.id){
            let data = await Product.findByIdAndDelete(req.params.id);
            if(data){
                if(data.pri_image){
                    fs.unlinkSync(path.join(__dirname,"..",data.pri_image));
                }
                if(data.multi_images){
                    data.multi_images.map((v)=> {
                        fs.unlinkSync(path.join(__dirname,"..",v));
                    }) 
                }

                res.redirect("/admin/product/viewProducts");
            }
        }
        else{
            console.log("Record not found")
            res.redirect("back");
        }
    } catch (error) {
        console.log("Something wrong");
        res.redirect("back");
    }
}

// Update Product
module.exports.updateData = async (req,res) => {
    try {
        
        let data = await Product.findById(req.params.id);
        if(data){
            return res.render("Product/updateData",{
                proData : data
            })
        }
        else{
            console.log("Data not found");
            return res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : "+error);
        return res.redirect("back");
    }
}

// Edit Data
module.exports.editProduct = async (req,res) => {
    try {

        let data = await Product.findById(req.body.oldId);

        if(req.files){
            let pri_image = "";
            let multi_image = [];

            if(req.files.pri_image){
                pri_image = Product.priImagePath + "/" + req.files.pri_image[0].filename;
                req.body.pri_image = pri_image;
                fs.unlinkSync(path.join(__dirname,"..",data.pri_image));
            }
            else{
                req.body.pri_image = data.pri_image;
            }

            if(req.files.multi_image){

                req.files.multi_image.map((v,i)=> {
                    multi_image.push(Product.multiImagePath + "/" + v.filename);
                })
                req.body.multi_images = multi_image;
                
                data.multi_images.map((v)=> {
                    fs.unlinkSync(path.join(__dirname,"..",v));
                })                

            }
            else{
                req.body.multi_images = data.multi_images;
            }

        } 
        else{
            req.body.pri_image = data.pri_image;
            req.body.multi_images = data.multi_images;
        }
        if(req.body){

            req.body.categoryId = data.categoryId;
            req.body.subCategoryId = data.subCategoryId;
            req.body.exCategoryId = data.exCategoryId;
            req.body.brandId = data.brandId;
            req.body.typeId = data.typeId;
            req.body.isActive = true;
            req.body.createdDate = data.createdDate;
            req.body.isActive = true;
            req.body.updatedDate = new Date().toLocaleString();
            console.log(req.body);
            
            let updatedData = await Product.findByIdAndUpdate(req.body.oldId, req.body);
            console.log(updatedData);
            if(updatedData){
                console.log("Product Updated")
                res.redirect("/admin/product/viewProducts");
            }
            else{
                console.log("Data not updated")
                res.redirect("back");
            }
        }
        else{
            console.log("Data not found")
            res.redirect("back");
        }
    } catch (error) {
        console.log("Something wrong : "+error);
        res.redirect("back");
        
    }
}

// Delete Multi Images
module.exports.deleteMultiImages = async (req,res) => {
    try {

        if(req.body){

            let pro_id = req.body.proId;
            let imagePath = req.body.imgPath;
            
            let proData = await Product.findById(pro_id);
            console.log(proData)
            if(proData){
                let image_pos = 0;
                proData.multi_images.map((v,i)=> {
                    if(v == imagePath){
                        image_pos = i;
                    }
                })

                let newMultiImages = proData.multi_images.slice(0, image_pos).concat(proData.multi_images.slice(image_pos+1));
                proData.multi_images = newMultiImages;
                console.log(proData)

                let updateData = await Product.findByIdAndUpdate(pro_id , proData);
                if(updateData){
                    fs.unlinkSync(path.join(__dirname,"..",imagePath));
                    let multiImagesDOM = "";
                    proData.multi_images.map((j,i)=> {
                        multiImagesDOM += `<div class="d-flex">`; 
                        multiImagesDOM += `<img src="${j}" id="${proData.id}_${i}" height="50px" />`; 
                        multiImagesDOM += `<i class="fa-solid fa-trash text-dark" style="cursor: pointer;" onclick="deleteMultiImages(${j},${proData.id})"></i>`;
                        multiImagesDOM += `</div>`;
                    })
                    return res.json(multiImagesDOM);
                }
                else{
                    console.log("Data not updated");
                    return res.redirect("back");
                }   
            }
            else{
                console.log("Data not found");
                return res.redirect("back");
            }

        }
        else{
            console.log("Id not found");
            return res.redirect("back");
        }
        
    } catch (error) {
        console.log("Something wrong : "+error)
        return res.redirect("back");
    }
}