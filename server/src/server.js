const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const dialogFlow = require('./dialogflow');
const fulfillment = require('./fulfillment');
const shortId = require('shortid');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('chatbot', async (req, res) => {
    const resp = await fulfillment.read(req);
    res.send(resp);
});

app.post('/messages', async (req, res) => {
    const chat = {
        ...req.body,
        id: shortId.generate(),
        createdAt: new Date().toISOString()
    };
    const query = chat.message;
    const response = await dialogFlow.send1(query);
    const m = response.data.result.fulfillment.messages.find(m => m.type === 0);
    const message = m ? m.speech : '';
    const responseBody = {
        response: response.data,
        message: message,
        card: response.data.result.fulfillment.messages.find(m => m.type === 1),
        suggestion: response.data.result.fulfillment.messages.find(m => m.type === 2),
        createdAt: new Date().toISOString(),
        id: shortId.generate(),
        chat
    };
    res.send(responseBody);
});

app.post('/messages-ch', async (req, res) => {
    // simulate actual db save with id and createdAt added
    console.log(req.body);
    const chat = {
        ...req.body,
        id: shortId.generate(),
        createdAt: new Date().toISOString()
    };
    const query = chat.message;
    const response = await dialogFlow.send1(query);
    console.log(response.data.result.fulfillment);
    const m = response.data.result.fulfillment.messages.find(m => m.type === 0);
    const message = m ? m.speech : '';
    const responseBody = {
        response: response.data,
        message: message,
        card: response.data.result.fulfillment.messages.find(m => m.type === 1),
        suggestion: response.data.result.fulfillment.messages.find(m => m.type === 2),
        createdAt: new Date().toISOString(),
        id: shortId.generate(),
        chat
    };
    // console.log({req: req.body, resp: responseBody});
    res.send(responseBody)
});

app.listen(process.env.PORT || 5000, () => console.log('Listening at 5000'))