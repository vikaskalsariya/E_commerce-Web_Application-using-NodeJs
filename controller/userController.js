const Category = require('../model/Category.js');
const Subcategory = require('../model/Subcategory.js');
const Extracategory = require('../model/Extracategory.js');
const Product = require('../model/Product.js');
const Cart = require('../model/Cart.js');
const User = require('../model/User.js');
const Admin = require('../model/Admin.js');
const stripe = require('stripe')(' sk_test_wFSjCKx4AW07JCc87b2fUwhH00zzjnRSJv');
const by = require('bcrypt')
// ---------------------view home page with header Data ---------------
module.exports.home = async (req, res) => {
    try {
        let CatData = await Category.find({});
        let SubcatData = await Subcategory.find({});
        let ExtracatData = await Extracategory.find({});
        let totalCartPro = 0;
        total = 0;
        if (req.user) {
            totalCartPro = await Cart.find({ userId: req.user.id }).countDocuments();
            let cartData = await Cart.find({ userId: req.user.id }).populate('productId').exec();
            cartData.map((v) => {
                total = total + parseInt(v.productId.price)
            })
        }
            return res.render('user/home', {
                CatData: CatData,
                SubcatData: SubcatData,
                ExtracatData: ExtracatData,
                totalCartPro: totalCartPro,
                total: total,
        });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// ---------------------Productlist ---------------
module.exports.Productlist = async (req, res) => {
    try {
        let CatData = await Category.find({});
        let SubcatData = await Subcategory.find({});
        let ExtracatData = await Extracategory.find({});
        let ProductData = await Product.find({ categoryId: req.params.Cid, subcategoryId: req.params.Sid, extracategoryId: req.params.Eid }).populate('brandId').exec();

        let ProductListId = [];
        ProductData.forEach((v) => {
            let pos = ProductListId.findIndex((v1) => v1.id == v.brandId.id);
            if (pos == -1) {
                ProductListId.push(v.brandId);
            }
        });

        let min = Math.min(...ProductData.map(v => v.price));
        let max = Math.max(...ProductData.map(v => v.price));

        let totalCartPro = 0;
        total = 0;
        if (req.user) {
            totalCartPro = await Cart.find({ userId: req.user.id }).countDocuments();
            let cartData = await Cart.find({ userId: req.user.id }).populate('productId').exec();
            cartData.map((v) => {
                total = total + parseInt(v.productId.price)
            })
        }
        
        if (ProductData) {
            return res.render('user/ProductList', {
                CatData: CatData,
                SubcatData: SubcatData,
                ExtracatData: ExtracatData,
                ProductData: ProductData,
                min: min,
                max: max,
                catId: req.params.Cid,
                subId: req.params.Sid,
                extraId: req.params.Eid,
                brandList: ProductListId,
                totalCartPro: totalCartPro,
                total: total,
            })
        } else {
            console.log("Product Data not found");
            return res.redirect('back');
        }

    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

// ----------------------singleProduct---------------
module.exports.singleProduct = async (req, res) => {
    try {
        let CatData = await Category.find({});
        let SubcatData = await Subcategory.find({});
        let ExtracatData = await Extracategory.find({});
        let ProData = await Product.findById(req.params.id);
         let totalCartPro = 0;
        total = 0;
        if (req.user) {
            totalCartPro = await Cart.find({ userId: req.user.id }).countDocuments();
            let cartData = await Cart.find({ userId: req.user.id }).populate('productId').exec();
            cartData.map((v) => {
                total = total + parseInt(v.productId.price)
            })
        }
        if (ProData) {
            return res.render('user/singleProduct', {
                CatData: CatData,
                SubcatData: SubcatData,
                ExtracatData: ExtracatData,
                ProData: ProData,
                totalCartPro: totalCartPro,
                total: total,
            })
        }
        else {
            console.log("Product Data not found");
        }
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

// -------------set range Data---------------
module.exports.setrangeData = async (req, res) => {
    try {

        if (req.body) {
            let ProData = await Product.find({ categoryId: req.body.catId, subcategoryId: req.body.subId, extracategoryId: req.body.extraId, price: { $gte: req.body.min, $lte: req.body.max } });
             let totalCartPro = 0;
        total = 0;
        if (req.user) {
            totalCartPro = await Cart.find({ userId: req.user.id }).countDocuments();
            let cartData = await Cart.find({ userId: req.user.id }).populate('productId').exec();
            cartData.map((v) => {
                total = total + parseInt(v.productId.price)
            })
        }
            if (ProData) {
                return res.render('user/rangeproductList', {
                    ProductData: ProData,
                    totalCartPro: totalCartPro,
                total: total,
                })

            }
            else {
                console.log("Range Filtered Data not found");
                return res.redirect('back');
            }
        }
        else {
            console.log("Data not found");
            res.redirect("back");
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// --------------get Brand Data----------------
module.exports.getBrandData = async (req, res) => {
    try {

        if (req.body) {
            let ProData = await Product.find({ categoryId: req.body.catId, subcategoryId: req.body.subId, extracategoryId: req.body.extraId, brandId: req.body.brandId });
             let totalCartPro = 0;
        total = 0;
        if (req.user) {
            totalCartPro = await Cart.find({ userId: req.user.id }).countDocuments();
            let cartData = await Cart.find({ userId: req.user.id }).populate('productId').exec();
            cartData.map((v) => {
                total = total + parseInt(v.productId.price)
            })
        }
            if (ProData) {
                return res.render('user/rangeproductList', {
                    ProductData: ProData,
                    totalCartPro: totalCartPro,
                total: total,
                })

            }
            else {
                console.log("Range Filtered Data not found");
                return res.redirect('back');
            }
        }
        else {
            console.log("Data not found");
            res.redirect("back");
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}
// ------------------User Register page render-------------------
module.exports.userRegister = async (req, res) => {
    try {
        let CatData = await Category.find({});
        let SubcatData = await Subcategory.find({});
        let ExtracatData = await Extracategory.find({});
         let totalCartPro = 0;
        total = 0;
        if (req.user) {
            totalCartPro = await Cart.find({ userId: req.user.id }).countDocuments();
            let cartData = await Cart.find({ userId: req.user.id }).populate('productId').exec();
            cartData.map((v) => {
                total = total + parseInt(v.productId.price)
            })
        }
        return res.render('user/RegisterLogin', {
            CatData: CatData,
            SubcatData: SubcatData,
            ExtracatData: ExtracatData,
            totalCartPro: totalCartPro,
                total: total,
        });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}
// ----------------------User register ------------------------
module.exports.register = async (req, res) => {
    try {
        let chackEmail = await User.findOne({ email: req.body.email });
        if (!chackEmail) {
            if (req.body) {
                if (req.body.password == req.body.cPass) {
                    req.body.role = 'user';
                    req.body.isActive = true;
                    req.body.createDate = new Date().toLocaleString();
                    req.body.updateDate = new Date().toLocaleString();
                    let data = await User.create(req.body);
                    if (data) {
                        return res.redirect('/');
                    }
                    else {
                        console.log("Add User Data note store in DB");
                        return res.redirect('back')
                    }
                }
                else {
                    console.log("Add user side passwod and confirm password are not same")
                    return res.redirect('back')
                }
            }
            else {
                console.log("data not get from user form");
                return res.redirect('back')
            }
        }
        else {
            console.log("email is already existed");
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// ------------------User Login page render-------------------
module.exports.userLogin = async (req, res) => {
    try {
        let CatData = await Category.find({});
        let SubcatData = await Subcategory.find({});
        let ExtracatData = await Extracategory.find({});
         let totalCartPro = 0;
        total = 0;
        if (req.user) {
            totalCartPro = await Cart.find({ userId: req.user.id }).countDocuments();
            let cartData = await Cart.find({ userId: req.user.id }).populate('productId').exec();
            cartData.map((v) => {
                total = total + parseInt(v.productId.price)
            })
        }
        return res.render('user/RegisterLogin', {
            CatData: CatData,
            SubcatData: SubcatData,
            ExtracatData: ExtracatData,
            totalCartPro: totalCartPro,
                total: total,
        });
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
    return res.redirect('/')
}

// ------------------User Login-------------------
module.exports.Login = async (req, res) => {
    try {
        return res.redirect('/');
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}


// --------------- cart buccate count -----------------------
module.exports.addToCartCount = async (req, res) => {
    try {
        if (req.body) {
            let CartData = await Cart.findOne({ productId: req.body.ProId })
            if (!CartData) {
                req.body.productId = req.body.ProId;
                req.body.userId = req.body.userId;
                req.body.quantity = 1;
                req.body.status = "pending";
                req.body.createDate = new Date().toLocaleString();
                req.body.updateDate = new Date().toLocaleString();
                await Cart.create(req.body);
                if (Cart) {
                    let cartTotal = await Cart.find({ userId: req.user.id }).countDocuments()
                    console.log(cartTotal)
                    return res.json(cartTotal);
                }
                else {
                    let cartTotal = await Cart.find({ userId: req.user.id }).countDocuments()
                    console.log('Product not added')
                    return res.json(cartTotal);
                }
            }
            else {
                let cartTotal = await Cart.find({ userId: req.user.id }).countDocuments()
                console.log('product already added')
                return res.json(cartTotal);
            }
        } else {
            console.log('Product id not found');
            return res.json({ msg: 'somthinng wrong' });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({ msg: 'somthinng wrong' });
    }
}

// -----------------Add To Cart Box-----------------
module.exports.AddToCartBox = async (req, res) => {
    try {
        if (req.user) {
            let cartData = await Cart.find({ userId: req.user.id }).populate('productId').exec();
            total = 0;
            cartData.map((v) => {
                total = total + parseInt(v.productId.price)
            })
            if (cartData) {
                return res.render('user/addToCartBox', {
                    cartData: cartData,
                    total: total,
                })
            }
            else {
                console.log("cart data not found");
                return res.json({ msg: "cart data not found" });
            }
        }
        else {
            console.log("user not login");
            return res.json({ msg: "user not login" });
        }
    } catch (err) {
        console.log(err);
        return res.json({ msg: 'somthinng wrong' });
    }
}

// ----------------Show My Cart---------------
module.exports.showMyCart = async (req, res) => {
    try {
        if (req.user) {

            let CatData = await Category.find({});
            let SubcatData = await Subcategory.find({});
            let ExtracatData = await Extracategory.find({});
             let totalCartPro = 0;
        total = 0;
        if (req.user) {
            totalCartPro = await Cart.find({ userId: req.user.id }).countDocuments();
            let cartData = await Cart.find({ userId: req.user.id }).populate('productId').exec();
            cartData.map((v) => {
                total = total + parseInt(v.productId.price)
            })
        }


            let cartData = await Cart.find({ userId: req.user.id }).populate('productId').exec();
            total = 0;
            cartData.map((v) => {
                total = total + parseInt(v.productId.price)
            })
            if (cartData) {
                return res.render('user/myCart', {
                    cartData: cartData,
                    total: total,
                    CatData: CatData,
                    SubcatData: SubcatData,
                    ExtracatData: ExtracatData,
                    totalCartPro: totalCartPro,
                total: total,
                })
            }
            else {
                console.log("cart data not found");
                return res.redirect('back');
            }
        }
        else {
            console.log("user not login");
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// ---------------Cart Quentity---------------
module.exports.CartQuentity = async(req,res)=>{
    try{
        await Cart.findByIdAndUpdate(req.body.proId,{quantity:req.body.que})
        console.log(req.body)
    }
    catch(err)
    {
        return res.json({msg:"somthing wrong"+err});
    }
}

// -----------------check Out------------------
module.exports.chekOut = async(req,res)=>{
    try{    
        let cartData = await Cart.find({ userId: req.user.id }).populate('productId').exec();
        total = 0;
        cartData.map((v) => {
            total = total + parseInt(v.productId.price)
        })
        return res.render('user/chekOut',{
            total:total
        });
    }catch(err)
    {
        console.log(err);
        return res.redirect('back');
    }
}

// --------------------payment----------------------
module.exports.payment = async(req,res)=>{
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Gourav Hammad',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    })
    .then(async(customer) => {
 
        let cartData = await Cart.find({ userId: req.user.id }).populate('productId').exec();
        total = 0;
        cartData.map((v) => {
            total = total + parseInt(v.productId.price)
        })


        return stripe.charges.create({
            amount: total,     // Charging Rs 25
            description: 'Web Development Product',
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        return res.redirect('/');// If no error occurs
    })
    .catch((err) => {
        console.log(err);
        return res.redirect('back');    // If some error occurs
    });
}