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
const contractAddress = "ct_DPnTr6cDWfhrscBHcz8ihidcMQoVPFwydKof7esjZSB4mK9z1";
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
  limit: 100000000,
  extended: true
}));

app.use(bodyParser.urlencoded({
  extended: true,
  limit: 100000000
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
  let data = Buffer.from(JSON.stringify(req.body))
  ipfs.add(data, function(err, file) {
    if(err) res.status(500).json({error: "Failed to upload to IPFS " + err});

    res.send(file[0].hash);
  })
});

// BLOCKCHAIN

app.post('/submit-ipfs-hash-to-contract', (req, res) => {
  let hash = req.body.data;
  client.contractCall(contractAddress, 'sophia-address', contractAddress, 'submit_aepp', {
      args: `("${hash}")`,
      options: {amount: 1000000000000000000}
  }).then(data => {
    res.send(data);
  });
});

app.get('/pending-aepps', async (req, res) => {
  const staticCall = await client.contractCallStatic(contractAddress, 'sophia-address', 'get_pending', {args: '()'});
  const decoded = await client.contractDecodeData(pendingAeppsType, staticCall.result.returnValue);

  let ipfsPromises = [];
  let pendingAepps = {};
  decoded.value.forEach(function(pendingAepp) {
    let ipfsHash = pendingAepp.key.value;
    ipfsPromises.push(ipfs.get(ipfsHash));

    // map pending aepps objects
    let pendingAeppFields = pendingAepp.val.value;
    pendingAepps[ipfsHash] = {
      owner: pendingAeppFields[0].value,
      submissionHeight: pendingAeppFields[2].value,
      voteRewardPool: pendingAeppFields[3].value
    }
  });

  Promise.all(ipfsPromises).then(function(aepps) {
    aepps.forEach(function(aepp) {
      if(aepp.length == 0) res.status(500).json({error: "Failed to get from IPFS " + err});

      let ipfsHash = aepp[0].path;
      let parsedAepp = JSON.parse(aepp[0].content.toString('utf8'));
      pendingAepps[ipfsHash].title = parsedAepp.title;
      pendingAepps[ipfsHash].shortDescription = parsedAepp.shortDescription;
      pendingAepps[ipfsHash].fullDescription = parsedAepp.fullDescription;
      pendingAepps[ipfsHash].contractAddress = parsedAepp.contractAddress;
      pendingAepps[ipfsHash].page = parsedAepp.page;
      pendingAepps[ipfsHash].image = parsedAepp.image;
    });

    res.send(pendingAepps);
  });
});

app.listen(8000, () => {
  console.log('Server listening on 8000.')
});

init();
