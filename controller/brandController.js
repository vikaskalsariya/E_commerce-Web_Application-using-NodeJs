const Brand = require("../model/Brand");
const Type = require("../model/Type");
const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");
const ExtraCategory = require("../model/ExtraCategory");

// Add Brand
module.exports.addBrand = async (req, res) => {
    try {

        let categories = await Category.find({});
        let subCategories = await SubCategory.find({});
        let exCategories = await ExtraCategory.find({});
        if (categories) {
            return res.render("Brand/addBrand", {
                categories: categories,
                subCategories: subCategories,
                exCategories: exCategories
            });
        }
        else {
            console.log("Data not found");
            return res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : " + error);
        return res.redirect("back");
    }
}

module.exports.insertBrand = async (req, res) => {
    try {

        if (req.body) {

            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();

            let addBrand = await Brand.create(req.body);
            if (addBrand) {
                console.log("Brand added");
                return res.redirect("/admin/brand/viewBrands");
            }
            else {
                console.log("Data not found");
                res.redirect("back");
            }

        }
        else {
            console.log("Data not found");
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : " + error)
    }
}

// View Brands
module.exports.viewBrands = async (req, res) => {
    try {

        let adData = req.user;
        let search = '';
        let page = 0;

        if (req.query.page) {
            page = req.query.page
        }
        let perPage = 2;

        if (req.query.search) {
            search = req.query.search;
        }
        if (adData) {
            let data = await Brand.find({
                $or: [
                    { 'brand_name': { $regex: `.*${search}.*`, $options: "i" } }
                ]
            }).populate("categoryId").populate("subCategoryId").populate("exCategoryId")
                .limit(perPage)
                .skip(perPage * page).exec();

            let totalDocumets = await Brand.find({
                $or: [
                    { 'brand_name': { $regex: `.*${search}.*`, $options: "i" } }
                ]
            }).countDocuments();
            let totalPages = Math.ceil(totalDocumets / perPage);
            if (data) {
                res.render("Brand/viewBrands", {
                    catData: data,
                    search: search,
                    totalPages: totalPages,
                    currentPage: page
                })
            }
        }
        else {
            console.log("No data found")
            res.redirect("/admin/dashboard");
        }

    } catch (error) {
        console.log("Something wrong : " + error);
    }
}

// Deactive Brand
module.exports.deactive = async (req, res) => {
    try {
        if (req.params.id) {
            let record = await Brand.findByIdAndUpdate(req.params.id, { isActive: false });
            if (record) {
                res.redirect("/admin/brand/viewBrands");
            }
            else {
                console.log("Record not updated");
                res.redirect("back");
            }
        }
        else {
            console.log("Record not found");
            res.redirect("back");
        }
    } catch (error) {
        console.log("Record not found");
        res.redirect("back");
    }
}

// Active Extra Category
module.exports.active = async (req, res) => {
    try {
        if (req.params.id) {
            let record = await Brand.findByIdAndUpdate(req.params.id, { isActive: true });
            if (record) {
                res.redirect("/admin/brand/viewBrands")
            }
            else {
                console.log("Record not updated");
                res.redirect("back");
            }
        }
        else {
            console.log("Record not found");
            res.redirect("back");
        }
    } catch (error) {
        console.log("Record not found");
        res.redirect("back");
    }
}

// Delete Brand
module.exports.deleteData = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await Brand.findByIdAndDelete(req.params.id);
            if (data) {
                res.redirect("/admin/brand/viewBrands");
            }
        }
        else {
            console.log("Record not found")
            res.redirect("back");
        }
    } catch (error) {
        console.log("Something wrong");
        res.redirect("back");
    }
}

// Update Brand
module.exports.updateData = async (req, res) => {
    try {

        let data = await Brand.findById(req.params.id);
        if (data) {
            return res.render("Brand/updateData", {
                catData: data
            })
        }
        else {
            console.log("Data not found");
            return res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : " + error);
        return res.redirect("back");
    }
}
module.exports.editBrand = async (req, res) => {
    try {

        let data = await Brand.findById(req.body.oldId);

        req.body.categoryId = data.categoryId;
        req.body.subCategoryId = data.subCategoryId;
        req.body.exCategoryId = data.exCategoryId;
        req.body.isActive = true;
        req.body.createdDate = data.createdDate;
        req.body.updatedDate = new Date().toLocaleString();
        let updatedData = await Brand.findByIdAndUpdate(req.body.oldId, req.body);

        if (updatedData) {
            res.redirect("/admin/brand/viewBrands");
        }
        else {
            console.log("Data not updated")
        }

    } catch (error) {
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}

// Get Brand and Type data
module.exports.getBrandAndType = async (req, res) => {
    try {

        if (req.body) {
            let brandData = await Brand.find({ exCategoryId: req.body.exCategoryId });
            let barndOpts = `<option value="">--- Select ---</option>`
            brandData.map((v, i) => {
                barndOpts += `<option value="${v.id}">${v.brand_name}</option>`
            });

            let ttypeData = await Type.find({ exCategoryId: req.body.exCategoryId });
            let typeOpts = `<option value="">--- Select ---</option>`
            ttypeData.map((v, i) => {
                typeOpts += `<option value="${v.id}">${v.type_name}</option>`
            });

            let optionTags = [barndOpts, typeOpts];

            return res.json(optionTags);
        }
        else {
            console.log("No data found");
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : " + error);
    }
}