/* eslint-disable prefer-promise-reject-errors */
var _ = require("underscore");
var db = require("../config/firestore");

get = (option) => {
    return new Promise((res, rej) => {
        if(option){
            res();
        }else{
            rej(1243);
        }
    });
};