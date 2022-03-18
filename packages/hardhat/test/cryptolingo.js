const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("CryptoLingo contract", function () {
  let CryptoLingo, contractAsOwner, contractAsUser1;

  // run once before all tests
  before(async function() {
    // load accounts
    accounts = await getNamedAccounts();
  });

  beforeEach(async function() {
    // deploy CryptoLingo contract
    await deployments.fixture(["CryptoLingo"]);
    CryptoLingo = await deployments.get("CryptoLingo");
    contractAsOwner = await ethers.getContractAt(
      "CryptoLingo", 
      CryptoLingo.address,
      accounts.deployer
    )
    contractAsUser1 = await ethers.getContractAt(
      "CryptoLingo", 
      CryptoLingo.address,
      accounts.user1
    )
  });

  describe("Constructor", function () {
    it("should deploy the contract with the correct values", async function () {
      // assert token defaults
      // stories array should be empty
      await expect(contractAsOwner.stories(0))
        .to.be.reverted;
    });
  });

  describe("Creating Stories", function () {
    it.only("should allow a user to create a story", async function () {
      // create a story as user1
      console.log("before createstory");
      contractAsUser1.createStory(
        "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
        "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
      );
      console.log("after createstory");

      // assert that the story was created properly
      var stories = await contractAsUser1.stories(0);
      console.log("after getting stories");
      expect(stories).to.be.equal(undefined);
      
      // assert that user1 received X tokens for authoring a story
    });
  });
});
