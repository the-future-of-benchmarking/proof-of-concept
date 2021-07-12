// var ConvertLib = artifacts.require("./ConvertLib.sol");
// var MetaCoin = artifacts.require("./MetaCoin.sol");
var PaillierBalance = artifacts.require("./PaillierBalance.sol");

module.exports = function(deployer) {
  deployer.deploy(PaillierBalance);
  
};
