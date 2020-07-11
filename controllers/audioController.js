const List = require('../models/list');
const Upload = require('../models/upload');
const Delete = require('../models/delete');
const Replace = require('../models/replace');

const formidable = require('formidable');
const async = require('async');

global.counter = 0;
global.uploadLock = 0;
console.log('From AUDIO CONTROLLER ' + global.uploadLock)


// REPLACE function when submitting from composer page
exports.replace_function = function (req, res) {
  async.await({
      replace_file: function (callback) {        
        res.render('replaceSuccess', {
          title: 'REPLACED',
          data: Replace.replace_file({
            name: 'fk-audio',            
            id: req.params.id,                   
            callback
          })
        });
      }
    },
    function (err, results) {
      res.send('ERRONEOUS!');
    })
}


// Home page list AUDIO files
exports.list_function = function (req, res) {  
  async.series({
      list_files: function (callback) {
        res.render('index', {
          title: 'SAMPLE',
          data: List.list_files({
            name: 'fk-audio',
            callback
          })
        });
      }
    },
    function (err, results) {
      res.send('ERRONEOUS!');
    });
}

// DISPLAY selected files to the home page upon submit
exports.dashboard_function = function (req, res) {
  async.series({
      list_files: function (callback) {
        res.render('dashboard', {
          title: 'Composer Palette',
          data: List.list_files({
            name: 'fk-audio',
            callback
          })
        });
      }
    },
    function (err, results) {
      res.send('ERRONEOUS!');
    });
}

// UPLOAD page
exports.upload_function = function (req, res, next) {
  global.counter++;    
  new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
      // res.status(415).send(field);      
    })
    .on('file', (name, file) => {
      res.status(200).send({                    
          data: Upload.upload_files({
            name: 'fk-audio',            
            fileName: file.name,
            fileToUpload: file.path            
          })          
        })
        
        .on('aborted', () => {
          console.error('Request aborted by the user');
        })
        .on('error', (err) => {
          console.error('Error', err)
          throw err
        })
        .on('end', () => {
          res.redirect('/');
        })
    })
    .on('success', (name, field) => {
      console.log('Field')
    })
}

exports.delete_function = function (req, res, next) {    
  global.counter--;
  global.uploadLock = 1;
  async.parallel({    
      delete_file: function (callback) {
        res.status(200).send('dashboard', {
          title: 'DELETED',
          data: Delete.delete_file({
            name: 'fk-audio',
            id: req.params.id,
            callback
          })
        });
      }
    },
    function (err, results) {
      res.send('ERRONEOUS!');
    });
}






