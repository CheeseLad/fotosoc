const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const CommitteeModel = require('./models/committee');
const PreviousCommitteeModel = require('./models/previouscommittee');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/fotosoc_website_data')

app.get('/get-committee', async (req, res) => {
    CommitteeModel.find()
    .then(committee => res.json(committee))
    .catch(err => res.json(err))
});

app.get('/get-previous-committee', async (req, res) => {
    PreviousCommitteeModel.find()
    .then(committee => res.json(committee))
    .catch(err => res.json(err))
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
