let Category = require("../model/Category.js");
let Subcategory = require("../model/Subcategory.js");
let Extracategory = require("../model/Extracategory.js");
const Brand = require("../model/Brand.js");
const Type = require("../model/Type.js");
// ---------------------Subcategory -------------------------
module.exports.addExtraCategory = async (req, res) => {
    try {
        let catData = await Category.find({});
        let subcatData = await Subcategory.find({});
        return res.render('extracategory/add_extracategory',{
            catData :catData,
            subcatData : subcatData,
        });
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

// ---------------- Add Subcategory -----------------
module.exports.addExtraCategoryData = async (req, res) => {
    try {
        if (req.body) {
            console.log(req.body)
            req.body.isActive = true;
            req.body.createDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Extracategory.create(req.body);
            if (data) {
                return res.redirect('back');
            }
            else {
                console.log("Add Extracategory Data note store in DB");
                return res.redirect('back')
            }
        }
        else {
            console.log("data not get from Extracategory form");
            return res.redirect('back')
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// ---------------- View Subcategory -----------------
module.exports.viewExtraCategory = async (req, res) => {
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
        let ExtracategoryData = await Extracategory.find({
            $or: [
                { 'extracategory': { $regex: `.*${search}.*`, $options: "i" } },
            ]
        }).limit(perPage)
            .skip(perPage * page)
            .populate('categoryId')
            .populate('subcategoryId').exec();

        var totalDocumets = await Extracategory.find({
            $or: [
                { 'extracategory': { $regex: `.*${search}.*`, $options: "i" } },
            ]
        }).countDocuments();
        let totalPages = Math.ceil(totalDocumets / perPage);
        if (ExtracategoryData) {
            return res.render('extracategory/view_extracategory', {
                ExtracategoryData: ExtracategoryData,
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

// ---------------getSubCatData -------------------
module.exports.getSubCatData = async(req,res)=>{
    try{
        if(req.body)
        {
            let SUbCatData = await Subcategory.find({categoryId : req.body.CatId});
            let SubCatOptions = "<option selected>- - - Select Subategory - - -</option>";

            SUbCatData.map((v,i)=>{
                SubCatOptions += `<option value="${v.id}">${v.subcategory}</option>`;
            })
            return res.json(SubCatOptions);
        }
        else{
            console.log("Data not faund")
            return res.redirect('back');
        }
        console.log(req.body);
    }catch(err)
    {
        console.log(err);
        return res.redirect('back');
    }
}

// -----------------getBrandType----------------
module.exports.getBrandType = async(req,res)=>{
    try{
        if(req.body)
        {
            let BrandData = await Brand.find({extracategoryId : req.body.ExtraCatId});
            let TypeData = await Type.find({extracategoryId : req.body.ExtraCatId});

            return res.render('product/brandType',{
                BrandData:BrandData,
                TypeData:TypeData
            });
        }
        else{
            console.log("Data not faund")
            return res.redirect('back');
        }
    }catch(err)
    {
        console.log(err);
        return res.redirect('back');
    }
}
// -------------Active butotom ---------------
module.exports.active = async (req, res) => {
    try {
        let ExtracategoryData = await Extracategory.findById(req.params.id);
        ExtracategoryData.isActive = false;
        await ExtracategoryData.save();
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
        let ExtracategoryData = await Extracategory.findById(req.params.id);
        ExtracategoryData.isActive = true;
        await ExtracategoryData.save();
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
        const Data = await Extracategory.findByIdAndDelete(req.params.id);
        if(Data)
        {
            return res.redirect('back')
        }
        else 
        {
            console.log("Extra category data not foud")
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
        let ExtracategoryData = await Extracategory.findById(req.params.id);
        return res.render('extracategory/update_extracategory', {
            Data: ExtracategoryData,
        });
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

module.exports.UpdatedData = async (req, res) => {
    try {
        if (req.body) {
            req.body.updateDate = new Date().toLocaleString();
            let updateData = await Extracategory.findByIdAndUpdate(req.body.id, req.body);
            if (updateData) {
                return res.redirect('/admin/ExtraCaregory/view_ExtraCaregory');
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
