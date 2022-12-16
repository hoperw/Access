const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Location = require('./../../models/locationModel');


dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE
mongoose.connect(DB, {
  useNewURLParser: true
})


const locations = JSON.parse(fs.readFileSync(`${__dirname}/locations.json`, 'utf-8'));

const importData = async () => {
  try {
    await Location.create(locations);
    process.exit();
  } catch(err) {
    console.log(err)
  }
}
const deleteData = async() => {
  try {
    await Location.deleteMany();
    process.exit();
  } catch(err) {
    console.log(err)
  }
}

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}