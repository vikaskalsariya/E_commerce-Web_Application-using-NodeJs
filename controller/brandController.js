let Category = require("../model/Category.js");
let Subcategory = require("../model/Subcategory.js");
let Extracategory = require("../model/Extracategory.js");
let brand = require("../model/Brand.js");
const Brand = require("../model/Brand.js");

// ---------------------Brand -------------------------
module.exports.addBrand = async (req, res) => {
    try {
        let catData = await Category.find({});
        let subcatData = await Subcategory.find({});
        let extracatData = await Extracategory.find({});
        return res.render('brand/add_brand',{
            catData :catData,
            subcatData : subcatData,
            extracatData:extracatData
        });
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

// ---------------- Add Brand -----------------
module.exports.addBrandData = async (req, res) => {
    try {
        if (req.body) {
            console.log(req.body)
            req.body.isActive = true;
            req.body.createDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Brand.create(req.body);
            if (data) {
                return res.redirect('back');
            }
            else {
                console.log("Add Brand Data note store in DB");
                return res.redirect('back')
            }
        }
        else {
            console.log("data not get from Brand form");
            return res.redirect('back')
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// ---------------- View Brand -----------------
module.exports.viewBrand = async (req, res) => {
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
        let BrandData = await Brand.find({
            $or: [
                { 'brand': { $regex: `.*${search}.*`, $options: "i" } },
            ]
        }).limit(perPage)
            .skip(perPage * page)
            .populate('categoryId')
            .populate('subcategoryId')
            .populate('extracategoryId').exec();

        var totalDocumets = await Extracategory.find({
            $or: [
                { 'brand': { $regex: `.*${search}.*`, $options: "i" } },
            ]
        }).countDocuments();
        let totalPages = Math.ceil(totalDocumets / perPage);
        if (BrandData) {
            return res.render('brand/view_brand', {
                BrandData: BrandData,
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

// ---------------get Brand -------------------
module.exports.getExtraCatData = async(req,res)=>{
    try{
        if(req.body)
        {
            let extraCatData = await Extracategory.find({categoryId : req.body.CatId,subcategoryId:req.body.SubCatId});
            let ExtraCatOptions = "<option selected>- - - Select Subategory - - -</option>";

            extraCatData.map((v,i)=>{
                ExtraCatOptions += `<option value="${v.id}">${v.extracategory}</option>`;
            })
            return res.json(ExtraCatOptions);
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
        let BrandData = await Brand.findById(req.params.id);
        BrandData.isActive = false;
        await BrandData.save();
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
        let BrandData = await Brand.findById(req.params.id);
        BrandData.isActive = true;
        await BrandData.save();
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
        let BrandData = await Brand.findById(req.params.id);
        return res.render('brand/update_brand', {
            Data: BrandData,
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
            let updateData = await Brand.findByIdAndUpdate(req.body.id, req.body);
            if (updateData) {
                return res.redirect('/admin/Brand/view_brand');
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
