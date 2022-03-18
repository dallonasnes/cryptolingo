import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useContractReader } from "eth-hooks";

import { ethers } from "ethers";
// const handleSuccess = stream => {
//   const player = document.getElementById("player");
//   const downloadLink = document.getElementById("download");
//   const startButton = document.getElementById("start");
//   const stopButton = document.getElementById("stop");
//   const options = { mimeType: "audio/webm" };
//   const recordedChunks = [];
//   const mediaRecorder = new MediaRecorder(stream, options);

//   mediaRecorder.addEventListener("dataavailable", e => {
//     e.preventDefault();
//     if (e.data.size > 0) {recordedChunks.push(e.data);}
//   });

//   mediaRecorder.addEventListener("stop", () => {
//     e.preventDefault();

//     downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
//     downloadLink.download = "acetest.wav";
//     downloadLink.click()
//     player.src = downloadLink.href;
//     debugger;
//   });

//   mediaRecorder.start();
//   setTimeout(() => mediaRecorder.stop(), 4000);

//   // stopButton.addEventListener("click", (event) => {
//   //   // event.preventDefault();
//   //   // debugger;
//   //   mediaRecorder.stop();
//   // });

//   // startButton.addEventListener("click", (event) => {
//   //   // event.preventDefault()
//   //   // debugger;
//   //   mediaRecorder.start();
//   // });
// };
/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Upload({ yourLocalBalance, readContracts, auth, writeContracts, tx }) {
  const [text, setText] = useState();

  // navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);

  const handleSubmit = async () => {
    // TODO
    // 1. get text, write to IPFS
    // 2. setup livepeer and record
    // 3. write both to NFT storage api, await response
    // 4. write to createStory api on smart contract
  };

  const handleChange = event => {
    setText(event.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
        <label>
          Text:
          <input type="text" value={text} onChange={handleChange} />
        </label>
        <br />
        {/* <button id="start">Start</button>
        <br />
        <audio id="player" controls></audio>
        <br />
        <button id="download">Download</button>
        <br />
        <button id="stop">Stop</button> */}
        <br />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
}

export default Upload;
