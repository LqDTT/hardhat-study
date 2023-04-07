const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

// 测试脚本里面应该包括一个或多个describe块，每个describe块应该包括一个或多个it块。
// describe块称为"测试套件"（test suite），表示一组相关的测试。它是一个函数，
// 第一个参数是测试套件的名称（"测试index.js"），第二个参数是一个实际执行的函数。
// it块称为"测试用例"（test case），表示一个单独的测试，
// 是测试的最小单位。它也是一个函数，
// 第一个参数是测试用例的名称（"啦啦啦啦"），第二个参数是一个实际执行的函数。


describe("SimpleStorage", () => {
  let simpleStorageFactory, simpleStorage

  //beforeEach,确保它在it 测试用例之前运行
  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await simpleStorageFactory.deploy()
  })

  it("你是个啥玩意啊??????", async () => {
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = "0"
    //assert断言, 就是看 括号里的第一个参数和第二个参数是否相等,不等就报错
    assert.equal(currentValue, expectedValue)
  })
  it("我又来了哈", async function () {
    const expectedValue = "7"
    const transactionResponse = await simpleStorage.store(expectedValue)
    await transactionResponse.wait(1)

    const currentValue = await simpleStorage.retrieve()
    // assert.equal(currentValue, expectedValue)
    //二者使用方法一样
    expect(currentValue).to.equal(expectedValue)
  })

  // it("看我用新的expect用法", async function () {
  //   const expectedPersonName = "Patrick"
  //   const expectedFavoriteNumber = "16"
  //   const transactionResponse = await simpleStorage.addPerson(
  //     expectedPersonName,
  //     expectedFavoriteNumber
  //   )
  //   await transactionResponse.wait(1)
  //   const { favoriteNumber, name } = await simpleStorage.people(0)
  //   // We could also do it like this
  //   // const person = await simpleStorage.people(0)
  //   // const favNumber = person.favoriteNumber
  //   // const pName = person.name

  //   assert.equal(name, expectedPersonName)
  //   assert.equal(favoriteNumber, expectedFavoriteNumber)
  // })

})