//新建一个任务 创建新任务需要引入task
const { task } = require("hardhat/config")

//创建一个名为block-number的任务
//注意 npx hardhat可以查看所有的任务
task("block-number", "我是一个描述")
  .setAction(
    //hre是hardhat运行时的环境  const { ethers, run, network } = require("hardhat"); hre就是该hardhat
    async (taskArgs, hre) => {
      const blockNumber = await hre.ethers.provider.getBlockNumber()
      console.log('我是最新区块', blockNumber)
      console.log(taskArgs, "我是taskArgs") //是一个包含任务的CLI解析的参数对象。在此例下，它是一个空对象。
    }
  )
//运行该任务的命令 npx hardhat block-number 默认在hardhat网络
//npx hardhat block-number --network sepolia  运行在sepolia网络
//注意,这边创建完任务,使用时 config.js文件要引入
module.exports = {}