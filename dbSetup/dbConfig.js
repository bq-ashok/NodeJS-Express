var express = require('express');
var promise = require('bluebird');
var router = express.Router();
var pg = require('pg');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);

var connectionString = "postgres://postgres:postgres@localhost/nodejsassignment";
// var connectionString = 'postgres://localhost:5432/nodeJSAssignment'; // nodeJSAssignment is an example database name
var db = pgp(connectionString);

// var client = new pg.Client(conString);
// client.connect();
module.exports = db; 

