const express = require("express");
const businessRoutes = express.Router();

const yelp = require("yelp-fusion");
const client = yelp.client(process.env.YELP_API);

//----- Search for businesses
businessRoutes.post("/api/business/search", (req, res) => {
  client.search({
    location: req.body.location
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

module.exports = businessRoutes;