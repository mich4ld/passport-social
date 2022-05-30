const express = require('express');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

const app = express();

const {GoogleStrategy} = require('@mich4l/passport-google');

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    tokenFromRequest: (req) => {
        console.log(req.body);

        return req.body.credential;
    }
}, (payload, verified) => {
    console.log(payload);

    return verified(null, payload);
}));

app.post('/auth/google', passport.authenticate('google', {
    session: false,
}), (req, res) => {
    res.send('Success');
});

app.listen(8080, () => {
    console.log('Server started');
});