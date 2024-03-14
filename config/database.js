const mongoose = require('mongoose')

const url = `mongodb+srv://bhargav625:bhargav625@cluster0.dswrgjv.mongodb.net/E-commerce`;

mongoose.connect(url)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })