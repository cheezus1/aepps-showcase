// const Crypto = require("@aeternity/aepp-sdk").Crypto;
const { EpochChain, EpochContract } = require("@aeternity/aepp-sdk");
const ipfsClient = require("ipfs-http-client");
const Buffer = require("buffer").Buffer;
import PendingAepps from "./pending_aepps";

const pendingType = `map(string,
    (
      address,
      int,
      int,
      int,
      map(address, (int, int)),
      map(string, (list(address), int))
    )
  )`;
const approvedType = "list(string)";
const contractAddress = "ct_DvkFC5aGvNcNX2RqGD6d6E2mceePnDqshW3cLNe2SBZtfyB21";
const ipfs = ipfsClient({ host: "localhost", protocol: "http" });

/*
Qmdyn695HK6GSHXaoZfSByrj49BSdALZP2ARhvbWVk7rEn
QmXRUbP6dgBHvjt5zFK77ybR9p94iozWEPTpCSsqjwFPoy
QmTSXmYkKxRmLLYQQqU3pvB4J2rW3QqjiEUkYJXrrXMKrb
QmdkbzUHvtiqJ172iRkZGpU2r9zZgdDVDPJiZAXiXau2KM
QmUSUUsSRRqVEw8STeGYayAdVS2NDJD7FjGCS1Ce1qX4L3
*/

const pushToIpfs = object => {
  ipfs.add(Buffer.from(JSON.stringify(object)));
};

const getApproved = async () => {
  let client = await EpochChain.compose(EpochContract)({
    url: `https://sdk-testnet.aepps.com`,
    internalUrl: `https://sdk-testnet.aepps.com`
  }).catch( );

  const approved = await client
    .contractEpochCall(contractAddress, "sophia-address", "get_approved", "()")
    .catch( );
  const decodedApproved = await client
    .contractEpochDecodeData(approvedType, approved.out)
    .catch( );

  return decodedApproved;
};

const getPending = async () => {
  let client = await EpochChain.compose(EpochContract)({
    url: `https://sdk-testnet.aepps.com`,
    internalUrl: `https://sdk-testnet.aepps.com`
  }).catch( );

  const pending = await client
    .contractEpochCall(contractAddress, "sophia-address", "get_pending", "()")
    .catch( );
  const decodedPending = await client
    .contractEpochDecodeData(pendingType, pending.out)
    .catch( );

  return decodedPending;
};

const getFromIpfs = hash => {
  ipfs.get(hash, function(err, file) {
    // console.log(file);
  });
};

const pendingToObjects = pending => {
  // TODO: use ipfs get
  // console.log(pending);

  return PendingAepps.pendingAepps();
};

// IPFS

export default {
  getPending,
  pendingToObjects,
  pushToIpfs,
  getApproved,
  getFromIpfs
};
