
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use('/', express.static('public'));
app.use('/opt',  express.static('bower_components'));
//app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true }));

let port = process.env.PORT || '3000'
app.listen(port, function () {
  console.log('textnotes-serverlistening on port ' + port);
});

