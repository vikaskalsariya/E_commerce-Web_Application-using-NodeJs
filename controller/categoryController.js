const Category = require("../model/Category");

// Add Category
module.exports.addCategory = async (Req,res) => {
    return res.render("Category/addCategory");
}

module.exports.insertCategory = async (req,res) => {
    try {
        
        if(req.body){

            let checkCat = await Category.findOne({category_name : req.body.category_name});
            if(!checkCat){
                req.body.isActive = true;
                req.body.createdDate = new Date().toLocaleString();
                req.body.updatedDate = new Date().toLocaleString();

                let addCat = await Category.create(req.body);
                if(addCat){
                    console.log("Category added");
                    return res.redirect("/admin/category/viewCategories");
                }
                else{
                    console.log("Data not found");
                    res.redirect("back");
                }
            }
            else{
                console.log("Category already exist");
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

// View Categories
module.exports.viewCategories = async (req,res) => {
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
            let data = await Category.find({
                $or : [
                    {'category_name' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            })
            .limit(perPage)
            .skip(perPage*page);

            let totalDocumets = await Category.find({
                $or : [
                    {'category_name' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).countDocuments();
            let totalPages = Math.ceil(totalDocumets/perPage);
            if(data){
                res.render("Category/viewCategories",{
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

// Deactive Category
module.exports.deactive = async (req,res) => {
    try {
        if(req.params.id){
            let record = await Category.findByIdAndUpdate(req.params.id, {isActive : false});
            if(record){
                res.redirect("/admin/category/viewCategories")
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

// Active Category
module.exports.active = async (req,res) => {
    try {
        if(req.params.id){
            let record = await Category.findByIdAndUpdate(req.params.id, {isActive : true});
            if(record){
                res.redirect("/admin/category/viewCategories")
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

// Delete Category
module.exports.deleteData = async (req,res) => {
    try {
        if(req.params.id){
            let data = await Category.findByIdAndDelete(req.params.id);
            if(data){
                res.redirect("/admin/category/viewCategories");
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

// Update Category
module.exports.updateData = async (req,res) => {
    try {
        
        let data = await Category.findById(req.params.id);
        if(data){
            return res.render("Category/updateData",{
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
module.exports.editCategory = async (req,res) => {
    try {

        let data = await Category.findById(req.body.oldId);
    
        req.body.isActive = true;
        req.body.createdDate = data.createdDate;
        req.body.updatedDate = new Date().toLocaleString();
        let updatedData = await Category.findByIdAndUpdate(req.body.oldId, req.body);

        if(updatedData){
            console.log("match");
            res.redirect("/admin/category/viewCategories");
        }
        else{
            console.log("Data not updated")
        }
        
    } catch (error) {
        console.log("Something wrong : "+error);
        res.redirect("back");
    }
}