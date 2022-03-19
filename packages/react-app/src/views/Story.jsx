import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useContractReader } from "eth-hooks";

import { ethers } from "ethers";

function Story({ address, yourLocalBalance, readContracts, auth, writeContracts, tx, tokenBalance, setTokenBalance }) {
  const history = useHistory();
  const location = useLocation();
  const { isPurchased, storyMetadata, storyCost } = location.state;

  let blurStory = true;

  if (isPurchased) {
    // Skip for now... just render
    // fetch story + audio from IPFS
  } else if (tokenBalance >= storyCost) {
    // TODO: do you wish to spend your balance? confirm button
    // Then call handler -> makes tx call to purchaseStory(wallet, storyId)
    // TODO: how to validate this goes through?
  } else {
    alert(
      `You need ${storyCost} tokens to purchase this token but you only have ${tokenBalance}\nGet some by uploading content or purchase them at an exchange`,
    );
    history.goBack();
  }
  return <div>Hello jauy</div>;
}

export default Story;
