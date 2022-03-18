import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts }) {
  return (
    <>
      <div style={{ margin: 32 }}>First connect your wallet in the top-right!</div>
      <div style={{ margin: 32 }}>
        Upload content - click on the <Link to="/upload">"Upload"</Link> tab.
      </div>
      <div style={{ margin: 32 }}>
        Read content - click on the <Link to="/read">"Read"</Link> tab.
      </div>
    </>
  );
}

export default Home;
