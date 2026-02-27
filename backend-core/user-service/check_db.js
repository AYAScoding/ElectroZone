const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const user = await User.findOne({ email: 'ayoubasri@gmail.com' });
        console.log(user);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
