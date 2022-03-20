const { ethers, hre } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("CryptoLingo contract", function () {
  let CryptoLingo, LingoRewards;
  let contractAsOwner, contractAsUser1,
        contractAsUser2, contractAsUser3;
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
    );
    contractAsUser1 = await ethers.getContractAt(
      "CryptoLingo", 
      CryptoLingo.address,
      accounts.user1
    );
    contractAsUser2 = await ethers.getContractAt(
      "CryptoLingo", 
      CryptoLingo.address,
      accounts.user2
    );
    contractAsUser3 = await ethers.getContractAt(
      "CryptoLingo", 
      CryptoLingo.address,
      accounts.user3
    );
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
    // TODO test that:
      // an author can't create the same story twice

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
    // set up before each test
    beforeEach(async function() {
      // skip test setup for certain tests
      if (this.currentTest.title === 
          "shouldn't allow a user with insufficient balance to purchase a story"
      ) return

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
    });

    it("should allow a user to purchase a story", async function () {
      // assert that user2 can access the story
      var result = await contractAsUser2.userStoryActions(accounts.user2, textCid+audioCid);
      expect(result.hasPurchased).to.equal(true);
    });

    it("shouldn't allow a user with insufficient balance to purchase a story", async function () {
      // create a story as user1
      await contractAsUser1.createStory(
        textCid,
        audioCid
      );

      // assert revert when user2 tries to purchase story
      await expect(
        contractAsUser2.purchaseStory(
          accounts.user2,
          textCid + audioCid
        )
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("shouldn't allow the user to purchase same story twice", async function () {
      // give user2 some more funds to purchase with
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
        storyCost.mul(2)
      );

      // purchase the story again as user2 and assert revert
      // first purchase was in the beforeEach test setup
      await expect(
        contractAsUser2.purchaseStory(
          accounts.user2,
          textCid + audioCid
        )  
      ).to.be.revertedWith("Cannot purchase same story twice. Thanks though.");
    });

    it("should allow a user to purchase a story for another user", async function () {
      // give user2 some more funds to purchase with
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
      var result = await contractAsUser2.userStoryActions(accounts.user3, textCid+audioCid);
      expect(result.hasPurchased).to.equal(true);
    });

    it("shouldn't require an author to purchase their own story", async function () {
      // assert that user1 can read the story they authored
      var result = await contractAsUser1.userStoryActions(accounts.user1, textCid+audioCid);
      expect(result.hasPurchased).to.equal(true);
    });
  });

  describe("Voting on Stories", function () {
    // set up before each test
    beforeEach(async function() {
      // skip test setup for certain tests
      if (this.currentTest.title === 
          "shouldn't allow a user with insufficient balance to purchase a story"
      ) return

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
    });

    it("should allow a user to upvote a story", async function () {
      // assert that user2 can upvote the story
      await contractAsUser2.vote(textCid + audioCid, true);
      var stories = await contractAsUser2.getStories();
      var story = stories[0];
      expect(story.upvotes).to.equal(ethers.BigNumber.from(1));
      expect(story.downvotes).to.equal(ethers.BigNumber.from(0));
    });

    it("should allow a user to downvote a story", async function () {
      // assert that user2 can downvote the story
      await contractAsUser2.vote(textCid + audioCid, false);
      var stories = await contractAsUser2.getStories();
      var story = stories[0];
      expect(story.upvotes).to.equal(ethers.BigNumber.from(0));
      expect(story.downvotes).to.equal(ethers.BigNumber.from(1));
    });

    it("should reward a user after they upvote a story", async function () {
      // assert that the user has 0 reward tokens
      var bal = await rewardsContractAsUser2.balanceOf(accounts.user2);
      expect(bal).to.equal(ethers.BigNumber.from(0));

      // upvote the story as user2
      await contractAsUser2.vote(textCid + audioCid, true);

      // assert that user2 has X reward tokens after voting
      bal = await rewardsContractAsUser2.balanceOf(accounts.user2);
      expect(bal).to.equal(
        ethers.BigNumber.from(await contractAsUser2.voterReward()).mul(
          ethers.BigNumber.from(10).pow(
            await rewardsContractAsUser2.decimals()
          )
        )
      );
    });

    it("should reward a user after they downvote a story", async function () {
      // assert that the user has 0 reward tokens
      var bal = await rewardsContractAsUser2.balanceOf(accounts.user2);
      expect(bal).to.equal(ethers.BigNumber.from(0));

      // upvote the story as user2
      await contractAsUser2.vote(textCid + audioCid, false);

      // assert that the user has X reward tokens after voting
      bal = await rewardsContractAsUser2.balanceOf(accounts.user2);
      expect(bal).to.equal(
        ethers.BigNumber.from(await contractAsUser2.voterReward()).mul(
          ethers.BigNumber.from(10).pow(
            await rewardsContractAsUser2.decimals()
          )
        )
      );
    });

    it("should not allow an author to vote on their own story", async function () {
      // upvote the story as the author
      await expect(contractAsUser1.vote(textCid + audioCid, false))
        .to.be.revertedWith("Author cannot vote on their own story.");
    });

    it("should not allow a user to both upvote and downvote a story", async function () {
      // upvote the story as user2
      await contractAsUser2.vote(textCid + audioCid, true);

      // assert that user2 has upvoted the story
      // and assert that the story has 1 upvote
      expect((await contractAsUser2.getStories())[0].upvotes)
        .to.equal(1);
      expect((await contractAsUser2.getStories())[0].downvotes)
        .to.equal(0);
      expect((await contractAsUser2.userStoryActions(accounts.user2, textCid+audioCid)).hasUpvoted)
        .to.equal(true);
      expect((await contractAsUser2.userStoryActions(accounts.user2, textCid+audioCid)).hasDownvoted)
        .to.equal(false);

      // get user2 balance
      var bal = await rewardsContractAsUser2.balanceOf(accounts.user2);

      // downvote the story as user2
      await contractAsUser2.vote(textCid + audioCid, false);

      // assert that the story only has an upvote OR downvote from user2
      expect((await contractAsUser2.getStories())[0].upvotes)
        .to.equal(0);
      expect((await contractAsUser2.getStories())[0].downvotes)
        .to.equal(1);
      expect((await contractAsUser2.userStoryActions(accounts.user2, textCid+audioCid)).hasUpvoted)
        .to.equal(false);
      expect((await contractAsUser2.userStoryActions(accounts.user2, textCid+audioCid)).hasDownvoted)
        .to.equal(true);

      // assert that user2 didnt receive any extra rewards for trying to revote
      var newBal = await rewardsContractAsUser2.balanceOf(accounts.user2);
      expect(bal).to.equal(newBal);
    });

    it("should not allow a user to vote if they haven't purchased a story", async function () {
      // upvote the story as user3 and assert revert
      await expect(contractAsUser3.vote(textCid + audioCid, false))
        .to.be.revertedWith("Cannot vote on a story you haven't purchased.");
    });
  });

});
