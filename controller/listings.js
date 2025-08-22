const Listing = require("../models/listing")

module.exports.index=async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing });
};

module.exports.renderNewForm=async (req, res) => {
    res.render("listings/new.ejs");

};