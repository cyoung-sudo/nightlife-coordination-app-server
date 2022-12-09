const express = require("express");
const businessRoutes = express.Router();

const yelp = require("yelp-fusion");
const client = yelp.client(process.env.YELP_API);

//----- Search for businesses
businessRoutes.post("/api/business/search", (req, res) => {
  client.search({
    term: req.body.term,
    location: req.body.location,
    price: req.body.price,
    open_now: req.body.open
  })
  .then(searchResults => {
    let businesses = searchResults.jsonBody.businesses;
    res.json({
      success: true,
      businesses
    });
  })
  .catch(err => console.log(err));
});

//----- Retrieve businesses for given business-id's
// >>>>> Handle API error for too many requests/sec <<<<<
businessRoutes.post("/api/business/getBusinesses", async (req, res) => {
  let promises = []

  for(let userBusiness of req.body.userBusinesses) {
    promises.push(client.business(userBusiness.businessId));
  }

  Promise.all(promises)
  .then(resData => {
    let businesses = [];
    for(let data of resData) {
      businesses.push(data.jsonBody);
    }
    res.json({
      success: true,
      businesses
    })
  })
  .catch(err => {
    res.json({
      success: false,
      message: "..."
    })
  })
});

module.exports = businessRoutes;