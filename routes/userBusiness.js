const express = require("express");
const userBusinessRoutes = express.Router();
// Models
const UserBusiness = require("../models/userBusinessModel");

userBusinessRoutes.route("/api/userBusiness")
//----- Retrieve all user-businesses
.get((req, res) => {
  UserBusiness.find({})
  .then(userBusinesses => {
    res.json({
      success: true,
      userBusinesses
    })
  })
  .catch(err => console.log(err));
})
//----- Add new user-business
// (Max 5 businesses to minimize requests)
.post((req, res) => {
  UserBusiness.find({
    userId: req.body.userId,
  })
  .then(userBusinesses => {
    // Check limit
    if(userBusinesses.length > 4) {
      return { error:  "Can only add up to 5 businesses" };
    } else {
      // Check for duplicate
      let result = userBusinesses.some(userBusiness => {
        return userBusiness.businessId === req.body.businessId;
      });

      if(result) {
        return { error: "Business already added" };
      } else {
        // Created new user-business
        let newUserBusiness = new UserBusiness({
          userId: req.body.userId,
          businessId: req.body.businessId
        });
        
        // Save user-business
        return newUserBusiness.save();
      }
    }
  })
  .then(result => {
    if(result.error) {
      res.json({
        success: false,
        message: result.error
      });
    } else {
      res.json({ success: true });
    }
  })
  .catch(err => console.log(err));
})
//----- Delete given user-buisness
.delete((req, res) => {
  UserBusiness.findOneAndDelete({
    userId: req.body.userId,
    businessId: req.body.businessId
  })
  .then(deletedDoc => {
    res.json({ success: true });
  })
  .catch(err => console.log(err));
});

userBusinessRoutes.route("/api/userBusiness/user")
//----- Retrieve user-businesses for given user
.post((req, res) => {
  UserBusiness.find({
    userId: req.body.userId
  })
  .then(userBusinesses => {
    res.json({
      success: true,
      userBusinesses
    });
  })
  .catch(err => console.log(err));
})
//----- Delete user-businesses for authenticated user
.delete((req, res) => {
  UserBusiness.deleteMany({
    userId: req.body.userId
  })
  .then(deleteCount => {
    res.json({ success: true });
  })
  .catch(err => console.log(err));
});

module.exports = userBusinessRoutes;