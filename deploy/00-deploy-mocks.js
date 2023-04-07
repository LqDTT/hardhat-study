const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000

//用mock的原因是,hardhat网络并没有 usd换算eth的价格,因为该网络总是执行完脚本后自动销毁的
//所以需要一个模拟网络去部署.     
//当把合约部署到测试网或者主网都是全都测试好了再进行部署的
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  // const chainId = network.config.chainId
  if (developmentChains.includes(network.name)) {
    log("nima")
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    })
  }
  // If we are on a local development network, we need to deploy mocks!
  // if (chainId == 31337) {
  //   log("Local network detected! Deploying mocks...")
  //   await deploy("MockV3Aggregator", {
  //     contract: "MockV3Aggregator",
  //     from: deployer,
  //     log: true,
  //     args: [DECIMALS, INITIAL_PRICE],
  //   })
  //   log("Mocks Deployed!")
  //   log("------------------------------------------------")
  //   log(
  //     "You are deploying to a local network, you'll need a local network running to interact"
  //   )
  //   log(
  //     "Please run `npx hardhat console` to interact with the deployed smart contracts!"
  //   )
  //   log("------------------------------------------------")
  // }
}

//npx hardhat deploy --tags mocks  要想只运行这个文件的话的命令
module.exports.tags = ["all", "mocks"]