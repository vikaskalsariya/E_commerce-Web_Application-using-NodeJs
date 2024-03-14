const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");
const ExtraCategory = require("../model/ExtraCategory");

// Add extra category
module.exports.addExCategory = async (req,res) => {
    try {
        
        let categories = await Category.find({});
        let subCategories = await SubCategory.find({});
        if(categories){
            return res.render("exCategory/addExCategory",{
                categories : categories,
                subCategories : subCategories
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

module.exports.insertExCategory = async (req,res) => {
    try {
        
        if(req.body){

            let checkCat = await ExtraCategory.findOne({ex_category_name : req.body.ex_category_name});
            if(!checkCat){
                req.body.isActive = true;
                req.body.createdDate = new Date().toLocaleString();
                req.body.updatedDate = new Date().toLocaleString();

                let addCat = await ExtraCategory.create(req.body);
                if(addCat){
                    console.log("Extra Category added");
                    return res.redirect("/admin/extraCategory/viewExCategories");
                }
                else{
                    console.log("Data not found");
                    res.redirect("back");
                }
            }
            else{
                console.log("Extra Category already exist");
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

// View Extra Category
module.exports.viewExCategories = async (req,res) => {
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
            let data = await ExtraCategory.find({
                $or : [
                    {'ex_category_name' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).populate("categoryId").populate("subCategoryId")
            .limit(perPage)
            .skip(perPage*page).exec();

            let totalDocumets = await ExtraCategory.find({
                $or : [
                    {'ex_category_name' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).countDocuments();
            let totalPages = Math.ceil(totalDocumets/perPage);
            if(data){
                res.render("exCategory/viewExCategories",{
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

// Deactive Extra Category
module.exports.deactive = async (req,res) => {
    try {
        if(req.params.id){
            let record = await ExtraCategory.findByIdAndUpdate(req.params.id, {isActive : false});
            if(record){
                res.redirect("/admin/extraCategory/viewExCategories");
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
            let record = await ExtraCategory.findByIdAndUpdate(req.params.id, {isActive : true});
            if(record){
                res.redirect("/admin/extraCategory/viewExCategories")
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

// Delete Extra Category
module.exports.deleteData = async (req,res) => {
    try {
        if(req.params.id){
            let data = await ExtraCategory.findByIdAndDelete(req.params.id);
            if(data){
                res.redirect("/admin/extraCategory/viewExCategories");
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

// Update Extra Category
module.exports.updateData = async (req,res) => {
    try {
        
        let data = await ExtraCategory.findById(req.params.id);
        if(data){
            return res.render("exCategory/updateData",{
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
module.exports.editExCategory = async (req,res) => {
    try {

        let data = await ExtraCategory.findById(req.body.oldId);
    
        req.body.categoryId = data.categoryId;
        req.body.subCategoryId = data.subCategoryId;
        req.body.isActive = true;
        req.body.createdDate = data.createdDate;
        req.body.updatedDate = new Date().toLocaleString();
        let updatedData = await ExtraCategory.findByIdAndUpdate(req.body.oldId, req.body);

        if(updatedData){
            res.redirect("/admin/extraCategory/viewExCategories");
        }
        else{
            console.log("Data not updated")
        }
        
    } catch (error) {
        console.log("Something wrong : "+error);
        res.redirect("back");
    }
}

// Get Extra Category Data
module.exports.getExCatData = async (req,res) => {
    try {
        
        if(req.body){
            let exCatData = await ExtraCategory.find({subCategoryId : req.body.subCategoryId});
            let exCategories = `<option value="">--- Select ---</option>`
            exCatData.map((v,i)=>{
                exCategories += `<option value="${v.id}">${v.ex_category_name}</option>`
            });
            return res.json(exCategories);
        }
        else{
            console.log("No data found");
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : "+error);
    }
}