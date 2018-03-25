#! /usr/bin/env node
const config = require('./config.js')('./config.json');
const init = require('./init.js');
const Util = require('./contract_util.js');
const util = new Util(config);
const args = process.argv

main()
.then(function(){
	process.exit()
})

async function main() {
	const command = args[2]
	if (command == undefined) {
		console.log('Missing command')
		return;
	}

	await init(config)
	if (command == 'create'){
		const res = await createCentral(args[3])
		console.log("Central successfully created at address : " + res);
		return res;
	}

	if (command == 'add') {
		if (args[3] == undefined || args[3] == '' || args[4] == undefined || args[4] == '' || args[3].length != 42 || args[4].length != 42) {
			console.log("Missing arguments, you should provide central address and authority address")
		} else {
			try {
				await addAuthority(args[3], args[4])
			} catch(e) {
				console.error(e)
			}
			console.log("Successfully add authority to central")
		}
	}

	if (command == 'auth') {
		if (args[3] == undefined || args[3] == '' || args[3].length != 42) {
			console.log("Missing arguments, should at least provide central address");
		} else {
			const res = await createAuthority(args[3], args[4])
			console.log("Authority successfully created at address : " + res);
			return res;
		}
	}

	if (command == 'all') {
		const fs = require('fs');
		const c = await createCentral(args[3])
		const a = await createAuthority(c, args[4])
		await addAuthority(c,a);
		var confile = fs.readFileSync('./config.json','utf8');
		confile = JSON.parse(confile);
		confile.central_address = c;
		confile.auth_address = a;
		
		fs.writeFileSync('./config.json', JSON.stringify(confile, null, 2));
		console.log("Central successfully created at address : " + c);
		console.log("Authority successfully created at address : " + a);
	}
}


async function createCentral(name) {	
 	const Central = await util.getContract('CentralAuthority');
 	const central = await Central.new();
 	if (name != undefined && name != "")
 		central.SetName(name)
 	return central.address;
}

async function addAuthority(centralAddress, authorityAddress) {
	const Central = await util.getContract('CentralAuthority');
 	const central = await Central.at(centralAddress);
 	return await central.RegisterAuthority(authorityAddress);
}

async function createAuthority(centralAddress, name) {
	const Authority = await util.getContract('Authority');
	const auth = await Authority.new();
	if (name != undefined && name != '')
		await auth.SetName(name);
	await auth.SetCentral(centralAddress);
	await auth.CreateIdentity('0', '0x00');
	return auth.address;
}
