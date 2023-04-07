const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
  //获取账户部署
  const { deployer } = await getNamedAccounts()

  //获取
  const fundMe = await ethers.getContract("FundMe", deployer)

  const transactionResponse = await fundMe.withdraw()

  await transactionResponse.wait()
  console.log("清空")

}
main()
  .then(() => {
    process.exit(0)
  })
  .catch(() => {
    process.exit(1)
  })