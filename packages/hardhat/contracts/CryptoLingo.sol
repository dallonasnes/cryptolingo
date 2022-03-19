// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "contracts/LingoRewards.sol";


contract CryptoLingo is Ownable, ReentrancyGuard {

    // constants
    uint256 public authorReward = 1;
    uint256 public voteReward = 1;
    uint256 public storyCost = 1;

    // rewards token
    LingoRewards rewardsToken;

    // story representation
    struct Story {
        string id;
        string textCid;
        string audioCid;
        address author;
        uint256 upvotes;
        uint256 downvotes;
        uint256 created;
    } 

    // stories 
    // note - this can currently be bypassed and is just for demo purposes.
    Story[] private stories;

    // users' purchased stories
    mapping(address => string[]) public storiesPurchased;

    // users' votes
    mapping(address => uint256) public upvotes;
    mapping(address => uint256) public downvotes;


    constructor(address _rewardsToken) {
        rewardsToken = LingoRewards(_rewardsToken);
    }


    /*
     * @dev Returns an array of all Story structs.
     * @notice - this can run out of memory but we dont care for demo.
     */
    function getStories() public view returns (Story[] memory) {
        return stories;
    }

    /*
     * @dev Returns an array of all the story ids purchased by the target.
     * @notice - this can run out of memory but we dont care for demo.
     */
    function getStoriesPurchased(address target) public view returns (string[] memory) {
        return storiesPurchased[target];
    }

    /*
     * @dev Creates a Story entry and rewards the author for it.
     * @param string textCid - IPFS CID of the story text.
     * @param string audioCid - IPFS CID of the story audio.
     * @notice - this can currently be gamed and is just for demo purposes.
     */
    function createStory(string memory textCid, string memory audioCid) public nonReentrant {
        // TODO revert if author already submitted this story
        // add story to storage
        stories.push(
            Story(
                string(abi.encodePacked(textCid, audioCid)),
                textCid,
                audioCid,
                msg.sender,
                0,
                0,
                block.timestamp
            )
        );

        // add authored piece to purchasedStories of the author
        // so they dont have to pay to read their own stories
        storiesPurchased[msg.sender].push(
           string(abi.encodePacked(textCid, audioCid))
        ); 

        // send user rewards
        rewardsToken.mint(msg.sender, authorReward * (10**rewardsToken.decimals()));
    }

    /*
     * @dev Purchase a Story for a user.
     * @param address target - address of the user who will have access to the story.
     * @param string storyId - id of the story to be purchased.
     * @notice - this can run out of memory while looping but we dont care for demo.
     */
    function purchaseStory(address target, string memory storyId) external {
        // TODO can this be improved by using a different data structure?
        // revert if user already purchased this story
        string[] memory purchased = storiesPurchased[target]; 
        for (uint256 i=0; i<purchased.length; i++) {
            if (keccak256(abi.encode(purchased[i])) 
                == keccak256(abi.encode(storyId))) {
                revert("Cannot purchase same story twice. Thanks though.");
            }
        }

        // transfer tokens from message sender to this contract
        rewardsToken.transferFrom(
            msg.sender,
            address(this),
            storyCost * 10**rewardsToken.decimals()
        );

        // add story to target's storiesPurchased
        storiesPurchased[target].push(storyId);
    }

    /*
     * @dev Upvotes/Downvotes a story and rewards the user for it.
     * @param string storyId - id of the Story entry.
     * @param bool voteChoice - false for downvote, true for upvote.
     */
    function vote(address voter, string memory storyId, bool voteChoice) public {
    }
}
