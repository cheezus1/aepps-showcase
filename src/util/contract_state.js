const Crypto = require('@aeternity/aepp-sdk').Crypto;
const {EpochChain, EpochContract} = require('@aeternity/aepp-sdk')

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
const contractAddress = "ct_2hKcWQytJmNh6hUzAxsmmfam6EzTfVeVV8eKnbArDwf3A9877w";

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
      pendingObjects.push({
        title: p.val.value[0].value[0].value,
        description: p.val.value[0].value[1].value,
        image_binary: p.val.value[0].value[2].value,
        url: p.val.value[0].value[3].value
      });
    });

    return pendingObjects;
  }

export default {
  getPending, pendingToObjects
}
