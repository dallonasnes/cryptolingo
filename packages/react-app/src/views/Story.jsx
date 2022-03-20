import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import Modal from "react-modal";
import { ethers } from "ethers";

Modal.setAppElement("#root");

function Story({ address, yourLocalBalance, readContracts, auth, writeContracts, tx, tokenBalance, setTokenBalance }) {
  const history = useHistory();
  const location = useLocation();
  const { storyMetadata, storyCost } = location.state;
  const isAuthor = address === storyMetadata.author;
  const wasAlreadyPurchased = location.state.isOwned || isAuthor;
  if (!wasAlreadyPurchased && Number(tokenBalance) < Number(storyCost)) {
    alert(
      `You need ${storyCost} tokens to purchase this token but you only have ${tokenBalance}\nGet some by uploading content or purchase them at an exchange`,
    );
    history.goBack();
  }
  const [isPurchased, setIsPurchased] = useState(wasAlreadyPurchased);

  const [fetchDidComplete, setFetchDidComplete] = useState(false);
  const [text, setText] = useState(null);
  const [audio, setAudio] = useState(null);
  const [didVote, setDidVote] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // Only fetch if did purchase, isAlreadyPurchased and hasn't yet fetched
      if (isPurchased && !fetchDidComplete) {
        const textCID = storyMetadata.id.substring(0, storyMetadata.id.length / 2); // text CID comes first
        const audioCID = storyMetadata.id.substring(storyMetadata.id.length / 2); // audio CID comes second

        try {
          const [textBlob, audioBlob, voteData] = await Promise.all([
            fetch(`https://ipfs.io/ipfs/${textCID}`),
            fetch(`https://ipfs.io/ipfs/${audioCID}`),
            readContracts.CryptoLingo.userStoryActions(address, storyMetadata.id),
          ]);

          setDidVote(voteData.hasDownvoted || voteData.hasUpvoted || voteData.hasAuthored);

          const text = await textBlob.text();
          const audio = await audioBlob.blob();

          setText(text);
          setAudio(audio);
          setFetchDidComplete(true);
        } catch (e) {
          console.log("ERR:", e);
        }
      }
    }
    fetchData();
  }, [isPurchased, fetchDidComplete]);

  useEffect(() => {
    if (audio && fetchDidComplete) {
      // TODO: will need to free this URL eventually so that people don't steal our data
      const url = URL.createObjectURL(audio);
      const a = document.createElement("a");
      const player = document.getElementById("player");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "yourAudio.wav";
      player.src = url;
    }
  }, [audio, fetchDidComplete]);

  const [isModalOpen, setIsModalOpen] = useState(!isPurchased && Number(tokenBalance) >= Number(storyCost));
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handlePurchaseApprove = () => {
    // TODO: validate the requests succeed and fetch to update token balance
    try {
      // Approve max transaction amount so contract can move tokens to/from user wallet
      tx(
        writeContracts.LingoRewards.approve(
          address,
          ethers.BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935"),
        ),
      );
      // Purchase story
      tx(writeContracts.CryptoLingo.purchaseStory(address, storyMetadata.id));
      setTokenBalance(Number(tokenBalance) - Number(storyCost));
      setIsPurchased(true);
    } catch (e) {
      console.log("ERR:", e);
    }
    toggleModal();
  };

  const handlePurchaseDecline = () => {
    toggleModal();
    history.goBack();
  };

  const handleVote = ({ isUpvote }) => {
    if (didVote) alert("You can't vote again or on your own story");
    try {
      tx(writeContracts.CryptoLingo.vote(storyMetadata.id, isUpvote));
      setTimeout(() => alert("Refresh your page to show your token reward for voting"), 1000);
      // TODO: setup so don't need to refresh and instead validate + update state
      // setTokenBalance(tokenBalance + 3); // Get 3 tokens back for voting
    } catch (e) {
      console.log("ERR:", e);
    }
  };

  return !isPurchased ? (
    <>
      <div style={{ margin: "10px" }}>
        <Modal isOpen={isModalOpen} onRequestClose={toggleModal} contentLabel="My dialog">
          <div style={{ margin: "10px", display: "flex" }}>
            <span>You must buy this story for {storyCost} tokens to continue. Do you wish to proceed?</span>
            <br />
            <button onClick={() => handlePurchaseDecline()}>Cancel</button>
            <button onClick={() => handlePurchaseApprove()}>Approve</button>
          </div>
        </Modal>
      </div>
    </>
  ) : text && audio ? (
    <>
      <div>
        <h2>Read your story!</h2>
      </div>
      <div style={{ margin: "10px" }}>
        <audio id="player" controls></audio>
        <div style={{ margin: "10px" }}>{text}</div>
      </div>
      <div style={{ margin: "20px" }}>
        <button style={{ backgroundColor: "red" }} onClick={() => handleVote({ isUpvote: false })}>
          <img alt="x" src={"../../x-mark.svg"} />
        </button>
        <button style={{ backgroundColor: "red" }} onClick={() => handleVote({ isUpvote: true })}>
          <img alt="heart" src={"../../heart.svg"} />
        </button>
      </div>
    </>
  ) : (
    <div style={{ margin: "10px" }}>Loading, please wait</div>
  );
}

export default Story;
