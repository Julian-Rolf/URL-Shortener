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
        const urlObj = Url.parse(value.url, true);
        let statusCode = 400;
        let url = value.url;

        if (urlObj.protocol === 'https:') {
            statusCode = await GetHttps(value.url);
        } else if (urlObj.protocol === 'http:') {
            statusCode = await GetHttp(value.url);
        } else {
            url = `https://${urlObj.href}`;
            statusCode = await GetHttps(url);
        }

        if (statusCode === 404) return null;
        return url;
    } catch (error) {
        console.error(error);
        return null;
    }
};