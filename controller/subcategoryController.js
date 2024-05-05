let Category = require("../model/Category.js");
let Subcategory = require("../model/Subcategory.js");
// ---------------------Subcategory -------------------------
module.exports.addSubCategory = async (req, res) => {
    try {
        let catData = await Category.find({});
        return res.render('subcategory/add_subcategory',{
            catData :catData,
        });
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

// ---------------- Add Subcategory -----------------
module.exports.addSubCategoryData = async (req, res) => {
    try {
        if (req.body) {
            console.log(req.body)
            req.body.isActive = true;
            req.body.createDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Subcategory.create(req.body);
            if (data) {
                return res.redirect('back');
            }
            else {
                console.log("Add Subcategory Data note store in DB");
                return res.redirect('back')
            }
        }
        else {
            console.log("data not get from Subcategory form");
            return res.redirect('back')
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// ---------------- View Subcategory -----------------
module.exports.viewSubCategory = async (req, res) => {
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
        let SubcategoryData = await Subcategory.find({
            $or: [
                { 'subcategory': { $regex: `.*${search}.*`, $options: "i" } },
            ]
        }).limit(perPage)
            .skip(perPage * page).populate('categoryId').exec();

        var totalDocumets = await Subcategory.find({
            $or: [
                { 'subcategory': { $regex: `.*${search}.*`, $options: "i" } },
            ]
        }).countDocuments();
        let totalPages = Math.ceil(totalDocumets / perPage);
        if (SubcategoryData) {
            return res.render('subcategory/view_subcategory', {
                SubcategoryData: SubcategoryData,
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
        let SubcategoryData = await Subcategory.findById(req.params.id);
        SubcategoryData.isActive = false;
        await SubcategoryData.save();
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
        let SubcategoryData = await Subcategory.findById(req.params.id);
        SubcategoryData.isActive = true;
        await SubcategoryData.save();
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
        const catData = await Subcategory.findByIdAndDelete(req.params.id);
        if(catData)
        {
            return res.redirect('back')
        }
        else 
        {
            console.log("category data not foud")
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// ---------------- Update Data -----------------
module.exports.update = async (req, res) => {
    try {
        let SubcategoryData = await Subcategory.findById(req.params.id);
        return res.render('category/update_category', {
            Data: SubcategoryData,
        });
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

module.exports.UpdatedData = async (req, res) => {
    try {
        let SubcategoryData = await Subcategory.findById(req.body.id);
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, "..", SubcategoryData.Admin_Image))
            req.body.Admin_Image = Subcategory.AdminImgPath + '/' + req.file.filename;
        };
        if (req.body) {
            req.body.updateDate = new Date().toLocaleString();
            let updateData = await Subcategory.findByIdAndUpdate(req.body.id, req.body);
            if (updateData) {
                return res.redirect('/admin/category/view_category');
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
        return res.redirect('/admin/view_admin')
    }
}
