var config = function(path = "./config.json"){
    const configPath = process.env.CONFIG_FILE || path;
    const configData = require(configPath);

    for(c in configData){
        configData[c] = process.env[c.toUpperCase()] || configData[c]
    }
    
    configData.contracts_path = "./" + configData.contracts_path;
    const Web3 = require("web3");
    const web3 = new Web3(configData.web3_url);
    configData.provider = web3.currentProvider;
    configData.web3_instance = web3;
    return configData;
    
}

module.exports = config;