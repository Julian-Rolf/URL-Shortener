const Joi = require('joi');
const http = require('http');
const https = require('https');
const Url = require('url');

const schema = Joi.object({
    url: Joi.string().required()
});

function GetHttp(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (response) => {
            resolve(response.statusCode);
        });
    });
}

function GetHttps(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            resolve(response.statusCode);
        });
    });
}

module.exports.validate = async function (document) {
    try {
        const value = await schema.validateAsync(document);
        const url = Url.parse(value.url);
        let statusCode = 400;

        if (url.protocol === 'https:') {
            statusCode = await GetHttps(value.url);
        } else if (url.protocol === 'http:') {
            statusCode = await GetHttp(value.url);
        } else {
            return false;
        }

        if (statusCode === 200 || statusCode === 301) return true;
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
};