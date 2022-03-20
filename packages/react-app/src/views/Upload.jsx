import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";

const client = create("https://ipfs.infura.io:5001/api/v0");

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Upload({ address, yourLocalBalance, readContracts, auth, writeContracts, tx, tokenBalance, setTokenBalance }) {
  const [text, setText] = useState("");
  const [textFileUrl, setTextFileUrl] = useState("");
  const [didStartRecording, setDidStartRecording] = useState(false);
  const [audioElem, setAudioElem] = useState(null);
  const [audioFileUrl, setAudioFileUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);

  const handleSubmit = async () => {
    // TODO:
    // 1. write both to NFT storage api, await response
    // 2. setup livepeer and record audio that way
    if (!text || !audioElem) {
      alert("Be sure to upload both text and audio! Refresh the page to try again");
      return;
    }
    // Get text and audio, write to IPFS
    const addedText = await client.add(text);
    const textUrl = `https://ipfs.infura.io/ipfs/${addedText.path}`;
    const textCIDEncoded = addedText.cid.toV1().toString();
    setTextFileUrl(textUrl);
    console.log("Text file url:", textUrl);
    console.log("AddedText:", JSON.stringify(addedText));
    console.log("Text CID encoded:", textCIDEncoded);

    const addedAudio = await client.add(audioBlob);
    const audioUrl = `https://ipfs.infura.io/ipfs/${addedAudio.path}`;
    const audioCIDEncoded = addedAudio.cid.toV1().toString();

    setAudioFileUrl(audioUrl);
    console.log("Audio file url:", audioUrl);
    console.log("AddedAudio", JSON.stringify(addedAudio));
    console.log("Audio CID encoded:", audioCIDEncoded);

    // Write to createStory api on smart contract
    try {
      tx(writeContracts.CryptoLingo.createStory(textCIDEncoded, audioCIDEncoded));
      alert("Refresh the page to see your updated token balance");
    } catch (e) {
      console.log("ERR:", e);
    }
  };

  const handleSuccess = stream => {
    const player = document.getElementById("player");
    const downloadLink = document.getElementById("download");
    const startButton = document.getElementById("start");
    const stopButton = document.getElementById("stop");
    const options = { mimeType: "audio/webm" };
    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, options);

    // Element to append to dom for downloading audio
    let a;

    mediaRecorder.addEventListener("dataavailable", e => {
      e.preventDefault();
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    });

    mediaRecorder.addEventListener("stop", e => {
      e.preventDefault();

      const blob = new Blob(recordedChunks, {
        type: "audio/webm",
      });
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      a = document.createElement("a");
      setAudioElem(a);
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "yourAudio.wav";
      player.src = url;
    });

    mediaRecorder.addEventListener("error", e => {
      console.log("ERROR:", e);
    });

    stopButton.addEventListener("click", event => {
      event.preventDefault();
      try {
        mediaRecorder.stop();
      } catch (e) {
        console.log("ERROR:", e);
        alert("No ongoing media recording. Refresh the page to start a new one");
      }
    });

    downloadLink.addEventListener("click", () => {
      if (!a) {
        alert("No uploaded audio to download");
        return;
      }
      // Download
      a.click();
    });

    mediaRecorder.start();
  };

  const handleChange = event => {
    setText(event.target.value.trim());
  };

  return (
    <>
      <label>
        Text:
        <input type="text" value={text} onChange={e => handleChange(e)} />
      </label>
      <br />
      <button
        id="start"
        onClick={() => {
          if (didStartRecording) {
            alert("Already made a recording. Refresh the page to start a new one");
            return;
          }
          setDidStartRecording(true);
          navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);
        }}
      >
        Start
      </button>
      <br />
      <audio id="player" controls></audio>
      <br />
      <button id="download">Download</button>
      <br />
      <button id="stop">Stop</button>
      <br />
      <button
        type="submit"
        value="Submit"
        onClick={() => {
          if (writeContracts && writeContracts.CryptoLingo) handleSubmit();
          else setTimeout(() => handleSubmit(), 2000);
        }}
      >
        Submit
      </button>
    </>
  );
}

export default Upload;
