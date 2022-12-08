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
businessRoutes.post("/api/business/getBusinesses", async (req, res) => {
  let businesses = [];
  for(let userBusiness of req.body.userBusinesses) {
    let business = await client.business(userBusiness.businessId);
    businesses.push(business.jsonBody);
  }

  res.json({
    success: true,
    businesses
  });
});

module.exports = businessRoutes;