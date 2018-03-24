var contractUtil = function(config) {
    if (config == undefined) {
        console.log('Config empty, please specify correct configuration');
        process.exit();
    }

    const contract = require("truffle-contract");
    const web3 = config.web3_instance;

    if (config.default_account == undefined || config.default_account == ""){
        web3.eth.getAccounts()
        .then(
            accounts =>  config.default_account = accounts[0],
            err => console.log(err)
        )
    }

    
    //Prepare contract for being instantiate
    const prepareContract = async function(artifact) {
        const TheContract = contract(artifact);
        TheContract.setProvider(config.provider);
        TheContract.currentProvider.sendAsync = function () {
            return TheContract.currentProvider.send.apply(TheContract.currentProvider, arguments);
        };
        
        TheContract.defaults({
            from: config.default_account,
            gas: config.gas_limit,
            gasPrice : config.gas_price 
          })
        return TheContract;
    }

    //Retrieve contract definition
    this.getContract = async function(name) {
        const artifact = config.contracts[name];
        if (artifact == undefined)
            throw('Contract not found ' + name);
        return await prepareContract(artifact);
    }

    this.normalize = function(payload) {
        for(k in payload) {
            payload[k] = payload[k].replace(/\s\s+/g, ' ').trim().toLowerCase();
        }
        return payload;
    }

    this.CheckJSON = function(doc, fields) {
        if (doc == undefined)
          return { 
                valid : false,
                message : 'missing document'
            };
        for(n in fields) {
          const field = fields[n];
          if (doc[field] == undefined )
            return { 
                valid : false,
                message : field
            };
          if (typeof doc[field] == 'string' && doc[field] == '')
            return { 
                valid : false,
                message : field
            };
        }
        return { 
            valid : true,
            message : ""
        };
    }

    function Hash(obj){
        if (obj == undefined)
            throw('Invalid object')
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(JSON.stringify(obj)).digest('base64');
    }
}

module.exports = contractUtil;