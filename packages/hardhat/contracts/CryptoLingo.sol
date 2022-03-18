// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoLingo is Ownable {

    // story representation
    struct Story {
        string id;
        string textCid;
        string audioCid;
        address author;
        uint256 upvotes;
        uint256 downvotes;
        uint64 created;
    } 

    // stories 
    // note - this can currently be bypassed and is just for demo purposes.
    Story[] public stories;

    // users' purchased stories
    mapping(address => Story[]) public storiesPurchased;

    // users' votes
    mapping(address => uint256) public upvotes;
    mapping(address => uint256) public downvotes;

    constructor() {
    }

    /*
     * @dev Return a story's properties if it has been purchased by the user.
     * @param user - address to receive mint receive minted tokens.
     * @notice - this can currently be bypassed and is just for demo purposes.
     */
    function getStory(address user, string memory storyId) public view returns (string memory textCid, string memory audioCid) {
    }

    /*
     * @dev Creates a Story entry and rewards the author for it.
     * @param string textCid - IPFS CID of the story text.
     * @param string audioCid - IPFS CID of the story audio.
     * @notice - this can currently be gamed and is just for demo purposes.
     */
    function createStory(string memory textCid, string memory audioCid) public {
    }

    /*
     * @dev Upvotes/Downvotes a story and rewards the user for it.
     * @param string storyId - id of the Story entry.
     * @param bool voteChoice - false for downvote, true for upvote.
     */
    function vote(string memory storyId, bool voteChoice) public {
    }
}
