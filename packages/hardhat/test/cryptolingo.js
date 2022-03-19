const { ethers, hre } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("CryptoLingo contract", function () {
  let CryptoLingo, LingoRewards;
  let contractAsOwner, contractAsUser1;
  let textCid, audioCid;

  // run once before all tests
  before(async function() {
    // load accounts
    accounts = await getNamedAccounts();

    // create fake CIDs for test purposes
    textCid = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdX";
    audioCid = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
  });

  beforeEach(async function() {
    // deploy CryptoLingo contract
    await deployments.fixture(["LingoRewards", "CryptoLingo"]);
    CryptoLingo = await deployments.get("CryptoLingo");
    LingoRewards = await deployments.get("LingoRewards");
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
    contractAsUser2 = await ethers.getContractAt(
      "CryptoLingo", 
      CryptoLingo.address,
      accounts.user2
    )
    rewardsContractAsOwner = await ethers.getContractAt(
      "LingoRewards",
      LingoRewards.address,
      accounts.deployer
    );
    rewardsContractAsUser1 = await ethers.getContractAt(
      "LingoRewards",
      LingoRewards.address,
      accounts.user1
    );
    rewardsContractAsUser2 = await ethers.getContractAt(
      "LingoRewards",
      LingoRewards.address,
      accounts.user2
    );
  });

  describe("Constructor", function () {
    it("should deploy the contract with the correct values", async function () {
      // assert token defaults
      // stories array should be empty
      expect(await contractAsOwner.getStories())
        .to.be.an('array').that.is.empty;
    });
  });

  describe("Creating Stories", function () {
    it("should allow a user to create a story", async function () {
      // create a story as user1
      await contractAsUser1.createStory(
        textCid,
        audioCid
      );

      // assert that the story was created properly
      var stories = await contractAsUser1.getStories();
      var story = stories[0];
      var expected = [
          textCid + audioCid,
          textCid,
          audioCid,
          accounts.user1,
          ethers.BigNumber.from(0),
          ethers.BigNumber.from(0),
          ethers.BigNumber.from((await ethers.provider.getBlock("latest")).timestamp)
      ];
      expect(story).to.deep.equal(expected);

      // assert that user1 received X tokens for authoring a story
      var rewards = await rewardsContractAsUser1.balanceOf(accounts.user1);
      expect(rewards).to.equal(
        ethers.BigNumber.from(await contractAsUser1.authorReward()).mul(
          ethers.BigNumber.from(10).pow(
            await rewardsContractAsUser1.decimals()
          )
        )
      );
    });

    it("should reward the user for creating a story", async function () {
      // create a story as user1
      await contractAsUser1.createStory(
        textCid,
        audioCid
      );

      // assert that user1 received X tokens for authoring a story
      var rewards = await rewardsContractAsUser1.balanceOf(accounts.user1);
      expect(rewards).to.equal(
        ethers.BigNumber.from(await contractAsUser1.authorReward()).mul(
          ethers.BigNumber.from(10).pow(
            await rewardsContractAsUser1.decimals()
          )
        )
      );
    });
  });

  describe("Reading Stories", function () {
    it("should allow a user to purchase a story", async function () {
      // create a story as user1
      await contractAsUser1.createStory(
        textCid,
        audioCid
      );

      // give user2 some funds to purchase with
      var storyCost = (await contractAsUser2.storyCost()).mul(
        ethers.BigNumber.from(10).pow(await rewardsContractAsOwner.decimals())
      );
      await rewardsContractAsOwner.mint(
        accounts.user2,
        storyCost
      );

      // allow the cryptolingo contract to spend user2's reward tokens
      await rewardsContractAsUser2.approve(
        CryptoLingo.address,
        storyCost
      );

      // purchase the story as user2
      await contractAsUser2.purchaseStory(
        accounts.user2,
        textCid + audioCid
      );

      // assert that user2 can access the story
      var result = await contractAsUser2.getStoriesPurchased(accounts.user2);
      expect(result).to.be.an('array').that.includes(textCid+audioCid);
    });

    it("shouldn't allow a user with insufficient balance to purchase a story", async function () {
      // create a story as user1
      await contractAsUser1.createStory(
        textCid,
        audioCid
      );

      // purchase the story as user2
      await expect(
        contractAsUser2.purchaseStory(
          accounts.user2,
          textCid + audioCid
        )
      ).to.be.reverted;
    });

    it("shouldn't allow the user to purchase same story twice", async function () {
      // create a story as user1
      await contractAsUser1.createStory(
        textCid,
        audioCid
      );

      // give user2 some funds to purchase with
      var storyCost = (await contractAsUser2.storyCost()).mul(
        ethers.BigNumber.from(10).pow(await rewardsContractAsOwner.decimals())
      );
      await rewardsContractAsOwner.mint(
        accounts.user2,
        storyCost.mul(2)
      );

      // allow the cryptolingo contract to spend user2's reward tokens
      await rewardsContractAsUser2.approve(
        CryptoLingo.address,
        storyCost.mul(2)
      );

      // purchase the story as user2
      await contractAsUser2.purchaseStory(
        accounts.user2,
        textCid + audioCid
      );

      // purchase the story again as user2 and assert revert
      await expect(
        contractAsUser2.purchaseStory(
          accounts.user2,
          textCid + audioCid
        )  
      ).to.be.revertedWith("Cannot purchase same story twice. Thanks though.");
    });

    it("should allow a user to purchase a story for another user", async function () {
      // create a story as user1
      await contractAsUser1.createStory(
        textCid,
        audioCid
      );

      // give user2 some funds to purchase with
      var storyCost = (await contractAsUser2.storyCost()).mul(
        ethers.BigNumber.from(10).pow(await rewardsContractAsOwner.decimals())
      );
      await rewardsContractAsOwner.mint(
        accounts.user2,
        storyCost
      );

      // allow the cryptolingo contract to spend user2's reward tokens
      await rewardsContractAsUser2.approve(
        CryptoLingo.address,
        storyCost
      );

      // purchase the story as user2 for user3
      await contractAsUser2.purchaseStory(
        accounts.user3,
        textCid + audioCid
      );

      // assert that user3 can access the story
      var result = await contractAsUser2.getStoriesPurchased(accounts.user3);
      expect(result).to.be.an('array').that.includes(textCid+audioCid);
    });

    it("shouldn't require an author to purchase their own story", async function () {
      // create a story as user1
      await contractAsUser1.createStory(
        textCid,
        audioCid
      );

      // assert that user1 can read the story they authored
      var result = await contractAsUser1.getStoriesPurchased(accounts.user1);
      expect(result).to.be.an('array').that.includes(textCid+audioCid);
    });

  });
});
