/*
 * Copyright ©️ 2020 Curio AG (Company Number FL-0002.594.728-9)
 * Incorporated and registered in Liechtenstein
 *
 * Copyright ©️ 2020 Curio Capital AG (Company Number CHE-211.446.654)
 * Incorporated and registered in Zug, Switzerland.
 */
const web3Utils = require('web3-utils');
const fs = require('fs');
const path = require('path');

const ownerAddress = ''; // TODO: set
const proxyAdminAddress = ''; // TODO: set

const initialSupply = ''; // in wei TODO: set

module.exports = function(deployer, network, accounts) {
  if (network === 'test' || network === 'soliditycoverage' || network === 'development') {
    console.log('Skipping deployment migration');
    return;
  }

  deployer.then(async () => {
    // eslint-disable-next-line global-require
    const { deployTokenAndTokenController } = require('../helpers/deploy')(artifacts);

    const { tokenController, token: mainToken } = await deployTokenAndTokenController(
      accounts[0],
      proxyAdminAddress
    );

    console.log('tokenController.addAdmin');
    await Promise.all([tokenController.addAdmin(accounts[0])]);

    console.log('tokenController.setToken');
    await tokenController.setToken(mainToken.address);

    console.log('tokenController.mintTokens');
    await Promise.all([
      tokenController.mintTokens(ownerAddress, web3Utils.toWei(initialSupply, 'wei')),
    ]);

    console.log('mainToken.transferOwnership, tokenController.transferOwnership');
    await Promise.all([
      mainToken.transferOwnership(ownerAddress),
      tokenController.transferOwnership(ownerAddress),
    ]);

    const contractsData = {
      mainTokenAddress: mainToken.address,
      mainTokenAbi: mainToken.abi,
      tokenControllerAddress: tokenController.address,
      tokenControllerAbi: tokenController.abi
    };

    const deployDirectory = `${__dirname}/../deployed`;
    if (!fs.existsSync(deployDirectory)) {
      fs.mkdirSync(deployDirectory);
    }

    fs.writeFileSync(path.join(deployDirectory, `${network}.json`), JSON.stringify(contractsData, null, 2));
  });
};
