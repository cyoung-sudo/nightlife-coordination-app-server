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

module.exports = businessRoutes;