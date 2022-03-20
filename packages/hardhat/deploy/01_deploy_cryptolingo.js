const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  const LingoRewards = await deployments.get("LingoRewards");
  
  await deploy("CryptoLingo", {
    from: deployer,
    args: [LingoRewards.address],
    log: true,
  });

  // allow CryptoLingo contract to mint LingoRewards tokens
  var CryptoLingo = await deployments.get("CryptoLingo");
  var rewardsContractAsOwner = await ethers.getContractAt(
    "LingoRewards",
    LingoRewards.address,
    deployer
  );
  await rewardsContractAsOwner.grantRole(
    (await rewardsContractAsOwner.MINTER_ROLE()),
    CryptoLingo.address
  );
};
module.exports.tags = ["CryptoLingo"];
module.exports.dependencies = ["LingoRewards"];
