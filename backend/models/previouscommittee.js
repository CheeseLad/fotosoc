const mongoose = require('mongoose');

const PreviousCommitteeSchema = new mongoose.Schema({
  year: String,
  members: [
    {
      role: String,
      name: String
    }
  ]
});

const PreviousCommitteeModel = mongoose.model('previous_committee', PreviousCommitteeSchema);
module.exports = PreviousCommitteeModel;