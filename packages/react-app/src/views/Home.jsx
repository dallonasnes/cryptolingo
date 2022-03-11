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
function Home({ yourLocalBalance, readContracts, auth }) {
  return (
    <>
      <br />
      <div>Earn 6 LingoToken for each upvote on content that you upload</div>
      <div>Pay 10 LingoToken to read a story</div>
      <div>Earn 3 LingoToken back when you upvote or downvote the story at the end</div>
      <div>Earn 10 LingoToken for watching an ad</div>
      <div>
        LingoTokens are paid out daily, but an upload must first get 3 upvotes before payout (to avoid spammers)
      </div>
      <br />
      <div>{auth ? `Your session is authenticated` : `Your session is NOT authenticated`}</div>
    </>
  );
}

export default Home;
