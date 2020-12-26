const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const nanoid = require('nanoid');
const config = require('./config');

// setup db
const mongo_uri = process.env.MONGO_URI;
const db = require('monk')(mongo_uri);
const collection = db.get('main');

// setup express
const app = express();
app.use(morgan('tiny'));
app.use(helmet());
const port = config.port || 8080;

app.get('/', (req, res) => {
    res.send('Hello Test!');
});

app.post('/', (req, res) => {
    let { url } = req.body;
});

app.get('/:id', (req, res) => {
    let { id } = req.params;
    console.log(id);

    res.send('Worked');
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});