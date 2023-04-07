const verify = async (contractAddress, args) => {
  console.log('正在验证合约')
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args
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
module.exports = {
  verify
}