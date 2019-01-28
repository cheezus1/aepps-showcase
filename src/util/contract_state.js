const Crypto = require('@aeternity/aepp-sdk').Crypto;
const {EpochChain, EpochContract} = require('@aeternity/aepp-sdk')

const stateType = "(map(int, ((string, string, string, string),int,int,int,map(address, (int, int)),map(string, (list(address), int)))),map(int, (string, string, string, string)),int,int,int,int,int,map(address, (int, int)))";
const contractAddress = "ct_29ozapcERVa12z1i6Pp6zJ34XSjx3UsUAWcpZkWMdwRq8uGBEX";

const get = async () => {
    let client = await EpochChain.compose(EpochContract)({
        url: `https://sdk-testnet.aepps.com`,
        internalUrl: `https://sdk-testnet.aepps.com`,
    }).catch(console.error);

    const contractState = await client.contractEpochCall(contractAddress, 'sophia-address', 'get_state', '()').catch(console.error);
    const decodedContractState = await client.contractEpochDecodeData(stateType, calledAuctionSlots.out).catch(console.error);

    return decodedContractState;
  }

export default {
  get
}
