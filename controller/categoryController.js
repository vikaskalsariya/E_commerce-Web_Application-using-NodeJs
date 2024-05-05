let Category = require("../model/Category.js");
// ---------------------Category -------------------------
module.exports.addCategory = async (req, res) => {
    try {
        return res.render('category/add_category');
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

// ---------------- Add Category -----------------
module.exports.addCategoryData = async (req, res) => {
    try {
        if (req.body) {
            console.log(req.body)
            req.body.isActive = true;
            req.body.createDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Category.create(req.body);
            if (data) {
                return res.redirect('back');
            }
            else {
                console.log("Add Category Data note store in DB");
                return res.redirect('back')
            }
        }
        else {
            console.log("data not get from Category form");
            return res.redirect('back')
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// ---------------- View Category -----------------
module.exports.viewCategory = async (req, res) => {
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
        let CategoryData = await Category.find({
            $or: [
                { 'category': { $regex: `.*${search}.*`, $options: "i" } },
            ]
        }).limit(perPage)
            .skip(perPage * page);

        var totalDocumets = await Category.find({
            $or: [
                { 'category': { $regex: `.*${search}.*`, $options: "i" } },
            ]
        }).countDocuments();
        let totalPages = Math.ceil(totalDocumets / perPage);
        if (CategoryData) {
            return res.render('category/view_category', {
                CategoryData: CategoryData,
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
        let categoryData = await Category.findById(req.params.id);
        categoryData.isActive = false;
        await categoryData.save();
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
        let categoryData = await Category.findById(req.params.id);
        categoryData.isActive = true;
        await categoryData.save();
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
        const catData = await Category.findByIdAndDelete(req.params.id);
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
        let categoryData = await Category.findById(req.params.id);
        return res.render('category/update_category', {
            Data: categoryData,
        });
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

module.exports.UpdatedData = async (req, res) => {
    try {
        let categoryData = await Category.findById(req.body.id);
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, "..", categoryData.Admin_Image))
            req.body.Admin_Image = Category.AdminImgPath + '/' + req.file.filename;
        };
        if (req.body) {
            req.body.updateDate = new Date().toLocaleString();
            let updateData = await Category.findByIdAndUpdate(req.body.id, req.body);
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
