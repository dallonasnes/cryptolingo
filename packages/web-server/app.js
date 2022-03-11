const express = require('express');
const app = express();
const cors = require('cors');
const Web3 = require('web3');
const nodePort = 3033;
const ethPort = 8545;
// TODO: update me based on contract name
const contractABIFile = require("../react-app/src/contracts/hardhat_contracts.json")["31337"]["localhost"]["contracts"]["LingoRewards"];
const contractABI = contractABIFile["abi"];
const contractAddress = contractABIFile["address"];

app.use(cors());
app.use(express.json());
let didLoadContract = false;

let web3;
let accounts;
let contract;

const setup = async () => {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider); 
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost:${ethPort}`));
    }
    try {
        accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(contractABI, contractAddress);
        didLoadContract = true;
        console.log(`Successfully loaded contract`);
    } catch (e) {
        console.log(`Error: ${e}`);
    }
}

const authorize = async ({address, signature, message}) => {
    console.log(`Address ${address}`)
    console.log(`Signature ${signature}`)
    const recoveredAddress = await web3.eth.accounts.recover(message, signature);
    console.log(`Recovered address ${recoveredAddress}\n`)
    return address === recoveredAddress;
}

app.get('/', async (req, res) => {
    const pauserRole = await (await contract.methods.PAUSER_ROLE()).call();
    console.log(pauserRole);
    res.send(`hello world called`);
})

app.get('/auth', async (req, res) => {
    let auth = false;
    console.log(new Date().toString())
    const address = req.header('address');
    const signature = req.header('signature');
    const message = req.header('message');
    try {
        auth = await authorize({address, signature, message})
    } catch (e) {
        console.log(`Error authenticating request: ${e}\n`)
    }
    res.json({auth});
})

app.listen(nodePort, async () => {
    console.log(new Date().toString());
    if (!didLoadContract) {
        await setup();
        console.log(`Web server listening on port ${nodePort}`);
    }
});