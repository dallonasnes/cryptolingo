// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "contracts/LingoRewards.sol";


contract CryptoLingo is Ownable, ReentrancyGuard {

    // constants
    uint256 public authorReward = 6;
    uint256 public voterReward = 3;
    uint256 public storyCost = 10;

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

    // user story actions
    struct StoryActions {
        bool hasUpvoted;
        bool hasDownvoted;
        bool hasPurchased;
        bool hasAuthored;
    }

    // stories 
    // note - this can currently be bypassed and is just for demo purposes.
    Story[] private stories;

    // users' purchased stories
    mapping(address => string[]) public storiesPurchased;

    // users' actions
    mapping(address => mapping(string => StoryActions)) public userStoryActions;


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
     * @param address target - the user to query.
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
        userStoryActions[msg.sender]
            [string(abi.encodePacked(textCid, audioCid))] = 
                StoryActions(
                    false,
                    false,
                    true,
                    true
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
        StoryActions storage storyActions = userStoryActions[target][storyId]; 
        require(
            !storyActions.hasPurchased,
            "Cannot purchase same story twice. Thanks though."
        );

        // transfer tokens from message sender to this contract
        rewardsToken.transferFrom(
            msg.sender,
            address(this),
            storyCost * 10**rewardsToken.decimals()
        );

        // add story to target's storiesPurchased
        storiesPurchased[target].push(storyId);
        storyActions.hasPurchased = true;
    }

    /*
     * @dev Upvotes/Downvotes a story and rewards the user for it.
     * @param string storyId - id of the Story entry.
     * @param bool voteChoice - false for downvote, true for upvote.
     */
    function vote(string memory storyId, bool voteChoice) public nonReentrant {
        // get story
        Story storage story;
        story = stories[
            getIndexOfStory(storyId)
        ];
        require(
            userStoryActions[msg.sender][storyId].hasPurchased,
            "Cannot vote on a story you haven't purchased."
        );
        require(
            msg.sender != story.author,
            "Author cannot vote on their own story."
        );

        // vote for story
        StoryActions storage storyActions = userStoryActions[msg.sender][storyId];

        // first vote
        if (storyActions.hasUpvoted == false && storyActions.hasDownvoted == false) {
            if (voteChoice == true) {
                story.upvotes++;
                storyActions.hasUpvoted = true;
            }
            else {
                story.downvotes++;
                storyActions.hasDownvoted = true;
            }

            // reward user for voting
            rewardsToken.mint(msg.sender, voterReward * (10**rewardsToken.decimals()));
        }

        // updating vote
        else {
            if (voteChoice == true) {
                story.downvotes--;
                story.upvotes++;
                storyActions.hasDownvoted = false;
                storyActions.hasUpvoted = true;
            }
            else {
                story.upvotes--;
                story.downvotes++;
                storyActions.hasUpvoted = false;
                storyActions.hasDownvoted = true;
            }
        }
    }

    /*
     * @dev Return the index of the story with the given id.
     * @dev Revert if the story with the given id cannot be found.
     * @param string storyId - id of the Story entry.
     */
    function getIndexOfStory(string memory storyId) public view returns (uint) {
        Story memory story;
        for (uint i=0; i<stories.length; i++) {
            story = stories[i];
            if (keccak256(abi.encode(story.id)) == 
                keccak256(abi.encode(storyId))
               ) {
                return i;
            }
        }
        revert("Story with given storyId could not be found.");
    }
}
