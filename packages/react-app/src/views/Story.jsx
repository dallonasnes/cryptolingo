import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useContractReader } from "eth-hooks";

import { ethers } from "ethers";

function Story({ address, yourLocalBalance, readContracts, auth, writeContracts, tx, tokenBalance, setTokenBalance }) {
  const location = useLocation();

  console.log("Location:", location);
  /**
   * Data Fetching Section
   */
  return <div>Hello jauy</div>;
}

export default Story;
