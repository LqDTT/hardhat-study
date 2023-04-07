
//npx hardhat test  --network sepolia 如果不在 developmentChains中包含,就执行测试 
//与 fundme.test.js文件相反,该文件是包含的时候才执行测试  只有是hardhat默认网络和localhoast时
const { assert } = require("chai")
//注意,运行npx hardhat deploy时的hre对象里的属性,hardhat都有
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe Staging Tests", () => {
    let deployer
    let fundMe
    const sendValue = ethers.utils.parseEther("0.1")//代表1个eth

    beforeEach(async () => {
      //获取部署者
      deployer = (await getNamedAccounts()).deployer
      // await deployments.fixture(["fundme"])
      //获取部署成功后的合约
      fundMe = await ethers.getContract("FundMe", deployer)
    })

    it("allows people to fund and withdraw", async function () {
      //发送eth
      const fundTxResponse = await fundMe.fund({ value: sendValue })
      //等待1个区块
      await fundTxResponse.wait(1)
      //清空
      const withdrawTxResponse = await fundMe.withdraw()
      await withdrawTxResponse.wait(1)

      //获取余额
      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      )
      console.log(
        endingFundMeBalance.toString() +
        " should equal 0, running assert equal..."
      )
      assert.equal(endingFundMeBalance.toString(), "0")
    })




  })
