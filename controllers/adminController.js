const UserModel = require("../models/UserModel");
const AdminDetailsModel = require("../models/AdminDetailsModel");

const handleAddAdmin = async (req, res) => {
  console.log("hello");
  console.log("handle add admin calling, ", req.body);
  const { name, walletaddress, email, mobilenumber, DOB } = req.body;
  console.log("passing data", name, walletaddress, email, mobilenumber, DOB);

  try {
    const user = await UserModel.findOne({
      walletaddress: walletaddress,
    });

    if (user) {
      return res.status(200).json({
        message: "Already exists with this Wallet Address!",
        AdminName: user.name,

        view: user,
      });
    } else {
      const newUser = await UserModel.create({
        walletaddress: walletaddress,
        usertype: "Admin",
        name: name,
        username: "Admin",
        propic: null,
      });

      const newAdmin = await AdminDetailsModel.create({
        userid: newUser._id,
        email: email,
        DOB: DOB,
        mobilenumber: mobilenumber,
      });

      return res.status(201).json({
        message: "Successfully Added!",
        name: newUser.name,
        email: newAdmin.email,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error Occured!",
    });
  }
};

const handleUpdateAdmin = async (req, res) => {
  console.log("handle update admin calling, ", req.body);
  const { walletaddress, email, mobilenumber, propic } = req.body;
  console.log("passing data", email, mobilenumber, propic);

  //Find and update admin details
  try {
    //Update userModel and adminDetailsModel
    const updatedUser = await UserModel.findOneAndUpdate(
      { walletaddress: walletaddress },
      { propic: { data: propic, contentType: "image/png" } },
      { new: true }
    );
    console.log("user", updatedUser);
    if (updatedUser) {
      const updatedAdmin = await AdminDetailsModel.findOneAndUpdate(
        { userid: updatedUser._id },
        { email: email, mobilenumber: mobilenumber },
        { new: true }
      );
      console.log("admin", updatedAdmin);
      return res.status(200).json({
        message: "Successfully Updated!",
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Error Occured!",
        status: 400,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Error Occured!",
    });
  }
};

const getAllAdmins = async (req, res) => {
  console.log("hello");
  const out = [];

  try {
    const users = await UserModel.find({ usertype: "Admin" });
    for (var i = 0; i < users.length; i++) {
      const admin = await AdminDetailsModel.findOne({
        userid: users[i]._id,
      }).populate("userid");
      out.push(admin);
    }

    console.log(out);
    return res.status(200).json({
      status: "success",
      data: out,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured!",
    });
  }
};

const getAdminDetails = async (req, res) => {
  console.log("handle get admin calling, ", req.body);
  const { walletaddress } = req.body;
  console.log("passing data", walletaddress);

  try {
    const user = await UserModel.findOne({ walletaddress: walletaddress });
    // console.log("user", user);

    const admin = await AdminDetailsModel.findOne({
      userid: user._id,
    }).populate("userid");
    console.log("admin", admin);
    return res.status(200).json({
      message: "Successfully Fetched!",
      data: admin,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error Occured!",
    });
  }
};

const deleteAdmin = async (req, res) => {
  console.log("hello delete");
  try {
    const { id } = req.params;
    console.log(id);

    const admin = await AdminDetailsModel.deleteOne({ userid: id });
    const user = await UserModel.deleteOne({ _id: id });

    console.log("Deleted Admin", admin);
    console.log("Deleted User", user);

    return res.status(200).json({
      message: "Successfully Deleted!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured!",
    });
  }
};

module.exports = {
  handleAddAdmin,
  getAdminDetails,
  handleUpdateAdmin,
  getAllAdmins,
  deleteAdmin,
};