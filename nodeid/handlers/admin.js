var admin = function(app, config){
	const Util = require('../contract_util.js');
	const util = new Util(config);
	var auth, gid, central;

	if (config.central_address == '0x00' || config.auth_address == '0x00')
		return;


	async function init() {
		const Authority = await util.getContract('Authority');
		const Identity = await util.getContract('Identity');
		//const CentralAuthority = await util.getContract('CentralAuthority');
		//central = await CentralAuthority.at(config.central_address);
		auth = await Authority.at(config.auth_address);
		const idAddr = await auth.GetIdentityAddress('0');
		gid = await Identity.at(idAddr);
		console.log("Admin module initialized")
		//console.log(idAddr);
	}

	init();	

	app.post('/admin/identity', async function(req, res) {
		const payload = req.body;
		const state = util.CheckJSON(payload, ['nik','nama','tempat_lahir', 'tanggal_lahir', 'alamat_jalan', 'alamat_rtrw', 'alamat_kelurahan', 'alamat_kecamatan', 'agama', 'status_perkawinan', 'pekerjaan', 'jenis_kelamin', 'golongan_darah', 'kewarganegaraan', 'masa_berlaku']);
        if (!state.valid){
            console.error("Invalid Payload")
            res.status(400).send(state.message)
            return
        }
        
        const hashes = await getHash(payload);
        try {
        	await auth.CreateFullIdentity(payload.nik, hashes[0], hashes[1], hashes[2]);
        } catch (e) {
        	console.error('Error create new identity')
        	console.error(e);
        	res.status(400).send('Unable to create identity, perhaps it`s already registered ');
        	return;
        }
       	
        const id = await auth.GetIdentityAddress(payload.nik);
		res.status(200).send({address:id});
	})	

	async function getHash(payload) {
		payload = util.normalize(payload);
		//console.log(payload);
		const phash = gid.HashPrimaryData(payload.nama, payload.tempat_lahir, payload.tanggal_lahir);
        const adhash = gid.HashAddress(payload.alamat_jalan, payload.alamat_rtrw, payload.alamat_kelurahan, payload.alamat_kecamatan);
        const ihash = gid.HashAdditionalData(payload.agama, payload.status_perkawinan, payload.pekerjaan, payload.kewarganegaraan, payload.golongan_darah, payload.jenis_kelamin, payload.masa_berlaku);
        return Promise.all([phash, adhash, ihash])
	}

	app.put('/admin/identity/:nik/address', async function(req, res) {
		var payload = req.body;
		const nik = req.params.nik;
		const state = util.CheckJSON(payload, ['alamat_jalan', 'alamat_rtrw', 'alamat_kelurahan', 'alamat_kecamatan']);
        if (!state.valid){
            console.error("Invalid Payload")
            res.status(400).send(state.message)
            return
        }
        payload = util.normalize(payload);
        const adhash = await gid.HashAddress(payload.alamat_jalan, payload.alamat_rtrw, payload.alamat_kelurahan, payload.alamat_kecamatan);
        var location = config.auth_address;
        if (payload.auth_address != undefined && payload.auth_address.length == 42)
        	location = payload.auth_address

        try {
        	await auth.UpdateAddress( nik, adhash , location)
        } catch(e) {
        	console.error('Error update address')
        	console.error(e);
        	res.status(400).send('Unable to update address, bad arguments')
        	return;
        }
        

		res.status(200).send("OK");
	})

	app.put('/admin/identity/:nik/info', async function(req, res) {
		var payload = req.body;
		const nik = req.params.nik;
		const state = util.CheckJSON(payload, ['agama', 'status_perkawinan', 'pekerjaan', 'jenis_kelamin', 'golongan_darah', 'kewarganegaraan', 'masa_berlaku']);
        if (!state.valid){
            console.error("Invalid Payload")
            res.status(400).send(state.message)
            return
        }
        payload = util.normalize(payload);
        const ihash = await gid.HashAdditionalData(payload.agama, payload.status_perkawinan, payload.pekerjaan, payload.kewarganegaraan, payload.golongan_darah, payload.jenis_kelamin, payload.masa_berlaku);
        
        try {
        	await auth.UpdateAdditionalData( nik, ihash)
        } catch(e) {
        	console.error('Error update info')
        	console.error(e);
        	res.status(400).send('Unable to update info, bad arguments')
        	return;
        }

		res.status(200).send("OK");
	})

	app.delete('/admin/identity/:nik', async function (req, res) {
		const nik = req.params.nik;
		
		 try {
        	await auth.RemoveIdentity(nik)
        } catch(e) {
        	console.error('Error delete identity')
        	console.error(e);
        	res.status(400).send('Unable to delete identity')
        	return;
        }
		res.status(200).send("OK");
	})
}

module.exports = admin