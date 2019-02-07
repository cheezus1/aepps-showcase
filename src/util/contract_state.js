const Crypto = require('@aeternity/aepp-sdk').Crypto;
const {EpochChain, EpochContract} = require('@aeternity/aepp-sdk')
const ipfsClient = require('ipfs-http-client')
const Buffer = require('buffer').Buffer;

const pendingType =
  "map(int, " +
    "(" +
      "(string, string, string, string)," +
      "int," +
      "int," +
      "int," +
      "map(address, (int, int))," +
      "map(string, (list(address), int))" +
    ")" +
  ")";
const approvedType = "map(int, (string, string, string, string))";
const contractAddress = "ct_2GuYPHhL6RxUq3H3xfB6bZvf7xo1HbshGcXHBR6kcByjGcw4wP";

const ipfs = ipfsClient({ host: 'localhost', protocol: 'http' });

const pushToIpfs = (object) => {
  ipfs.add(Buffer.from(JSON.stringify(object)))
}

const getPending = async () => {
    let client = await EpochChain.compose(EpochContract)({
        url: `https://sdk-testnet.aepps.com`,
        internalUrl: `https://sdk-testnet.aepps.com`,
    }).catch(console.error);

    const pending = await client.contractEpochCall(contractAddress, 'sophia-address', 'get_pending', '()').catch(console.error);
    const decodedPending = await client.contractEpochDecodeData(pendingType, pending.out).catch(console.error);

    return decodedPending;
  }

const pendingToObjects = (pending) => {
    let pendingObjects = [];
    pending.value.forEach(function(p) {
      var description = p.val.value[0].value[1].value;
      if(description.length > 100) {
        description = description.substring(0, 100) + "...";
      }

      pendingObjects.push({
        title: p.val.value[0].value[0].value,
        description: description,
        image_binary: p.val.value[0].value[2].value,
        page_url: p.val.value[0].value[3].value
      });
    });

    return pendingObjects;
  }

// IPFS

export default {
  getPending, pendingToObjects, pushToIpfs
}
