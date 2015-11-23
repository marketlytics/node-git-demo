var express = require('express');
var router = express.Router();
var fs = require('fs');
var git = require('git-controller');
var myRepo = git(__dirname + '/../testing');


exports.index = function(req, res) {
    getBranches(res);
};

exports.getRepo = function(req, res) {
    res.redirect('/git');
};

function getBranches(res) {
    myRepo.getBranches(function(err, result) {
        if (err) return console.log(err);
        remoteLocalStatus(res, result.current);
    });
}

function remoteLocalStatus(res, currentBranch) {
    myRepo.remote('origin', ['show'], function(err, result) {
        if (err) return console.log(err);
        var head = null;

        for (var i = 0; i < result.localInfo.length; i++) {
            if (result.localInfo[i].branchName == currentBranch) {
                head = result.localInfo[i];
                result.localInfo.splice(i, 1);
                break;
            }
        }

        res.render('index', {
            title: 'Node API',
            localHead: head,
            remoteInfo: result.remoteInfo,
            localInfo: result.localInfo
        });
    });
}

exports.checkout = function(req, res) {
    var flags = [];
    var branch = req.params.branch;

    if (req.params.action === "track") {
        flags = ['--track'];
        branch = 'origin/' + branch;
    }

    myRepo.checkout(branch, flags, function(err, result) {
        if (err) return console.log(err);
        remoteLocalStatus(res, result.current);
    });
};

exports.pull = function(req, res) {
    myRepo.pull('origin', req.params.branch, [], {
        username: null,
        password: null
    }, function(err, result) {
        if (err) return console.log(err);

        getBranches(res);
    });
};

exports.fetch = function(req, res) {
    myRepo.fetch(['--all', '-p'], {
        username: null,
        password: null
    }, function(err, result) {
        if (err) return console.log(err);
        getBranches(res);
    });
};