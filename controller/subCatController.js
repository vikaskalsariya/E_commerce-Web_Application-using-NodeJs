const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");

// Add sub category
module.exports.addSubCategory = async (req,res) => {
    try {
        
        let categories = await Category.find({});
        if(categories){
            return res.render("subCategory/addSubCategory",{
                categories : categories
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

module.exports.insertSubCategory = async (req,res) => {
    try {
        
        if(req.body){

            let checkCat = await SubCategory.findOne({sub_category_name : req.body.sub_category_name});
            if(!checkCat){
                req.body.isActive = true;
                req.body.createdDate = new Date().toLocaleString();
                req.body.updatedDate = new Date().toLocaleString();

                let addCat = await SubCategory.create(req.body);
                if(addCat){
                    console.log("Sub Category added");
                    return res.redirect("/admin/subCategory/viewSubCategories");
                }
                else{
                    console.log("Data not found");
                    res.redirect("back");
                }
            }
            else{
                console.log("Sub Category already exist");
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

// View Sub Category
module.exports.viewSubCategories = async (req,res) => {
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
            let data = await SubCategory.find({
                $or : [
                    {'sub_category_name' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).populate("categoryId")
            .limit(perPage)
            .skip(perPage*page).exec();

            let totalDocumets = await SubCategory.find({
                $or : [
                    {'sub_category_name' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).countDocuments();
            let totalPages = Math.ceil(totalDocumets/perPage);
            if(data){
                res.render("subCategory/viewSubCategories",{
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

// Deactive Sub Category
module.exports.deactive = async (req,res) => {
    try {
        if(req.params.id){
            let record = await SubCategory.findByIdAndUpdate(req.params.id, {isActive : false});
            if(record){
                res.redirect("/admin/subCategory/viewSubCategories")
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

// Active Sub Category
module.exports.active = async (req,res) => {
    try {
        if(req.params.id){
            let record = await SubCategory.findByIdAndUpdate(req.params.id, {isActive : true});
            if(record){
                res.redirect("/admin/subCategory/viewSubCategories")
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

// Delete Sub Category
module.exports.deleteData = async (req,res) => {
    try {
        if(req.params.id){
            let data = await SubCategory.findByIdAndDelete(req.params.id);
            if(data){
                res.redirect("/admin/subCategory/viewSubCategories");
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

// Update Sub Category
module.exports.updateData = async (req,res) => {
    try {
        
        let data = await SubCategory.findById(req.params.id);
        if(data){
            return res.render("subCategory/updateData",{
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
module.exports.editSubCategory = async (req,res) => {
    try {

        let data = await SubCategory.findById(req.body.oldId);
    
        req.body.categoryId = data.categoryId;
        req.body.isActive = true;
        req.body.createdDate = data.createdDate;
        req.body.updatedDate = new Date().toLocaleString();
        let updatedData = await SubCategory.findByIdAndUpdate(req.body.oldId, req.body);

        if(updatedData){
            console.log("match");
            res.redirect("/admin/subCategory/viewSubCategories");
        }
        else{
            console.log("Data not updated")
        }
        
    } catch (error) {
        console.log("Something wrong : "+error);
        res.redirect("back");
    }
}

// Get Sub Category Data
module.exports.getSubCatData = async (req,res) => {
    try {
        
        if(req.body){
            let subCatData = await SubCategory.find({categoryId : req.body.categoryId});
            let subCategories = `<option value="">--- Select ---</option>`
            subCatData.map((v,i)=>{
                subCategories += `<option value="${v.id}">${v.sub_category_name}</option>`
            });
            return res.json(subCategories);
        }
        else{
            console.log("No data found");
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : "+error);
    }
}