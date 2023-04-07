//hardhat 中引入ethers的方法,它有封装好的ethers包
const { ethers, run, network } = require("hardhat");

//run 可以运行hardhat 中所有的任务,也就是npx hardhat 下所有的插件
//network 是看你将合约部署在哪个网络, 其中有网络的所有信息,包括chainID,可以通过chainID
//来判断是在hardhat是默认网络上还是在测试网络上, 如果是默认网络,根本不需要验证合约,因为默认网络
//只是在本地,没有浏览器

async function main() {
  //hardhat自己知道SimpleStorage合约在哪个位置
  //它也知道SimpleStorage合约已经编译成二进制文件和abi了
  //所以不需要读二进制文件和abi了                                   
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")//注意这里的字符串首尾不能有空格
  console.log("Deploying contract...")
  //部署合约
  const simpleStorage = await SimpleStorageFactory.deploy()
  //等待合约部署成功
  await simpleStorage.deployed()

  console.log(simpleStorage.address)
  // console.log(network)
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...")
    await simpleStorage.deployTransaction.wait(6) //当你部署合约的时候,etherscan并没有实时更新,所以需要等几个区块被挖出来,再验证合约
    await verify(simpleStorage.address, [])
  }
  //通话hardhat 与合约交互
  const currentValue = await simpleStorage.retrieve()
  console.log("我得到了该值", currentValue)
  const transactionResponse = await simpleStorage.store(999)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`新的值: ${updatedValue}`)


}

const verify = async (contractAddress, args) => {
  console.log('正在验证合约')
  try {
    await run("verify:verify", {
      address: contractAddress,
      contractArguments: args
    })

  } catch (e) {
    //如果这个合约被验证过了,用trycatch接收,不让它中断代码进程
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })