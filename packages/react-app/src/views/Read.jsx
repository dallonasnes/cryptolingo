import React from "react";
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
  return (
    <>
      <div>This is the read flow</div>
    </>
  );
}

export default Read;
