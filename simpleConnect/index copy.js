const { default_ABICoder } = require("ethers/lib/utils");

let provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

// 1. Connect Metamask with Dapp
// Connect to eth wallet 0x4F75f07232a56c2b98FC9878F496bFc32e317Ace
async function connectMetamask() {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  // MetaMask requires requesting permission to connect users accounts
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  console.log("Account address s:", await signer.getAddress());
}

// 2. Get balance
async function getBalance() {
  const balance = await signer.getBalance();
  const convertToEth = 1e18;
  console.log("account's balance in ether:", balance.toString() / convertToEth);
}

async function readDataFromSmartContract(addr) {
  let abi = getABIFromAddress(addr);
  const usdtContract = new ethers.Contract(addr, abi, provider);

  const name = await usdtContract.name();
  const symbol = await usdtContract.symbol();
  const decimals = await usdtContract.decimals();
  const totalSupply = await usdtContract.totalSupply();
  const myBalance = await usdtContract.balanceOf(addr);

  var contractData = `name = ${name}\n`;
  contractData += `symbol = ${symbol}\n`;
  contractData += `decimals = ${decimals}\n`;
  contractData += `totalSupply = ${totalSupply / 1e6}\n`;
  contractData += `myBalance = ${myBalance / 1e6}\n`;

  alert(contractData);
  console.log(contractData);
}

// 4. Send Usdt to one account to another
async function sendUsdtToAccount(addr, abi) {
  const usdtContract = new ethers.Contract(addr, abi, provider);
  usdtContract
    .connect(signer)
    .transfer("0x6CC3dFBec068b7fccfE06d4CD729888997BdA6eb", "500000000");
}

function getABIFromAddress(addr) {
  switch (addr) {
    // ETH
    case "0x4f75f07232a56c2b98fc9878f496bfc32e317ace":
      return default_ABI;
    // SPCOIN
    case "0x3cb3d2655db27d0ef62f0b77e0e13c06630317ef":
      return SPCOIN_ABI;
    // LINK
    case "0x326C977E6efc84E512bB9C30f76E30c160eD06FB":
      return default_ABI;
    // USDC
    case "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C":
      return default_ABI;
    // UNI
    case "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984":
      return default_ABI;
    default:
      return default_ABI;
  }
}

const default_ABI = [
  // Some details about the token
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint amount)",
];

const SPCOIN_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "accountKeys",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_accountKey",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_accountKey",
        type: "address",
      },
    ],
    name: "getAccount",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "sponsor",
            type: "address",
          },
          {
            internalType: "address",
            name: "agent",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "sponsoredTime",
            type: "uint256",
          },
        ],
        internalType: "struct SPC_Token.account",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_accountKey",
        type: "address",
      },
    ],
    name: "getIndexOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_accountKey",
        type: "address",
      },
    ],
    name: "isInserted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
