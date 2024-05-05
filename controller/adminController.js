let Admin = require("../model/Admin.js");
let Category = require("../model/Category.js");
let nodemailer = require("nodemailer");

const fs = require('fs');
const path = require('path')

// -------------Login -----------------
module.exports.Login = async (req, res) => {
    return res.redirect('/admin/dashboard')
}
// ------------------dashboard ----------------
module.exports.dashboard = async (req, res) => {
    try {
        return res.render('admin/dashboard');
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}
// ----------------view Add admin -----------------
module.exports.addAdmin = async (req, res) => {
    try {
        return res.render('admin/add_admin');
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

// ---------------- Add admin -----------------
module.exports.addAdminData = async (req, res) => {
    try {
        let = imgPath = '';
        if (req.file) {
            imgPath = Admin.AdminImgPath + '/' + req.file.filename;
        }
        else {
            return res.redirect('back')
        }
        if (req.body) {
            if (req.body.pass == req.body.cpass) {
                req.body.role = 'admin'
                req.body.Admin_Image = imgPath;
                req.body.password = req.body.pass;
                req.body.name = req.body.fname + " " + req.body.lname;
                req.body.isActive = true;
                req.body.createDate = new Date().toLocaleString();
                req.body.updateDate = new Date().toLocaleString();
                let data = await Admin.create(req.body);
                if (data) {
                    return res.redirect('back');
                }
                else {
                    console.log("Add admin Data note store in DB");
                    return res.redirect('back')
                }
            }
            else {
                console.log("Add admin side passwod and confirm password are not same")
                return res.redirect('back')
            }
        }
        else {
            console.log("data not get from Admin form");
            return res.redirect('back')
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// ----------------view All Admin -----------------
module.exports.viewAdmin = async (req, res) => {
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
        let AdminData = await Admin.find({
            $or: [
                { 'name': { $regex: `.*${search}.*`, $options: "i" } },
                { 'email': { $regex: `.*${search}.*`, $options: "i" } }
            ]
        }).limit(perPage)
            .skip(perPage * page);

        var totalDocumets = await Admin.find({
            $or: [
                { 'name': { $regex: `.*${search}.*`, $options: "i" } },
                { 'email': { $regex: `.*${search}.*`, $options: "i" } }
            ]
        }).countDocuments();
        let totalPages = Math.ceil(totalDocumets / perPage);
        if (AdminData) {
            return res.render('admin/view_admin', {
                AdminData: AdminData,
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
        let AdminData = await Admin.findById(req.params.id);
        AdminData.isActive = false;
        await AdminData.save();
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
        let AdminData = await Admin.findById(req.params.id);
        AdminData.isActive = true;
        await AdminData.save();
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
        let deleteData = await Admin.findById(req.params.id);
        if (deleteData.Admin_Image) {
            fs.unlinkSync(path.join(__dirname, "..", deleteData.Admin_Image));
        }
        else {
            console.log("Delete image not found");
            return res.redirect('back');
        }
        await Admin.findByIdAndDelete(req.params.id);
        return res.redirect('back')
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// ---------------- Update Data -----------------
module.exports.update = async (req, res) => {
    try {
        let AdminData = await Admin.findById(req.params.id);
        console.log()
        return res.render('admin/update_admin', {
            Data: AdminData,
        });
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

module.exports.UpdatedData = async (req, res) => {
    try {
        let AdminData = await Admin.findById(req.body.id);
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, "..", AdminData.Admin_Image))
            req.body.Admin_Image = Admin.AdminImgPath + '/' + req.file.filename;
        };
        if (req.body) {
            req.body.updateDate = new Date().toLocaleString();
            let updateData = await Admin.findByIdAndUpdate(req.body.id, req.body);
            if (updateData) {
                return res.redirect('/admin/view_admin');
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

// -----------------------profile-----------------------
module.exports.profile = async (req, res) => {
    try {
        return res.render('admin/adminProfile');
    } catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

// -------------update Admin Profile -----------------
module.exports.updateProfile = async (req, res) => {
    try {
        let AdminData = await Admin.findById(req.body.id);
        if (req.file) {
            if(AdminData.Admin_Image)
                {

                    fs.unlinkSync(path.join(__dirname, "..", AdminData.Admin_Image))
                }
            req.body.Admin_Image = Admin.AdminImgPath + '/' + req.file.filename;
        };

        if (req.body) {
            req.body.updateDate = new Date().toLocaleString();
            let updateData = await Admin.findByIdAndUpdate(req.body.id, req.body);
            if (updateData) {
                return res.redirect('/admin/logout');
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

// -------------Change Admin Password -----------------
module.exports.changePassword = async (req, res) => {
    try {
        if (req.body) {
            if (req.user.password == req.body.password) {
                if (req.body.newpassword == req.body.renewpassword) {
                    if (req.user.password != req.body.newpassword) {
                        let changePass = await Admin.findById(req.user.id);
                        if (changePass) {
                            changePass.password = req.body.newpassword;
                            let updatepass = await changePass.save();
                            if (updatepass) {
                                return res.redirect('/admin/logout');

                            }
                            else {
                                return res.redirect('back');
                            }
                        }
                        else {
                            return res.redirect('back');

                        }
                    }
                    else {
                        return res.redirect('back');
                    }
                }
                else {
                    return res.redirect('back');
                }
            }
            else {
                return res.redirect('back');
            }
        }
        else {
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

// -------------forgot password  -----------
module.exports.fpSendOTP = async (req, res) => {
    try {
        if (req.body) {
            const CurrentEmail = req.body.email;
            var OTP = Math.floor(1000 + Math.random() * 9000);
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "axyz44670@gmail.com",
                    pass: "whzxjgyqoqstsphi",
                },
            });

            const info = await transporter.sendMail({
                from: 'axyz44670@gmail.com', // sender address
                to: CurrentEmail, // list of receivers
                subject: "Forgot password ", // Subject line
                text: "You send the OTP? That otp not share to Other pepoles", // plain text body
                html: `Yor OTP is <b>${OTP}</b> that OTP valid only 1 min`, // html body
            });
            res.cookie('otp', OTP);
            res.cookie('admin', CurrentEmail)
            return res.render('admin/forgotOTPpage')

        }
        else {
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

module.exports.checkOTP = (req, res) => {
    try {
        var otp = req.cookies.otp;
        if (req.body.otp == otp) {
            return res.render('admin/forgotPassPage');

        }
        else {
            console.log('OTP is not patch');
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.forgotPassword = async (req, res) => {
    try {
        const adminData = await Admin.findOne({ email: req.cookies.admin });
        if (adminData) {
            if (req.body.password == req.body.cPass) {
                if (adminData.password != req.body.password) {
                    adminData.password = req.body.password;
                    let updatepass = await adminData.save();
                    res.clearCookie('otp')
                    res.clearCookie('admin')
                    if (updatepass) {
                        return res.redirect('/admin');
                    }
                    else {
                        console.log("password not forgoted");
                        return res.redirect('back');
                    }

                }
                else {
                    console.log("Old Password and new password is same");
                    return res.redirect('back');
                }

            }
            else {
                console.log("password and confirm password are not same");
                return res.redirect('back');
            }
        }
        else {
            console.log("Cookie Data not found")
            return res.redirect('back');
        }

    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}