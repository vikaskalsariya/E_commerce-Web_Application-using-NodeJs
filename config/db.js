const mongoose = require('mongoose')

const url = process.env.DATABASE_URL;

mongoose.connect(url)
    .then(() => {
        console.log('Connected to database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })
    