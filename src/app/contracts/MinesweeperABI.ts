export const MINESWEEPER_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "row",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "col",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "value",
          "type": "uint8"
        }
      ],
      "name": "CellRevealed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "GameMessage",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_row",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "_col",
          "type": "uint8"
        }
      ],
      "name": "getCellState",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_rows",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "_cols",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_mines",
          "type": "uint256"
        }
      ],
      "name": "initializeGame",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "playerBoard",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "rows",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "cols",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "isGameActive",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "mines",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "revealedCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_row",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "_col",
          "type": "uint8"
        }
      ],
      "name": "revealCell",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];