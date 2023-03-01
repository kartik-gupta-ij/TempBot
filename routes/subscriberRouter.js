const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');

const Subscribers = require('../models/subscribers');
const cors = require('./cors');

const subscribersRouter = express.Router();

subscribersRouter.use(bodyParser.json());

subscribersRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Subscribers.find()
    .then((subscribes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subscribes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Subscribers.create(req.body)
    .then((subscriber) => {
        console.log('subscriber Created ', subscriber);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subscriber);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /subscriber');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Subscribers.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

subscribersRouter.route('/:subscriberId')
.get(cors.cors, (req,res,next) => {
    Subscribers.findById(req.params.subscriberId)
    .then((subscriber) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subscriber);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Subscribers/'+ req.params.subscriberId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Subscribers.findByIdAndUpdate(req.params.subscriberId, {
        $set: req.body
    }, { new: true })
    .then((subscriber) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subscriber);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Subscribers.findByIdAndRemove(req.params.subscriber)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = subscribersRouter;