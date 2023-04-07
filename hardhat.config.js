require("@nomicfoundation/hardhat-toolbox");
//配置环境变量的插件,需自己下载 yarn add dotenv
require("dotenv").config()
//生成gas使用量文档的插件  需自己下载 npm install hardhat-gas-reporter --save-dev
require("hardhat-gas-reporter")
//需自己下载  npm i  solidity coverage --dev --save 
//查看代码覆盖率的插件 会生成一个converage文件, 引入之后就自动添加到hardhat的任务中了
//要想使用 直接npx hardhat coverage
require("solidity-coverage")
// 需下载自动验证合约所需的插件
//npm install --save-dev @nomiclabs/hardhat-etherscan
require("@nomiclabs/hardhat-etherscan");
//引入自己创建的任务
require("./tasks/block-number")
//hardhat-deploy 需下载 会很方便的部署合约 npm install -D hardhat-deploy
require('hardhat-deploy');

/** @type import('hardhat/config').HardhatUserConfig */
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
module.exports = {
  defaultNetwork: "hardhat",


  networks: {
    hardhat: {},
    sepolia: {
      //RPC URL
      url: SEPOLIA_RPC_URL,
      //私钥
      accounts: [SEPOLIA_PRIVATE_KEY],
      //链ID
      chainId: 11155111,
      //等待6个区块以后验证
      blockConfirmations: 4,
    },
    //配置本地节点网络   部署合约到本地节点时  npx hardhat run scripts/deploy.js  --network localhost
    //本地节点不需要私钥accounts
    localhost: {
      url: "http://127.0.0.1:8545/",
      //本地的chainId就是它
      chainId: 31337
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  //用于浏览器自动验证合约
  etherscan: {
    //该key 需要在以太坊浏览器上去获取
    // apiKey: {
    //   sepolia: "<sepolia-api-key>"
    // },
    apiKey: ETHERSCAN_API_KEY,
    // customChains: [
    //   {
    //     network: "sepolia",
    //     chainId: 11155111,
    //     urls: {
    //       apiURL: "https://api-sepolia.etherscan.io/api",
    //       browserURL: "https://sepolia.etherscan.io"
    //     }
    //   }
    // ]
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    //需要在 https://pro.coinmarketcap.com/account 获取key
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    //hardhat一共有10个本地账户 如例如npx hardhat node 的时候, 这个时候用deployer 里的default为0时,
    //代表用本地账号里的第一个账户 代表索引为0
    deployer: {
      default: 0, // here this will b`y default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  // solidity: "0.8.8",
};
