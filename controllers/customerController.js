// const CollectionModel = require("../models/CollectionModel");
// const UserModel = require("../models/UserModel");

// //update user details
// const updateUserDetails = async (req, res) => {
//   // console.log("walletaddress", req.body);
//   // console.log("update user details calling");
//   const { walletaddress, name, username, propic } = req.body;
//   // console.log("wallet address", walletaddress);
//   // var profilepic = Buffer.from(propic, 'base64')

//   //update user details

//   try {
//     const user = await UserModel.findOneAndUpdate(
//       { walletaddress: walletaddress },
//       {
//         name: name,
//         username: username,
//         propic : propic
//       },
//       { new: true }
//     );
//     // console.log("user");
//     // console.log(user);
//     if (user) {
//       return res.status(200).json({
//         message: "success",
//         user: user,
//       });
//     } else {
//       return res.status(400).json({
//         message: "error",
//       });
//     }
//   } catch (err) {
//     return res.status(400).json({
//       message: err,
//     });
//   }
// };

// const createCollection = async (req, res) => {
//   // console.log("hello");
//   // console.log("handle create collection calling, ", req.body);
//   const {
//     collectionId,
//     collectionName,
//     collectionDescription,
//     logoImg,
//     NFTcount,
//     floorprize,
//     totalprize,
//   } = req.body;
//   // console.log("passing data", collectionName, collectionDescription);

//   try {
//     const collection = await CollectionModel.findOne({
//       collectionName: collectionName,
//     });

//     if (collection) {
//       return res.status(200).json({
//         message: "Already exists with this Collection Name!",
//         collectionName: collection.collectionName,
//         view: collection,
//       });
//     } else {
//       const newCollection = await CollectionModel.create({
//         // colletionId can get by calling the function "getCollectionCount"
//         // collectionId: newCollection.collectionId,
//         collectionName: collectionName,
//         collectionDescription: collectionDescription,
//         logoImg: { data: logoImg, contentType: "image/png" },
//         NFTcount: NFTcount,
//         floorprize: floorprize,
//         totalprize: totalprize,
//       });

//       return res.status(202).json({
//         message: "Successfully Added!",
//         name: newCollection.collectionName,
//       });
//     }
//   } catch (err) {
//     return res.status(500).json({
//       message: err,
//     });
//   }
// };

// const getAllUsers = async (req, res) => {
//   // console.log("hello");
//   try {
//     const users = await UserModel.find({ usertype: "Customer" });

//     // console.log(users);
//     return res.status(200).json({
//       status: "success",
//       data: users,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       status: "error",
//     });
//     // console.log("error");
//   }
// };

// const getAllCollections = async (req, res) => {
//   // console.log("hello");
//   try {
//     const collections = await CollectionModel.find();

//     // console.log(collections);
//     return res.status(200).json({
//       status: "success",
//       collections: collections,
//     });
//   } catch (error) {
//     // console.log("error: ", error);
//   }
// };

// const saveUserActivity = async (req, res) => {
//   console.log("in save user activity");
//   console.log(req.body);
// }

// module.exports = {
//   updateUserDetails,
//   getAllUsers,
//   createCollection,
//   getAllCollections,
//   saveUserActivity
// };

const ActivityDetailsModel = require("../models/ActivityDetailsModel");
const ActivityModel = require("../models/ActivityModel");
const CollectionModel = require("../models/CollectionModel");
const UserModel = require("../models/UserModel");
const UserStatusModel = require("../models/UserStatusModel");

//update user details
const updateUserDetails = async (req, res) => {
  // console.log("walletaddress", req.body);
  // console.log("update user details calling");
  const { walletaddress, name, username, propic } = req.body;
  // console.log("wallet address", walletaddress);
  // var profilepic = Buffer.from(propic, 'base64')

  //update user details

  try {
    const user = await UserModel.findOneAndUpdate(
      { walletaddress: walletaddress },
      {
        name: name,
        username: username,
        propic: propic,
      },
      { new: true }
    );
    console.log("user");
    console.log(user);
    if (user) {
      return res.status(200).json({
        message: "success",
        user: user,
      });
    } else {
      return res.status(400).json({
        message: "error",
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: err,
    });
  }
};

const createCollection = async (req, res) => {
  // console.log("hello");
  // console.log("handle create collection calling, ", req.body);
  const {
    userid,
    collectionName,
    collectionDescription,
    logoImg,
    ownersCount,
  } = req.body;

  try {
    const user = await UserModel.findOne({ walletaddress: userid });
    // console.log("user",user," ",user._id);
    if (user) {
      try {
        const collection = await CollectionModel.findOne({
          collectionName: collectionName,
        });

        if (collection) {
          return res.status(200).json({
            message: "Already exists with this Collection Name!",
            collectionName: collection.collectionName,
            view: collection,
          });
        } else {
          const newCollection = await CollectionModel.create({
            userid: user._id,
            collectionName: collectionName,
            collectionDescription: collectionDescription,
            logoImg: logoImg,
            ownersCount: ownersCount,
          });

          return res.status(202).json({
            message: "Successfully Added!",
            name: newCollection.collectionName,
          });
        }
      } catch (err) {
        return res.status(500).json({
          message: err,
        });
      }
    } else {
      return res.status(400).json({
        message: "user not existing",
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: err,
    });
  }
};

const getAllUsers = async (req, res) => {
  out = [];
  try {
    const users = await UserModel.find({ usertype: "Customer" });
    const blockusers = await UserStatusModel.find({ isblocked: true });

    const out = users.filter((user) => {
      return !blockusers.some((blockuser) => {
        return blockuser.userid.equals(user._id);
      });
    });

    // console.log(users);
    return res.status(200).json({
      status: "success",
      data: out,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
    });
    // console.log("error");
  }
};

const getAllBlockedUsers = async (req, res) => {
  out = [];
  try {
    const users = await UserModel.find({ usertype: "Customer" });
    const blockusers = await UserStatusModel.find({ isblocked: true });

    const out = users.filter((user) => {
      return blockusers.some((blockuser) => {
        return blockuser.userid.equals(user._id);
      });
    });

    // console.log(users);
    return res.status(200).json({
      status: "success",
      data: out,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
    });
    // console.log("error");
  }
};

const getAllCollections = async (req, res) => {
  // console.log("hello");
  try {
    const collections = await CollectionModel.find();

    // console.log(collections);
    return res.status(200).json({
      status: "success",
      collections: collections,
    });
  } catch (error) {
    // console.log("error: ", error);
  }
};

const saveUserActivity = async (req, res) => {
  console.log("in save user activity");
  console.log(req.body);

  // find the user that who done the activity
  try {
    const user  = await UserModel.findOne({walletaddress: req.body.transaction.from});
    console.log("user", user);
    if(user){
      const userId = user._id;
      console.log("Inside user userId", userId);
      //Create a new activity
      const newActivity = await ActivityModel.create({
        userid: userId,
        activitytype: req.body.activityType,
        NFTid: req.body.tokenID
      });

      console.log("new activity", newActivity);
      if (newActivity) {
        //Create a new activity details for the new activity
        const Price = parseInt(req.body.transaction.value.hex, 16)

        const newActivityDetails = await ActivityDetailsModel.create({
          activityId: newActivity._id,
          price: Price,
          fromwalletaddress: '0x0000...',
          towalletaddress: req.body.transaction.from,
          time: req.body.transactionTime,
          transactionhash: req.body.transaction.hash,
        });
        console.log("new activity details", newActivityDetails);
        if (newActivityDetails) {
          return res.status(200).json({
            message: "success",
          });
        }else{
          return res.status(400).json({
            message: "error",
          });
        }
      }else{
        return res.status(400).json({
          message: "error",
        });
      }
    }else{
      return res.status(400).json({
        message: "error",
      });

    }
  } catch (error) {
    return res.status(400).json({
      message: "error",
    });
  }

};

const handleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const blockuser = await UserStatusModel.create({
      userid: id,
      isblocked: true,
    });

    return res.status(200).json({
      data: blockuser,
      message: "Successfully Blocked!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured!",
    });
  }
};

const handleUnblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const blockuser = await UserStatusModel.findOneAndDelete({
      userid: id,
    });

    return res.status(200).json({
      data: blockuser,
      message: "Successfully Unblocked!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured!",
    });
  }
};

module.exports = {
  updateUserDetails,
  getAllUsers,
  createCollection,
  getAllCollections,
  saveUserActivity,
  handleBlockUser,
  getAllBlockedUsers,
  handleUnblockUser,
};
