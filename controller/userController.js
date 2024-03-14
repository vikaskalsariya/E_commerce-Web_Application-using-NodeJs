const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");
const ExtraCategory = require("../model/ExtraCategory");
const Product = require("../model/Product");
const User = require("../model/User");
const Cart = require("../model/Cart");
const Order = require("../model/Order");
const stripe = require("stripe")("sk_test_wFSjCKx4AW07JCc87b2fUwhH00zzjnRSJv");

// Home Page
module.exports.dashboard = async (req, res) => {
    try {

        // console.log(req.user);
        let cartItems = 0;
        if (req.user) {
            cartItems = await Cart.find({ userId: req.user.id , status : "pending", status : "pending"}).countDocuments();
        }

        let categoryData = await Category.find({});
        let subCategoryData = await SubCategory.find({});
        let exCategoryData = await ExtraCategory.find({});
        let productData = await Product.find({});

        return res.render("User/dashboard", {
            catData: categoryData,
            subCatData: subCategoryData,
            exCatData: exCategoryData,
            productData: productData,
            cartItems: cartItems
        })

    } catch (error) {
        console.log("Something worng : " + error);
        return res.redirect("back");
    }
}

// Register
module.exports.register = async (req, res) => {
    try {

        let cartItems = 0;
        if (req.user) {
            cartItems = await Cart.find({ userId: req.user.id , status : "pending", status : "pending"}).countDocuments();
        }

        let categoryData = await Category.find({});
        let subCategoryData = await SubCategory.find({});
        let exCategoryData = await ExtraCategory.find({});
        let productData = await Product.find({});

        if (exCategoryData) {
            return res.render("User/register", {
                catData: categoryData,
                subCatData: subCategoryData,
                exCatData: exCategoryData,
                productData: productData,
                cartItems: cartItems
            })
        }
        else {
            console.log("Data not found");
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}

module.exports.registerUser = async (req, res) => {
    try {

        if (req.body) {

            let checkUser = await User.findOne({ email: req.body.email });
            if (!checkUser) {
                if (req.body.password == req.body.cmpass) {

                    req.body.isActive = true;
                    req.body.createdDate = new Date().toLocaleString();
                    req.body.updatedDate = new Date().toLocaleString();

                    let userData = await User.create(req.body);
                    if (userData) {
                        console.log("Registered successfully, Please Login !");
                        res.redirect("/register");
                    }
                    else {
                        console.log("User not registered");
                        return res.redirect("back");
                    }

                }
                else {
                    console.log("Password doesn't match");
                    return res.redirect("back");
                }
            }
            else {
                console.log("User already exist");
                return res.redirect("back");
            }
        }
        else {
            console.log("Data not found");
            return res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : " + error);
        res.redirect("/");
    }
}

// Login User
module.exports.login = async (req, res) => {
    try {

        if (req.body) {

            let checkUser = await User.findOne({ email: req.body.email });
            if (checkUser) {
                if (checkUser.password == req.body.password) {
                    console.log("Logged in successfully.");
                    return res.redirect("/");
                }
                else {
                    console.log("Password doesn't match");
                    return res.redirect("back");
                }
            }
            else {
                console.log("User doesn't exist");
                return res.redirect("back");
            }
        }
        else {
            console.log("Data not found");
            return res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : " + error);
        res.redirect("/");
    }
}

// Product List
module.exports.productList = async (req, res) => {
    try {

        if (req.params) {

            let categoryData = await Category.find({});
            let subCategoryData = await SubCategory.find({});
            let exCategoryData = await ExtraCategory.find({});
            let exCatName = await ExtraCategory.findById(req.params.exCatId);

            let products = await Product
                .find({ categoryId: req.params.catId, subCategoryId: req.params.subCatId, exCategoryId: req.params.exCatId })
                .populate("categoryId").populate("subCategoryId").populate("exCategoryId").populate("brandId").populate("typeId").exec();

            let brandList = [];
            products.map((v) => {
                let pos = brandList.findIndex((v1) => v.brandId.brand_name == v1.brand_name)
                if (pos == -1) {
                    brandList.push({
                        brand_name: v.brandId.brand_name,
                        brandId: v.brandId.id
                    })
                }
            })
            // console.log(brandList);

            let typeList = [];
            products.map((v) => {
                let pos = typeList.findIndex((v1) => v.typeId.type_name == v1.type_name)
                if (pos == -1) {
                    typeList.push({
                        type_name: v.typeId.type_name,
                        typeId: v.typeId.id
                    })
                }
            })
            // console.log(typeList);

            let max = 0;
            products.map((v, i) => {
                if (parseInt(v.price) >= parseInt(max)) {
                    max = v.price
                }
            });
            let min = max;
            products.map((v, i) => {
                if (parseInt(v.price) <= parseInt(min)) {
                    min = v.price
                }
            });

            let cartItems = 0;
            if (req.user) {
                cartItems = await Cart.find({ userId: req.user.id , status : "pending"}).countDocuments();
            }

            if (products) {
                return res.render("User/category", {
                    catData: categoryData,
                    subCatData: subCategoryData,
                    exCatData: exCategoryData,
                    exCatName: exCatName,
                    productData: products,
                    minPrice: min,
                    maxPrice: max,
                    catId: req.params.catId,
                    subCatId: req.params.subCatId,
                    exCatId: req.params.exCatId,
                    brandList: brandList,
                    typeList: typeList,
                    cartItems: cartItems
                })
            }
            else {
                console.log("Data not found");
                return res.redirect("back");
            }
        }
        else {
            console.log("Data not found");
            return res.redirect("back");
        }

    } catch (error) {
        console.log("Something worng : " + error);
        return res.redirect("back");
    }
}

// Price filter
module.exports.getPriceFilter = async (req, res) => {
    try {

        if (req.body) {

            let products = await Product
                .find({ categoryId: req.body.catId, subCategoryId: req.body.subCatId, exCategoryId: req.body.exCatId });

            if (products) {

                let productData = products.filter((v) => {
                    if (v.price >= req.body.minPrice && v.price <= req.body.maxPrice) {
                        return v
                    }
                })

                res.render("User/priceFilter", {
                    productData: productData
                })

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
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}

// Brand Filter
module.exports.getBrandFilter = async (req, res) => {
    try {

        if (req.body) {

            // console.log(req.body);

            let products = await Product
                .find({ categoryId: req.body.catId, subCategoryId: req.body.subCatId, exCategoryId: req.body.exCatId, brandId: req.body.brandId });

            if (products) {

                // console.log(products);

                res.render("User/priceFilter", {
                    productData: products
                })

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
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}

// Type Filter
module.exports.getTypeFilter = async (req, res) => {
    try {

        if (req.body) {

            // console.log(req.body);

            let products = await Product
                .find({ categoryId: req.body.catId, subCategoryId: req.body.subCatId, exCategoryId: req.body.exCatId, typeId: req.body.typeId });

            if (products) {

                // console.log(products);

                res.render("User/priceFilter", {
                    productData: products
                })

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
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}

// All Data
module.exports.getAllFilterData = async (req, res) => {
    try {

        if (req.body) {

            // console.log(req.body);

            let products = await Product
                .find({ categoryId: req.body.catId, subCategoryId: req.body.subCatId, exCategoryId: req.body.exCatId });

            if (products) {

                // console.log(products);

                res.render("User/priceFilter", {
                    productData: products
                })

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
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}

// Single Product Detail
module.exports.singleProduct = async (req, res) => {
    try {
        let cartItems = 0;
        if (req.user) {
            cartItems = await Cart.find({ userId: req.user.id , status : "pending"}).countDocuments();
        }

        let categoryData = await Category.find({});
        let subCategoryData = await SubCategory.find({});
        let exCategoryData = await ExtraCategory.find({});

        if (req.params.id) {
            let product = await Product.findById(req.params.id);
            if (product) {
                return res.render("User/singleProduct", {
                    product: product,
                    catData: categoryData,
                    subCatData: subCategoryData,
                    exCatData: exCategoryData,
                    cartItems: cartItems
                })
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
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}

// Add to Cart
module.exports.addToCart = async (req, res) => {
    try {

        if (req.body) {

            let checkCart = await Cart.findOne({ productId: req.body.productId, userId: req.user.id });
            if (checkCart) {
                console.log("Item already into cart.")
                res.redirect("back");
            }
            else {
                req.body.createdDate = new Date().toLocaleString();
                req.body.updatedDate = new Date().toLocaleString();
                let addCart = await Cart.create(req.body);
                if (addCart) {
                    console.log("Item added to cart.")
                    res.redirect("back");
                }
                else {
                    console.log("Item not added.")
                    res.redirect("back");
                }
            }

        }
        else {
            console.log("Data not found.")
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}

// View Cart
module.exports.viewCart = async (req, res) => {
    try {

        let cartItems = 0;
        if (req.user) {
            cartItems = await Cart.find({ userId: req.user.id , status : "pending", status : "pending"}).countDocuments();
        }

        let categoryData = await Category.find({});
        let subCategoryData = await SubCategory.find({});
        let exCategoryData = await ExtraCategory.find({});

        if (req.user) {

            let cartData = await Cart.find({ userId: req.user.id , status : "pending", status : "pending"}).populate("userId").populate("productId").exec();
            // console.log(cartData);

            res.render("User/shoppingCart", {
                catData: categoryData,
                subCatData: subCategoryData,
                exCatData: exCategoryData,
                cartData: cartData,
                cartItems: cartItems
            });
        }
        else {
            console.log("Data not found");
            res.redirect("back");
        }


    } catch (error) {
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}

// Update Quantity
module.exports.updateQuantity = async (req, res) => {
    try {

        if (req.body) {

            let checkUserCart = await Cart.findOne({ _id: req.body.cartId, userId: req.body.userId });
            if (checkUserCart) {
                let updateQty = await Cart.findByIdAndUpdate(req.body.cartId, { quantity: req.body.newQty });
                if (updateQty) {
                    console.log("Quantity updated.");
                    res.status(200).json({ data: "Updated" });
                }
                else {
                    console.log("Quantity not updated");
                    res.redirect("back");
                }
            }
            else {
                console.log("Item not found");
                res.redirect("back");
            }

        }
        else {
            console.log("Data not found");
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}

// Delete Cart Item
module.exports.deleteItem = async (req, res) => {
    try {

        if (req.params.id) {

            let deleteItem = await Cart.findByIdAndDelete(req.params.id);
            if (deleteItem) {
                console.log("Item deleted.");
                res.redirect("back");
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
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}

// Payment Checkout
module.exports.checkout = async (req, res) => {
    try {

        let total = 0;
        if (req.user) {

            let cartData = await Cart.find({ userId: req.user.id , status : "pending", status : "pending"}).populate("userId").populate("productId").exec();
            // console.log(cartData);

            if (cartData) {
                cartData.map((v) => {
                    total += parseInt(v.productId.price)*parseInt(v.quantity);
                })
            }
        }

        res.render("User/checkoutPay",{
            total : total,
            name : req.user.name
        });

    } catch (error) {
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}

module.exports.payment = async (req, res) => {

    try {

        let total = 0;
        if (req.user) {

            let cartData = await Cart.find({ userId: req.user.id , status : "pending", status : "pending"}).populate("userId").populate("productId").exec();
            // console.log(cartData);

            if (cartData) {
                cartData.map((v) => {
                    total += parseInt(v.productId.price)*parseInt(v.quantity);
                })
            }
        }

        if (req.user) {
            stripe.customers.create({
                email: req.body.stripeEmail,
                source: req.body.stripeToken,
                name: req.user.name
            })
                .then((customer) => {

                    return stripe.charges.create({
                        amount: total,
                        description: 'Web Development Product',
                        currency: 'INR',
                        customer: customer.id
                    });
                })
                .then(async (charge) => {

                    let orderedData = await Cart.find({userId : req.user.id, status : "pending"});
                    let changeStatus = await Cart.updateMany({userId : req.user.id},{status : "confirm"});
                    orderedData.map((v)=>{
                        v.status = "confirm"
                    });
                    // console.log(orderedData);

                    if(orderedData){
                        let insertOrders = await Order.insertMany(orderedData);
                        console.log("Added to order");
                        res.redirect("/orders");
                    }
                    else{
                        console.log("Data not found");
                        res.redirect("back");
                    }
                })
                .catch((err) => {
                    res.send(err);
                });
        }
        else {
            console.log("Data not found");
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : " + err);
        res.redirect("Back");
    }

}

// My Orders
module.exports.orders = async (req,res) => {
    try {

        let cartItems = 0;
        if (req.user) {
            cartItems = await Cart.find({ userId: req.user.id , status : "pending", status : "pending"}).countDocuments();
        }

        let categoryData = await Category.find({});
        let subCategoryData = await SubCategory.find({});
        let exCategoryData = await ExtraCategory.find({});
        let productData = await Product.find({});
        let orderData = await Order.find({userId : req.user.id,status : "confirm"}).populate("productId").exec();

        return res.render("User/myOrders", {
            catData: categoryData,
            subCatData: subCategoryData,
            exCatData: exCategoryData,
            productData: productData,
            cartItems: cartItems,
            orderData: orderData
        })

    } catch (error) {
        console.log("Something worng : " + error);
        return res.redirect("back");
    }
}

// Cancel Order
module.exports.cancelOrder = async (req,res) => {
    try {

        if (req.params.id) {

            let deleteItem = await Order.findByIdAndUpdate(req.params.id, {status : "cancelled"});
            if (deleteItem) {
                console.log("Item removed.");
                res.redirect("back");
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
        console.log("Something wrong : " + error);
        res.redirect("back");
    }
}