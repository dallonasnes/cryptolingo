import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";
import { create } from "ipfs-http-client";

const client = create("https://ipfs.infura.io:5001/api/v0");

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Upload({ yourLocalBalance, readContracts, auth, writeContracts, tx }) {
  const [text, setText] = useState("");
  const [textFileUrl, setTextFileUrl] = useState("");
  const [didStartRecording, setDidStartRecording] = useState(false);

  const handleSubmit = async () => {
    if (!text) return;
    // TODO
    // 1. get text, write to IPFS
    const added = await client.add(text);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    setTextFileUrl(url);
    // 2. setup livepeer and record
    // 3. write both to NFT storage api, await response
    // 4. write to createStory api on smart contract
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
      const url = URL.createObjectURL(blob);
      a = document.createElement("a");
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
    setText(event.target.value);
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
      <button type="submit" value="Submit" onClick={() => handleSubmit()}>
        Submit
      </button>
    </>
  );
}

export default Upload;
