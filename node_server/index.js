const Ae = require('@aeternity/aepp-sdk').Universal;
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('localhost', '5001', { protocol: 'http' });

const pendingAeppsType = `map(string,
    (
      address,
      int,
      int,
      int,
      map(address, (int, int)),
      map(string, (list(address), int))
    )
  )`;
const approvedAeppsType = "list(string)";

const keypair = { secretKey: "a7a695f999b1872acb13d5b63a830a8ee060ba688a478a08c6e65dfad8a01cd70bb4ed7927f97b51e1bcb5e1340d12335b2a2b12c8bc5221d63c4bcb39d41e61", publicKey: "ak_6A2vcm1Sz6aqJezkLCssUXcyZTX7X8D5UwbuS2fRJr9KkYpRU" };
const contractAddress = "ct_2H4ZV4ccwAVBSSiDpYpMuYTRYW8ADimwPUNCHXG9Um6ThU1yy3";
let client;

const init = async () => {
  client = await Ae({
    url: 'https://sdk-testnet.aepps.com',
    internalUrl: 'https://sdk-testnet.aepps.com',
    keypair: keypair,
    networkId: 'ae_uat'
  });
};

app.use(bodyParser.json({
  limit: '50mb',
  extended: true
}));

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
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

// IPFS

app.post('/upload-aepp-to-ipfs', (req, res) => {
  let data = Buffer.from(Object.keys(req.body)[0])
  ipfs.add(data, function(err, file) {
    if(err) {
      res.status(500).json({error: "Failed to upload to IPFS " + err});
    } else {
      res.send(file[0].hash);
    }
  })
});

// BLOCKCHAIN

app.post('/submit-ipfs-hash-to-contract', (req, res) => {
  let hash = req.body.data;
  console.log(hash);
  client.contractCall(contractAddress, 'sophia-address', contractAddress, 'submit_aepp', {
      args: `("${hash}")`,
      options: {amount: 1000000000000000000}
  }).then(data => {
    res.send(data);
    console.log(data);
  });
});

app.get('/pending-aepps', async (req, res) => {
  const staticCall = await client.contractCallStatic(contractAddress, 'sophia-address', 'get_pending', {args: '()'});
  const decoded = await client.contractDecodeData(pendingAeppsType, staticCall.result.returnValue);
  let hashes = [];
  decoded.value.forEach(function(aepp) {
    console.log(hashes)
    let ipfsHash = aepp.key.value;
    ipfs.get(ipfsHash, function(err, file){
      if(err) res.status(500).json({error: "Failed to get from IPFS " + err});
      hashes.push(JSON.stringify({hash: ipfsHash, aepp: file}));
    });
  });
  res.send(hashes);
});

app.listen(8000, () => {
  console.log('Server listening on 8000.')
});

init();
