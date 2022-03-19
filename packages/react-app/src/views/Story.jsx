import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import Modal from "react-modal";
import { ethers } from "ethers";

Modal.setAppElement("#root");

/**
 * On purchase -> submit approve for, send transaction, update state of purchased content + token balance, make TODO to handle failed transaction
 * At bottom of screen, put vote button.
 */

function Story({ address, yourLocalBalance, readContracts, auth, writeContracts, tx, tokenBalance, setTokenBalance }) {
  const history = useHistory();
  const location = useLocation();
  const { isPurchased, storyMetadata, storyCost } = location.state;

  const [didJustPurchase, setDidJustPurchase] = useState(false);
  const [fetchDidComplete, setFetchDidComplete] = useState(false);
  const [text, setText] = useState(null);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Only fetch if did purchase, isAlreadyPurchased and hasn't yet fetched
      // TODO: remove TRUE after debugging
      if ((isPurchased || didJustPurchase || true) && !fetchDidComplete) {
        // const textCID = id.substring(0, id.length / 2); // text CID comes first
        // const audioCID = id.substring(id.length / 2); // audio CID comes second

        // TODO: UNCOMMENT AFTER DEBUGGING
        const textCID = "bafybeih2slq7woea2scmzyt52sws23xvploktnr6ubd6bvep3udxrau3ce";
        const audioCID = "bafybeibnpnhblqsa6wjuk7gzbf4bbq5dz2e6kfq2n3dhha4vispv2hoizq";
        try {
          const [textBlob, audioBlob] = await Promise.all([
            fetch(`https://ipfs.io/ipfs/${textCID}`),
            fetch(`https://ipfs.io/ipfs/${audioCID}`),
          ]);

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
  }, [fetchDidComplete]);

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Handle when current story isn't yet purchased
  if (!isPurchased && !didJustPurchase) {
    if (tokenBalance >= storyCost) {
      // TODO: validate transactions before updating balance and showing token
      return (
        <div style={{ margin: "10px" }}>
          <button onClick={toggleModal}>Open modal</button>

          <Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel="My dialog">
            <div>My modal dialog.</div>
            <button onClick={toggleModal}>Close modal</button>
          </Modal>
        </div>
      );

      // TODO: do you wish to spend your balance? confirm button + approve transaction
      // Then call handler -> makes tx call to purchaseStory(wallet, storyId)
      // Use setTimeout for 30 seconds, then refresh to see if this id is purchased (show timer too)
      // TODO: how to validate this goes through?
    } else {
      alert(
        `You need ${storyCost} tokens to purchase this token but you only have ${tokenBalance}\nGet some by uploading content or purchase them at an exchange`,
      );
      history.goBack();
    }
  }
  return text && audio ? (
    <>
      <div>
        <h2>Read your story!</h2>
      </div>
      <div style={{ margin: "10px" }}>
        <audio id="player" controls></audio>
        <div style={{ margin: "10px" }}>{text}</div>
      </div>
    </>
  ) : (
    <div style={{ margin: "10px" }}>Loading, please wait</div>
  );
}

export default Story;
