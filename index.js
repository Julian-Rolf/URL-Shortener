const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const nanoid = require('nanoid');
const pug = require('pug');
const bodyParser = require('body-parser');
const config = require('./config');
const helper = require('./helper/helper.js');

// setup db
const mongo_uri = process.env.MONGO_URI;
const db = require('monk')(mongo_uri);
const collection = db.get('main');

// setup express
const app = express();
app.use(morgan('tiny'));
app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
const port = config.port || 8080;

app.get('/', (req, res) => {
    res.render('index.pug');
});

app.post('/', async (req, res) => {
    const url = await helper.validate(req.body);

    if (url === null) {
        res.status(400).json({ message: "Please provide a valid url" });
        return;
    }

    let doc = await collection.findOne({ url: url }).catch((err) => {
        res.sendStatus(500);
        return;
    });

    if (doc !== null) {
        res.json({ message: `127.0.0.1/u/${doc.slug}` });
        return;
    }

    let slug = nanoid.nanoid(5);

    collection.insert({ slug: slug, url: url, creationDate: Date.now() });
    res.json({ message: `127.0.0.1/u/${slug}` });
});

app.get('/u/:slug', async (req, res) => {
    let { slug } = req.params;

    let doc = await collection.findOne({ slug: slug }).catch((err) => {
        res.sendStatus(500);
        return;
    });

    if (doc === null || doc.url === null) {
        res.sendStatus(404);
        return;
    }

    res.redirect(doc.url);
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

