const express = require('express')
const path = require("path");
const app = express()

// #############################################################################
// Logs all request paths and method
app.use(function (req, res, next) {
  res.set('x-timestamp', Date.now())
  res.set('x-powered-by', 'cyclic.sh')
//   let region = process.env.region
//   if (region && region === 'us-east-2'){
//       return res.status(500).json({'message':'error',region})
//   }
  next();
});

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
app.use(express.static('public', options))

const multer = require('multer');
const upload = multer();

app.use('/send', upload.single('file'), (req, res) => {
  console.log(JSON.stringify(req.params,null,2))
  console.log(req.method)

  const formData = req.body;
  console.log('form data', formData);
  res.sendStatus(200);
});

app.use('/upload/:id?', async (req, res) => {
  console.log(req.method, req.params)
  console.log(req.body)
  res.statusCode = 307
  res.writeHead('307','Redirect Temporary', {
    'Location': `/send?q=${req.params.id}`
    // 'Location': `https://www.google.com/search?q=${req.params.id || 'rick roll'}`
  }).end()
})

// #############################################################################
// Log echo requests
app.use('/e/*', (req,res,next) => {
  var region = (process.env.region)? process.env.region : 'undefined'
  console.log(`[${region}] ${req.method} ${req.originalUrl}`);
  next()
})


// #############################################################################
// Catch all handler for all other request.
app.use('*', (req,res) => {
//   var region = (process.env.region)? process.env.region : 'undefined'
  res.json({
      message: 'msg: have a nice day',
//       region,
      path: req.originalUrl,
      at: new Date().toISOString(),
      params: req.params,
      env: process.env,
      headers: req.headers
    })
    .end()
})

module.exports = app
