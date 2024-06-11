const mongoose = require('mongoose');

const CommitteeSchema = new mongoose.Schema({
  number: String,
  name: String,
  position: String,
  image: String,
  social1: String,
  social2: String,
  email: String
});

const CommitteeModel = mongoose.model('committee', CommitteeSchema);
module.exports = CommitteeModel;