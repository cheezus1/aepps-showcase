const Ae = require('@aeternity/aepp-sdk').Universal;
const Crypto = require('@aeternity/aepp-sdk').Crypto;
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

// default
const keypair = {
  secretKey: "a7a695f999b1872acb13d5b63a830a8ee060ba688a478a08c6e65dfad8a01cd70bb4ed7927f97b51e1bcb5e1340d12335b2a2b12c8bc5221d63c4bcb39d41e61",
   publicKey: "ak_6A2vcm1Sz6aqJezkLCssUXcyZTX7X8D5UwbuS2fRJr9KkYpRU"
 };

const contractAddress = "ct_2KSXYq7asoRj6biZFzskrwvBR7F1bwtvCqMJs9VtTBWmjELToc";
const approvalTimeFrame = 1; // 480
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

app.get('/balance', (req, res) => {
  client.balance(keypair.publicKey).then(balance => {res.send({balance: balance, pubkey: keypair.publicKey})}).catch(err => {
      res.status(500).json({error: "Failed to submit hash to contract " + err});
    });
})

app.post('/submit-ipfs-hash-to-contract', (req, res) => {
  let hash = req.body.data;
  client.contractCall(contractAddress, 'sophia-address', contractAddress, 'submit_aepp', {
      args: `("${hash}")`,
      options: {amount: 1000000000000000000}
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).json({error: "Failed to submit hash to contract " + err});
  });
});

app.get('/pending-aepps', async (req, res) => {
  const staticCall = await client.contractCallStatic(contractAddress, 'sophia-address', 'get_pending', {args: '()'});
  const decoded = await client.contractDecodeData(pendingAeppsType, staticCall.result.returnValue);
  let currentBlock = await client.topBlock();

  let ipfsPromises = [];
  let pendingAepps = {};
  let i = 0;
  for(i = 0; i < decoded.value.length; i++) {
    let pendingAepp = decoded.value[i];
    let ipfsHash = pendingAepp.key.value;
    ipfsPromises.push(ipfs.get(ipfsHash));

    let voters = [];
    pendingAepp.val.value[4].value.forEach(function(voter) {
      let voter_address = voter.key.value;
      let vote_amount = voter.val.value[1].value;
      voters.push({voter_address: Crypto.addressFromDecimal(voter_address), amount: vote_amount});
    });

    let submittedVotes = {};
    pendingAepp.val.value[5].value.forEach(function(voteGroup) {
      submittedVotes[voteGroup.key.value] = {};
      submittedVotes[voteGroup.key.value].total_votes = voteGroup.val.value[1].value;
      submittedVotes[voteGroup.key.value].voter_addresses = [];
      voteGroup.val.value[0].value.forEach(function(voter) {
        submittedVotes[voteGroup.key.value].voter_addresses.push(Crypto.addressFromDecimal(voter.value));
      })
    });

    let submissionKeyBlock =
      await client.api.getKeyBlockByHeight(pendingAepp.val.value[2].value);
    let timeDifference = currentBlock.time - submissionKeyBlock.time;
    let blocksElapsed = currentBlock.height - submissionKeyBlock.height;
    let averageBlockTime = timeDifference / blocksElapsed;

    if(blocksElapsed == 0) {
      averageBlockTime = 180000;
    }

    let endTimestamp;
    let currentPeriod;
    if(blocksElapsed < approvalTimeFrame) {
      endTimestamp = submissionKeyBlock.time + (averageBlockTime * approvalTimeFrame);
      currentPeriod = 0;
    } else if(blocksElapsed < approvalTimeFrame * 2) {
      endTimestamp = submissionKeyBlock.time + (averageBlockTime * approvalTimeFrame * 2)
      currentPeriod = 1;
    } else {
      endTimestamp = undefined;
      currentPeriod = 2;
    }

    let pendingAeppFields = pendingAepp.val.value;
    pendingAepps[ipfsHash] = {
      voters: voters,
      submittedVotes: submittedVotes,
      owner: Crypto.addressFromDecimal(pendingAeppFields[0].value),
      submissionHeight: pendingAeppFields[2].value,
      voteRewardPool: pendingAeppFields[3].value,
      currentHeight: currentBlock.height,
      endTime: { timestamp: endTimestamp, currentPeriod: currentPeriod }
    }
  }

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

app.post('/vote', (req, res) => {
  let aeppIpfsHash = req.body.aeppIpfsHash;
  let commitmentHash = req.body.commitmentHash;
  let voteAmount = req.body.voteAmount;
  client.contractCall(contractAddress, 'sophia-address', contractAddress, 'vote', {
      args: `("${aeppIpfsHash}", 0x${commitmentHash})`,
      options: { amount: voteAmount }
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).json({error: "Failed to vote for aepp " + err});
  });
});

app.post('/submit-commitment', (req, res) => {
  let aeppIpfsHash = req.body.aeppIpfsHash;
  let vote = req.body.vote;
  let salt = req.body.salt;
  client.contractCall(contractAddress, 'sophia-address', contractAddress, 'submit_commitment', {
      args: `("${aeppIpfsHash}", "${vote.toLowerCase()}", "${salt}")`,
      options: {}
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).json({error: "Failed to confirm vote " + err});
  });
});

app.post('/finalize-voting', (req, res) => {
  let aeppIpfsHash = req.body.aeppIpfsHash;
  client.contractCall(contractAddress, 'sophia-address', contractAddress, 'finalize_voting', {
      args: `("${aeppIpfsHash}")`,
      options: {}
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).json({error: "Failed to finalize voting " + err});
  });
});

app.listen(8000, () => {
  console.log('Server listening on 8000.')
});

init();
