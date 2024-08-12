const mongoose = require('mongoose');

const MemberPortfolioSchema = new mongoose.Schema({
  name: String,
  bio: String,
  facebook: String,
  twitter: String,
  linkedin: String,
  galleries: [
    {
      title: String,
      images: [String]
    }
  ],
  slug: String
});

const MemberPortfolioModel = mongoose.model('member_portfolio', MemberPortfolioSchema);
module.exports = MemberPortfolioModel;