// npx hardhat test --network sepolia 在指定的网络上测试
//运行test文件夹的内容需要npx hardhat test
//  npx hardhat test --grep "数组" 指定要执行的it函数, 数组是输入it函数描述的部分内容
const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")

const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name) ? describe.skip
  :
  describe("FundMe", () => {
    let fundMe
    let mockV3Aggregator
    let deployer
    const sendValue = ethers.utils.parseEther("1")//代表1个eth
    beforeEach(async () => {
      //ethers.getSigners会返回你使用网络中accounts数组 里的内容
      //就是hardhatconfig 文件中networks 对应网络的accounts数组
      //如果你使用的是默认网络,它会返回一个 长度为10的数组
      // const accounts = await ethers.getSigners()
      // const accountZero = accounts[0]
      deployer = (await getNamedAccounts()).deployer

      //fixture 作用是允许运行deploy文件夹下面,module.exports.tags = ["all", "fundme"]
      //打了对应标签的文件夹  这一步就是在部署打了all标签的所有合约
      await deployments.fixture(["all"])
      //ethers.getContract获取最近部署的合同
      fundMe = await ethers.getContract("FundMe", deployer)

      mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
    })

    //测试构造函数中的内容
    describe("constructor", () => {
      it("sets the aggregator addresses correctly", async () => {
        //getPriceFeed 是foundme合约中的public变量
        const response = await fundMe.getPriceFeed()
        console.log(response, '我是response')
        assert.equal(response, mockV3Aggregator.address)
      })
    })
    //测试fund函数
    describe("fund", () => {
      it("请给更多的钱", async () => {
        // await fundMe.fund()  直接写这个函数调用会报错
        //expect的用法就是,该函数报错了,测试才会通过,并且报了指定内容的错   
        await expect(fundMe.fund()).to.be.revertedWith("You need to spend more!")//注意,这里的文案要和合约里的文案一样


      })
      it("Updates the amount funded data structure", async () => {
        //调用fund函数传入 sendValue, 指定给转了多少eth
        await fundMe.fund({ value: sendValue })
        //给getAddressToAmountFunded 映射传入 deployer地址,拿到存了的value
        const response = await fundMe.getAddressToAmountFunded(
          deployer
        )
        console.log(sendValue)

        console.log(response, "我是response ")
        // console.log(deployer, "我是deployer")
        assert.equal(response.toString(), sendValue.toString())
        // await fundMe.fund({ value: sendValue })
        // const response = await fundMe.getAddressToAmountFunded(deployer)
        // console.log(response, "我是映射的res")
        // assert.equal(response, deployer)
      })
      it("给数组添加内容", async () => {
        await fundMe.fund({ value: sendValue })
        const response = await fundMe.getFunder(0)
        //getFunder数组存的是部署者的地址
        assert.equal(response, deployer)

      })
    })

    //测试withdraw函数
    describe("withdraw", () => {
      beforeEach(async () => {
        //每次调用fund函数都是给这个合约里转eth
        await fundMe.fund({ value: sendValue })
      })
      it("withdraws ETH from a single funder", async () => {
        //fundme.address,是合约的地址
        console.log(fundMe.address, "fundMe.address")
        //deployer是部署者的地址,不一样
        console.log(deployer, "deployer")

        // ethers方法     返回给定的地址下的余额。
        const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)

        //返回部署合约者地址下的余额   个人理解,也就是创建这个合约的人的钱包地址,如remix上的metamask
        const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

        //调用withdraw函数,将合约中的币都取出来转到部署者的地址
        const transactionResponse = await fundMe.cheaperWithdraw()
        //等待交易完成拿到交易回执
        const transactionReceipt = await transactionResponse.wait()

        const { gasUsed, effectiveGasPrice } = transactionReceipt

        //gasused,该交易的gas使用量
        //effectiveGasPrice,gas的实时价格
        //mul,ethers的方法,返回 相乘的结果
        const gasCost = gasUsed.mul(effectiveGasPrice)

        //拿到清空后合约地址余额
        const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)

        const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
        assert.equal(endingFundMeBalance, 0)
        //比较最初的值 与调用withdraw后的值,加上调用withdraw函数消耗的gas是否相等
        assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(),
          endingDeployerBalance.add(gasCost).toString()
        )




      })

      it("这是干什么", async () => {
        const accounts = await ethers.getSigners()

        for (i = 1; i < 6; i++) {
          //connect ethers的方法,同  fundMe = await ethers.getContract("FundMe", deployer)
          //一样,返回合约的一个新实例
          const fundMeConnectedContract = await fundMe.connect(
            accounts[i]
          )
          // console.log(fundMeConnectedContract, "我是fundMeConnectedContract")
          await fundMeConnectedContract.fund({ value: sendValue })
        }

        const startingFundMeBalance =
          await fundMe.provider.getBalance(fundMe.address)
        const startingDeployerBalance =
          await fundMe.provider.getBalance(deployer)

        const transactionResponse = await fundMe.withdraw()
        const transactionReceipt = await transactionResponse.wait()
        const { gasUsed, effectiveGasPrice } = transactionReceipt
        const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
        const endingFundMeBalance = await fundMe.provider.getBalance(
          fundMe.address
        )
        const endingDeployerBalance =
          await fundMe.provider.getBalance(deployer)

        // console.log(endingDeployerBalance, "11111")

        assert.equal(
          startingFundMeBalance
            .add(startingDeployerBalance)
            .toString(),
          endingDeployerBalance.add(withdrawGasCost).toString()
        )

        //expect.to.be.reverted的用法是,如果该函数fundMe.getFunder(0)抛出异常了,那么测试通过,没抛出的话,测试失败
        //fundMe.getFunder(0) 会抛出异常,是因为数组已经被清空了,这时候去调用fundMe.getFunder(0),所以会抛出异常
        await expect(fundMe.getFunder(0)).to.be.reverted

        for (i = 1; i < 6; i++) {
          assert.equal(
            await fundMe.getAddressToAmountFunded(
              accounts[i].address
            ),
            0
          )
        }


      })
      it("Only allows the owner to withdraw", async function () {
        const accounts = await ethers.getSigners()
        const fundMeConnectedContract = await fundMe.connect(
          accounts[1]
        )

        //注意,solidity的构造函数只有在部署合约的时候才会调用 那么,i_owner 只可能是部署者,也就只有部署者才能调用withdraw函数

        //expect to.be.revertedWith("FundMe__NotOwner")
        //它的用法是要抛出指定的错误了,测试通过! 
        // await expect(
        //   fundMeConnectedContract.withdraw()
        // ).to.be.revertedWith("FundMe__NotOwner")

        //测试目前只有这种断言方法才不会报错
        await expect(fundMeConnectedContract.withdraw()).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
      })



    })
  })