require('dotenv').config();


// Contacts
const { contacts } = require('./contacts');


// Models
const Message = require('./models/Message');


// Packages
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const mongoose = require('mongoose');


// Connecting to the remote DB
mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log('Mongoose Connection Open ...');
    })
    .catch((err) => {
        console.log('Mongoose Connection Error!');
        console.log(err);
    });


// Twilio client
const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);


// Create express application
const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// APIs
app.get('/', async (req, res, next) => {
    res.send('Kisan Network');
});

app.get('/getContacts', async (req, res, next) => {
    res.status(200).json({ contacts });
});

app.post('/sendMessage/:contactID', async (req, res, next) => {
    const { contactID } = req.params;

    const contact = contacts.filter((c) => c.id === parseInt(contactID))[0];
    
    const { otp, text } = req.body;

    if (!otp || text.length === 0) {
        return res.status(403).json({ error: 'OTP or Text is missing!' });
    }

    const newMessage = new Message({ id: contactID, name: `${ contact.firstName } ${ contact.lastName }`, otp: otp });
    
    client.messages
        .create({
            body: `${ text }`,
            from: `${ process.env.TWILIO_PHONE_NUMBER }`,
            to: `+91${ contact.contact }`
        })
        .then(message => console.log(message));
        
    await newMessage.save();
    
    res.status(201).json({ message: 'Message sent successfully!' });
});

app.get('/getMessages', async (req, res, next) => {
    const messages = await Message.find({});

    return res.status(200).json({ messages });
});


app.listen(4500, () => {
    console.log('Server listening on port 4500 ...');
});