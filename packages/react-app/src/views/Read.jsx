import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContractReader } from "eth-hooks";

import { ethers } from "ethers";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Read({ address, yourLocalBalance, readContracts, auth, writeContracts, tx, tokenBalance, setTokenBalance }) {
  /*
   * 1. First need to fetch list of all stories CID pairs from Contract
   * 2. Fetch and see which are owned already by this wallet
   * 3. Then fetch beginning of text from IPFS for each and render
   *      (use helper methods to read and write in case we migrate)
   * 4. Make click check if owned or has balance
   *      If not owned but has balance, send contract to purchase story and add to allowed list
   *      If owned, then open story component and in there fetch full story and audio
   *      Else show "you haven't purchased"
   */

   const [storyPreviews, setStoryPreviews] = useState([])
  /*
    {
      id: "<text>:<audio>",
      upvoteCount: 0,
      downvoteCount: 0,
      author: address,
    }
   */
  const [textPreviews, setTextPreviews] = useState([])

   

   useEffect(() => {
     if (readContracts && readContracts.CryptoLingo && storyPreviews.length > 0) {
       try {
        const res = await readContracts.CryptoLingo.getStories(address);
        if (res && res.stories && res.stories.length > 0) {
          setStoryPreviews(res.stories)
        }
       } catch (e) {
         console.log("ERR:", e)
       }
     }

   }, [readContracts])

   useEffect(() => {
     // To fetch text previews for each story from IPFS
     if (storyPreviews && storyPreviews.length > 0) {
       const textPreviewObjects = [];
        // extract text cid 
        // fetch text from ipfs client
        // add first N words of text to object + author name + upvote and downvote count (OBJECT)
        // append each object to textPreviewObjects

        // then set state
     }
   }, [storyPreviews])

  return (
    <>
      <div>This is the read flow</div>
    </>
  );
}

export default Read;
