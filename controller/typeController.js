const Type = require("../model/Type");
const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");
const ExtraCategory = require("../model/ExtraCategory");

// Add Type
module.exports.addType = async (req,res) => {
    try {
        
        let categories = await Category.find({});
        let subCategories = await SubCategory.find({});
        let exCategories = await ExtraCategory.find({});
        if(categories){
            return res.render("Type/addType",{
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

module.exports.insertType = async (req,res) => {
    try {
        
        if(req.body){

            let checkType = await Type.findOne({type_name : req.body.type_name});
            if(!checkType){
                req.body.isActive = true;
                req.body.createdDate = new Date().toLocaleString();
                req.body.updatedDate = new Date().toLocaleString();

                let addType = await Type.create(req.body);
                if(addType){
                    console.log("Type added");
                    return res.redirect("/admin/type/viewTypes");
                }
                else{
                    console.log("Data not found");
                    res.redirect("back");
                }
            }
            else{
                console.log("Type already exist");
                res.redirect("back");
            }

        }
        else{
            console.log("Data not found");
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : "+error)
    }
}

// View Types
module.exports.viewTypes = async (req,res) => {
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
            let data = await Type.find({
                $or : [
                    {'type_name' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).populate("categoryId").populate("subCategoryId").populate("exCategoryId")
            .limit(perPage)
            .skip(perPage*page).exec();

            let totalDocumets = await Type.find({
                $or : [
                    {'type_name' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).countDocuments();
            let totalPages = Math.ceil(totalDocumets/perPage);
            if(data){
                res.render("Type/viewTypes",{
                    catData : data,
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

// Deactive Type
module.exports.deactive = async (req,res) => {
    try {
        if(req.params.id){
            let record = await Type.findByIdAndUpdate(req.params.id, {isActive : false});
            if(record){
                res.redirect("/admin/type/viewTypes");
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
            let record = await Type.findByIdAndUpdate(req.params.id, {isActive : true});
            if(record){
                res.redirect("/admin/type/viewTypes")
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

// Delete Type
module.exports.deleteData = async (req,res) => {
    try {
        if(req.params.id){
            let data = await Type.findByIdAndDelete(req.params.id);
            if(data){
                res.redirect("/admin/type/viewTypes");
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

// Update Type
module.exports.updateData = async (req,res) => {
    try {
        
        let data = await Type.findById(req.params.id);
        if(data){
            return res.render("Type/updateData",{
                catData : data
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

module.exports.editType = async (req,res) => {
    try {

        let data = await Type.findById(req.body.oldId);
    
        req.body.categoryId = data.categoryId;
        req.body.subCategoryId = data.subCategoryId;
        req.body.exCategoryId = data.exCategoryId;
        req.body.isActive = true;
        req.body.createdDate = data.createdDate;
        req.body.updatedDate = new Date().toLocaleString();
        let updatedData = await Type.findByIdAndUpdate(req.body.oldId, req.body);

        if(updatedData){
            res.redirect("/admin/type/viewTypes");
        }
        else{
            console.log("Data not updated")
        }
        
    } catch (error) {
        console.log("Something wrong : "+error);
        res.redirect("back");
    }
}