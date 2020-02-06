const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Planner = require('../models/planner');

router.get('/:id', function(req, res){
    const id = req.params.id;
    Planner.findById(id, function(err, plan) {
        if (err) {
            res.send(err);
        } else {
            res.send(plan);
        }
    });
});

router.post('/', function(req, res){
    const plan = new Planner({
        _id: new mongoose.Types.ObjectId(),
        data: req.body.itemString
    });

    plan.save().then(result => {
        res.send('saved to database');
    }).catch(err => res.send(err));
});

router.patch('/:id', function(req, res){
    const id = req.params.id;
    Planner.findById(id, function(err, plan){
        const updatedPlan = {
            data: req.body.itemString
        };
        Planner.updateOne({ _id : id }, updatedPlan).then(result => {
            res.send('plan has been updated');
        }).catch(err => res.send(err));
    }).catch(err => res.send('cannot find plan with that id'));
});

module.exports = router;
