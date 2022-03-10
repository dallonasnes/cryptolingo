const express = require('express');
const app = express();
const cors = require('cors');
const Web3 = require('web3');
const nodePort = 3033;
const ethPort = 8545;
// TODO: update me based on contract name
const contractABIFile = require("../react-app/src/contracts/hardhat_contracts.json")["31337"]["localhost"]["contracts"]["YourContract"];
const contractABI = contractABIFile["abi"];
const address = contractABIFile["address"];

app.use(cors());
app.use(express.json());
let didLoadContract = false;

if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider); 
} else {
        var web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost:${ethPort}`));
}

let accounts;
let contract;

app.get('/', async (req, res) => {
    const purpose = contract.methods.purpose;
    console.log(`Purpose: ${purpose}`);
    // TODO: this is how you call a method
    // const pup = await (await purpose()).call();
    res.send(`hello world called`);
})

app.listen(nodePort, async () => {
    if (!didLoadContract) {
        try {
            accounts = await web3.eth.getAccounts();
            contract = new web3.eth.Contract(contractABI, address);
            didLoadContract = true;
            console.log(`Successfully loaded contract`);
        } catch (e) {
            console.log(`Error: ${e}`);
        }
    }
    console.log(`Web server listening on port ${nodePort}`);
})