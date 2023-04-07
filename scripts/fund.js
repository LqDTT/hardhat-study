const { getNamedAccounts, ethers } = require("hardhat")
async function main() {
  //获取部署者
  const { deployer } = await getNamedAccounts()

  //获取合约          合约名称  部署者
  const fundMe = await ethers.getContract("FundMe", deployer)
  // console.log(fundMe, "fundMe")
  //转账
  const transactionResponse = await fundMe.fund({
    value: ethers.utils.parseEther("1")
  })

  await transactionResponse.wait()
  console.log("转账结束!")


}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error)
    process.exit(1)
  })

  // exit（0）：正常运行程序并退出程序；
  // exit（1）：非正常运行导致退出程序；
