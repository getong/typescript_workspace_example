import {ethers} from "ethers";

module.exports = (async function() {
  // const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  const provider = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");

  const blockNumber = await provider.getBlockNumber();

  console.log('current block Number:' + blockNumber);
})();