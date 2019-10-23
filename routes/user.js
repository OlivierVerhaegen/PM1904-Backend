const logger = require('../logger');
const express = require('express');
const router = express.Router();

const SQLConnection = require('../database');

function validateStudentNumber(studentNumber) {
    const lowerCase = studentNumber.toLowerCase();
    const startsWithS = lowerCase.startsWith('s');
    const correctLength = lowerCase.length == 9;

    if (startsWithS && correctLength) {
        return true;
    } else {
        return false;
    }
}