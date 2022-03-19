import React, { useState, useEffect } from "react";
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

  const [storyPreviewMetadatas, setStoryPreviewMetadatas] = useState([]);
  /*
    {
      id: "<text>:<audio>",
      upvoteCount: 0,
      downvoteCount: 0,
      author: address,
    }
   */
  const [storyPreviews, setStoryPreviews] = useState([]);
  /*
    {
      id: "<text><audio>",
      textCID: "",
      textPreview: "",
      upvoteCount: 0,
      downvoteCount: 0,
      author: address,
      isPurchasedId: "", // this is the id field with the : removed
    }
   */
  const [purchasedStoryIds, setPurchasedStoryIds] = useState(new Set([]));

  useEffect(() => {
    async function fetchStories() {
      // TODO: uncomment ME after DEBUGGING
      // if (readContracts && readContracts.CryptoLingo && storyPreviewMetadatas.length > 0) {
      //   try {
      //     const res = await readContracts.CryptoLingo.getStories(address);
      //     if (res && res.stories && res.stories.length > 0) {
      //       // TODO: sort by net upvote count
      //       setStoryPreviewMetadatas(res.stories);
      //     }
      //   } catch (e) {
      //     console.log("ERR:", e);
      //   }
      // }
      const tmp = [
        {
          id: "bafybeiaoporrmlqo6vpn4z52hfvpaavknxyrqi7g7rohj5mq3sjj4g7v5ybafybeiaoporrmlqo6vpn4z52hfvpaavknxyrqi7g7qohj5mq3sjj4g7v5y",
          upvoteCount: 5,
          downvoteCount: 2,
          author: address,
        },
        {
          id: "bafybeiaoporrmlqo6vpn4z52hfvpaavknxyrqi7g7rohj5mq3sjj4g7v5ybafybeiaoporrmlqo6vpn4z52hfvpaavknxyrq8777rohj5mq3sjj4g7v5y",
          upvoteCount: 9,
          downvoteCount: 12,
          author: address,
        },
        {
          id: "bafybeiaoporrmlqo6vpn4z52hfvpaavknxyrqi7g7rohj5mq3sjj4g7v5ybafybeiaoporrmlqo6vpn4z52hfvpaavknxyrqi7g7rohj5mq3sjj4g7v5y",
          upvoteCount: 88,
          downvoteCount: 2,
          author: address,
        },
      ];
      setStoryPreviewMetadatas(tmp);
    }
    fetchStories();
  }, [readContracts]);

  useEffect(() => {
    // To fetch text previews for each story from IPFS
    async function buildTextPreviews() {
      if (storyPreviewMetadatas && storyPreviewMetadatas.length > 0) {
        try {
          const textPreviewObjects = await Promise.all(
            storyPreviewMetadatas.map(async previewMetadataObject => {
              try {
                // Extract text cid
                const id = previewMetadataObject.id;
                const textCID = id.substring(0, id.length / 2); // because text comes first
                // Fetch text from ipfs client
                const res = await fetch(`https://ipfs.io/ipfs/${textCID}`);
                const resText = await res.text();
                return {
                  ...previewMetadataObject,
                  textCID,
                  // textPreview is first 10 words of the preview
                  textPreview: resText.split(" ").slice(0, 10).join(" "),
                };
              } catch (e) {
                throw e;
              }
            }),
          );
          setStoryPreviews(textPreviewObjects);
        } catch (e) {
          console.log("ERR:", e);
        }
      }
    }
    buildTextPreviews();
  }, [storyPreviewMetadatas]);

  useEffect(() => {
    async function getPurchasedStories() {
      if (readContracts && readContracts.CryptoLingo) {
        try {
          const res = await readContracts.CryptoLingo.storiesPurchased(address);
          if (res && res.length > 0) {
            const purchasedStoryIds = new Set(res.map(storyObj => storyObj.id));
            setPurchasedStoryIds(purchasedStoryIds);
          }
        } catch (e) {
          console.log("ERR:", e);
        }
      }
    }
    getPurchasedStories();
  }, [storyPreviews]);

  return (
    <>
      {/*{
      id: "<text>:<audio>",
      textCID: "",
      textPreview: "",
      upvoteCount: 0,
      downvoteCount: 0,
      author: address,
      isPurchasedId: "", // this is the id field with the : removed
    } */}
      {storyPreviews && storyPreviews.length > 0 ? (
        storyPreviews.map(obj => {
          return (
            <div style={{ margin: "10px" }} id={obj.id}>
              <div>Story preview {obj.textPreview}</div>
              <div>Upvotes: {obj.upvoteCount}</div>
              <div>Downvotes: {obj.downvoteCount}</div>
            </div>
          );
        })
      ) : (
        <div style={{ margin: "10px" }}>Someone needs to upload some stories to get started!</div>
      )}
    </>
  );
}

export default Read;
