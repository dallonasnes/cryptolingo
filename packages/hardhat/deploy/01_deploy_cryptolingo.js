const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("CryptoLingo", {
    from: deployer,
    args: [],
    log: true,
  });

};
module.exports.tags = ["CryptoLingo"];
