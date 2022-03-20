const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Lingo Rewards token", function () {
  let LingoRewards, contractAsOwner;

  // run once before all tests
  before(async function() {
    // load accounts
    accounts = await getNamedAccounts();
  });

  beforeEach(async function() {
    // deploy LingoRewards token
    await deployments.fixture(["LingoRewards"]);
    LingoRewards = await deployments.get("LingoRewards");
    contractAsOwner = await ethers.getContractAt(
      "LingoRewards", 
      LingoRewards.address,
      accounts.deployer
    )
  });

  describe("Constructor", function () {
    it("should deploy the token with the correct values", async function () {
      // assert token name
      expect(await contractAsOwner.name())
        .to.be.equal("Lingo Rewards");
      
      // assert token symbol
      expect(await contractAsOwner.symbol())
        .to.be.equal("LPOINTS");

      // assert owner balance
      expect(await contractAsOwner.balanceOf(accounts.deployer))
        .to.be.equal(
          ethers.BigNumber.from("0")
            .mul(
              (ethers.BigNumber.from("10")
                .pow(
                  ethers.BigNumber.from(await contractAsOwner.decimals())
                )
              )
            )
        )
    });
  });
});
