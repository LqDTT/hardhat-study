const { network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
//hardhat deploy是一个npm包
//每次运行npx hardhat deploy 时,都会自动调用这个函数
// { getNamedAccounts, deployments } = hre 该两个参数是从hre解构出的
//hre是hardhat 运行时环境,它可以找到hardhat的对象
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments
  //部署者deployer
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  let ethUsdPriceFeedAddress
  //31337 说明 是本地网络
  if (chainId == 31337) {
    //合约名称MockV3Aggregator 模拟合约
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    //如果是本地网络就用MockV3Aggregator合约的地址
    ethUsdPriceFeedAddress = ethUsdAggregator.address
    // console.log(ethUsdPriceFeedAddress, "我是走的本地的地址")
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }

  log("----------------------------------------------------")
  log("Deploying FundMe and waiting for confirmations...")
  //deploy包的方式,第一个参数是要部署的合约
  const fundMe = await deploy("FundMe", {
    from: deployer,
    //给FundMe合约的构造函数传的参数
    args: [ethUsdPriceFeedAddress],
    //打印部署日志
    log: true,
    //等待几个区块被挖出
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  log("曹尼玛啊")
  log(`FundMe deployed at ${fundMe.address}`)

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, [ethUsdPriceFeedAddress])
  }

}
module.exports.tags = ["all", "fundme"]