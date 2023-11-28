import React from "react";

const { Web3 } = require('web3');
import type { NextPage } from "next";

const NODE_URL = "wss://polygon-mainnet.infura.io/ws/v3/fc1af53790934844a40d3a560fe184de";

const web3 = new Web3(NODE_URL);

const UNISWAP_ROUTER_ADDRESS = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
const SWAP_EXACT_ETH_FOR_TOKENS_SIGNATURE = "0x7ff36ab5";

async function subscribeToNewBlocks(): Promise<void> {
  const subscription = await web3.eth.subscribe('newBlockHeaders');
  subscription.on('data', handleNewBlock);
}

async function handleNewBlock(blockHeader: any): Promise<void> {
  console.log('Got new block', blockHeader.number);
  const block = await web3.eth.getBlock(blockHeader.hash, true);
  block.transactions.forEach((tx: any): void => {
    if(tx.to && tx.to.toLowerCase() === UNISWAP_ROUTER_ADDRESS.toLowerCase() &&
      (tx.input.startsWith(SWAP_EXACT_ETH_FOR_TOKENS_SIGNATURE) || tx.input.startsWith(SWAP_EXACT_ETH_FOR_TOKENS_SIGNATURE))){
      console.log('---------------------------------------');
      console.log('Found swap transaction: ', tx.hash);
      console.log('From: ', tx.from);
      console.log('Value: ', web3.utils.fromWei(tx.value, 'ether'), 'ETH');
      console.log('---------------------------------------');
    }
  })
}

const swapTracker: NextPage = () => {
  return (
    <>
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        <button className="btn btn-secondary btn-sm normal-case font-thin" onClick={subscribeToNewBlocks}>Subscribe to new blocks</button>
       </div>
    </>
  );
}

export default swapTracker;