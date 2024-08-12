const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const slugify = require('./utils/slugify');
const CommitteeModel = require('./models/committee');
const PreviousCommitteeModel = require('./models/previouscommittee');
const MemberPortfolio = require('./models/memberportfolio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: false,
    optionSuccessStatus: 200
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.use(cors(corsOptions));

mongoose.connect(process.env.TEST_MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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

app.post('/api/memberPortfolios', upload.any(), async (req, res) => {
    try {
        const { name, bio, facebook, twitter, linkedin, galleries } = req.body;
        const parsedGalleries = Array.isArray(galleries) ? galleries : [galleries];
        const files = req.files;

        const newGalleries = parsedGalleries.map((gallery, index) => {
            const galleryImages = files.filter(file => file.fieldname.startsWith(`galleries[${index}][images]`)).map(file => file.path);
            return { ...gallery, images: galleryImages };
        });

        const slug = slugify(name);

        const newMemberPortfolio = new MemberPortfolio({
            name,
            bio,
            facebook,
            twitter,
            linkedin,
            galleries: newGalleries,
            slug
        });

        await newMemberPortfolio.save();
        res.status(201).send(newMemberPortfolio);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});