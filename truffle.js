/*
 * Copyright ©️ 2020 Curio AG (Company Number FL-0002.594.728-9)
 * Incorporated and registered in Liechtenstein
 *
 * Copyright ©️ 2020 Curio Capital AG (Company Number CHE-211.446.654)
 * Incorporated and registered in Zug, Switzerland.
 */

const HDWalletProvider = require('@truffle/hdwallet-provider');
const web3 = require('web3');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

function getProvider(rpc) {
  return function() {
    const provider = new web3.providers.WebsocketProvider(rpc);
    return new HDWalletProvider(process.env.DEPLOYMENT_KEY, provider);
  };
}

const config = {
  networks: {
    soliditycoverage: {
      host: '127.0.0.1',
      port: 8555,
      gasLimit: 9600000,
      network_id: '*'
    },
    local: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    },
    kovan: {
      gasPrice: 1000 * 1000 * 1000,
      gasLimit: 10 * 1000 * 1000,
      provider: getProvider(`wss://kovan.infura.io/ws/v3/${ process.env.INFURA_PROJECT_ID }`),
      websockets: true,
      skipDryRun: true,
      network_id: '42'
    },
    rinkeby: {
      gasPrice: 1e9, // 1 gwei
      gasLimit: 8 * 1e6, // 8,000,000
      provider: getProvider(`wss://rinkeby.infura.io/ws/v3/${ process.env.INFURA_PROJECT_ID }`),
      websockets: true,
      skipDryRun: true,
      network_id: '4'
    },
    goerli: {
      gasPrice: 1e9, // 1 gwei
      gasLimit: 15 * 1e6, // 15,000,000
      provider: getProvider(`wss://goerli.infura.io/ws/v3/${ process.env.INFURA_PROJECT_ID }`),
      websockets: true,
      skipDryRun: true,
      network_id: '5',
      networkCheckTimeout: 500000,
      timeoutBlocks: 500000
    },
    holesky: {
      gasPrice: 2e9, // 2 gwei
      gasLimit: 15 * 1e6, // 15,000,000
      provider: getProvider(`wss://holesky.drpc.org`), // This public RPC without error: only replay-protected (EIP-155) transactions allowed over RPC
      websockets: true,
      skipDryRun: true,
      network_id: '17000',
      networkCheckTimeout: 500000,
      timeoutBlocks: 500000,
      verify: {
        apiUrl: 'https://api-holesky.etherscan.io/api',
        apiKey: process.env.ETHERSCAN_API_KEY,
        explorerUrl: 'https://holesky.etherscan.io',
      },
    },
    test: {
      // https://github.com/trufflesuite/ganache-core#usage
      provider() {
        // eslint-disable-next-line global-require
        const { provider } = require('@openzeppelin/test-environment');
        return provider;
      },
      skipDryRun: true,
      network_id: '*'
    }
  },
  mocha: {
    timeout: 10000
  },
  compilers: {
    solc: {
      version: process.env.SOLC || '0.5.17',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      },
      evmVersion: 'istanbul'
    }
  },
  plugins: ['solidity-coverage', 'truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};

module.exports = config;
