const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const nanoid = require('nanoid');
const path = require('path');
const pug = require('pug');
const bodyParser = require('body-parser');
const config = require('./config');

// setup db
const mongo_uri = process.env.MONGO_URI;
const db = require('monk')(mongo_uri);
const collection = db.get('main');

// setup express
const app = express();
app.use(morgan('tiny'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', './views');
const port = config.port || 8080;

app.get('/', (req, res) => {
    res.render('index.pug');
});

app.post('/', (req, res) => {
    let { url } = req.body;
    let slug = nanoid.nanoid(5);

    collection.insert({ slug: slug, url: url });
    res.send(`127.0.0.1/${slug}`);
});

app.get('/:slug', (req, res) => {
    let { slug } = req.params;
    collection.findOne({ slug: slug }).then((doc) => {
        res.redirect(doc.url);
    }).catch((err) => {
        res.sendStatus(404);
    });
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

