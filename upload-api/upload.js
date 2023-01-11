const { IncomingForm } = require('formidable');
const express = require('express');
const sharp = require('sharp');

function Dropzone(req, res) {
    const form = new IncomingForm();
    form.on('file', (field, file) => {
        console.log('file', file.name);
    });
    form.on('end', () => {
        res.json();
    });
    form.parse(req);
}

module.exports = { Dropzone }