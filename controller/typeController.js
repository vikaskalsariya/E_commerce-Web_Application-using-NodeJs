let Category = require("../model/Category.js");
let Subcategory = require("../model/Subcategory.js");
let Extracategory = require("../model/Extracategory.js");
const Type = require("../model/Type.js");

// ---------------------Type -------------------------
module.exports.addType = async (req, res) => {
    try {
        let catData = await Category.find({});
        let subcatData = await Subcategory.find({});
        let extracatData = await Extracategory.find({});
        return res.render('type/add_type',{
            catData :catData,
            subcatData : subcatData,
            extracatData : extracatData
        });
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

// ---------------- Add Type -----------------
module.exports.addTypeData = async (req, res) => {
    try {
        if (req.body) {
            req.body.isActive = true;
            req.body.createDate = new Date().toLocaleString();
            req.body.updateDate = new Date().toLocaleString();
            let data = await Type.create(req.body);
            if (data) {
                return res.redirect('back');
            }
            else {
                console.log("Add Type Data note store in DB");
                return res.redirect('back')
            }
        }
        else {
            console.log("data not get from Type form");
            return res.redirect('back')
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// ---------------- View Type -----------------
module.exports.viewType = async (req, res) => {
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
        let TypeData = await Type.find({
            $or: [
                { 'type': { $regex: `.*${search}.*`, $options: "i" } },
            ]
        }).limit(perPage)
            .skip(perPage * page)
            .populate('categoryId')
            .populate('subcategoryId')
            .populate('extracategoryId').exec();

        var totalDocumets = await Extracategory.find({
            $or: [
                { 'type': { $regex: `.*${search}.*`, $options: "i" } },
            ]
        }).countDocuments();
        let totalPages = Math.ceil(totalDocumets / perPage);
        if (TypeData) {
            return res.render('type/view_type', {
                TypeData: TypeData,
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

// ---------------get Extra category -------------------
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
        let TypeData = await Type.findById(req.params.id);
        TypeData.isActive = false;
        await TypeData.save();
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
        let TypeData = await Type.findById(req.params.id);
        TypeData.isActive = true;
        await TypeData.save();
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
        const Data = await Type.findByIdAndDelete(req.params.id);
        if(Data)
        {
            return res.redirect('back')
        }
        else 
        {
            console.log("Type data not foud")
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
        let TypeData = await Type.findById(req.params.id);
        return res.render('type/update_type', {
            Data: TypeData,
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
            let updateData = await Type.findByIdAndUpdate(req.body.id, req.body);
            if (updateData) {
                return res.redirect('/admin/Type/view_type');
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
