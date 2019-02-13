const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('localhost', '5001', { protocol: 'http' });

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
    methods: ['POST', 'GET', 'OPTIONS']
}));

app.get('/', (req, res) => {
  ipfs.get("QmPvBTYmUfeJoVSbt5h1ECyR2eQ9DLZMAM8Tqu4JkKkP7o").then(function(file, err) {
    res.send(file)
  })
});

app.post('/upload', (req, res) => {
  let data = Buffer.from(Object.keys(req.body)[0])
  ipfs.add(data, function(err, file) {
    if(err) {
      res.status(500).json({error: "Failed to upload to IPFS " + err});
    } else {
      res.send(file[0].hash);
    }
  })
})

app.listen(8000, () => {
  console.log('Server listening on 8000.')
});
