const init = async function(config){
    if (config == undefined) {
        console.log('Config empty, please specify correct configuration');
        process.exit();
    }
    
    //Execute the initialization task
    var files = scanContractFiles();
    //const recordCount = await db.collection(config.contracts_definition).count();
    await loadContracts(files);
    if (config.default_account == undefined || config.default_account == ""){
        const accounts = await config.web3_instance.eth.getAccounts();
        config.default_account = accounts[0];
    }
    console.log('Initialization success');
    return config;
    
    //Scan contract files (.json - result of truffle compile)
    function scanContractFiles() {
        console.log('Read contract files from directory ' + config.contracts_path);
        const fs = require('fs');
        const files = fs.readdirSync(config.contracts_path);
        var contracts = {};
        for(f in files) {
            name = files[f].split('.')[0];
            //if(name[0] == 'I') continue;
            contracts[name] = files[f];
            //console.log(name);
        }
        return contracts;
    }

    //Load contract definition (.json)
    async function loadContracts(contracts) {
        console.log('Load contract definition');
        config.contracts = {}
        config.events = [];
        let allEvents = [];
        for(name in contracts) {
            const def = require(config.contracts_path + '/' + contracts[name]);
            let events = findEvent(def.abi);
            Array.prototype.push.apply(config.events, events);
            config.contracts[name] = def;
        }

    }

    function findEvent(data) {
        let events = []
        for(n in data){
            if (data[n].type == 'event')
                events.push(data[n])
        }
        return events;
    }
    
}

module.exports = init;