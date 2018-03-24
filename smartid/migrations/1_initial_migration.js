const Migrations = artifacts.require("./Migrations.sol");
const Identity = artifacts.require("./Identity.sol");
const CentralAuthority = artifacts.require("./CentralAuthority.sol");
const Authority = artifacts.require("./Authority.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Identity);
  deployer.deploy(CentralAuthority);
  deployer.deploy(Authority);
};

