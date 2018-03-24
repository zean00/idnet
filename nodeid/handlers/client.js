var client = function(app, config){
	const Util = require('../contract_util.js');
	const util = new Util(config);
	var auth, gid, central, Authority, Identity, Central;

	if (config.central_address == '0x00')
		return;

	async function init() {
		Authority = await util.getContract('Authority');
		Identity = await util.getContract('Identity');
		CentralAuthority = await util.getContract('CentralAuthority');
		central = await CentralAuthority.at(config.central_address);
	
		console.log("Client module initialized")
		//console.log(idAddr);
	}

	init();	

	app.post('/client/identity/:nik', async function(req, res) {
		const payload = util.normalize(req.body);
		const id = await getID(req.params.nik);
		if (id == undefined) {
			res.status(200).send({status:false});
			return;
		}
		const pdata = id.CheckPrimaryData(payload.nama, payload.tempat_lahir, payload.tanggal_lahir);
		const adata = id.CheckAddress(payload.alamat_jalan, payload.alamat_rtrw, payload.alamat_kelurahan, payload.alamat_kecamatan);
		const idata = id.CheckAdditionalData(payload.agama, payload.status_perkawinan, payload.pekerjaan, payload.kewarganegaraan, payload.golongan_darah, payload.jenis_kelamin, payload.masa_berlaku);
		const r = await Promise.all([pdata, adata, idata])
		res.status(200).send({status: r[0] && r[1] && r[2]});
	})

	app.post('/client/identity/:nik/personal', async function(req, res) {
		const payload = util.normalize(req.body);
		const id = await getID(req.params.nik);
		if (id == undefined) {
			res.status(200).send({status:false});
			return;
		}
		const r = await id.CheckPrimaryData(payload.nama, payload.tempat_lahir, payload.tanggal_lahir);
		res.status(200).send({status:r});
	})

	app.post('/client/identity/:nik/address', async function(req, res) {
		const payload = util.normalize(req.body);
		const id = await getID(req.params.nik);
		if (id == undefined) {
			res.status(200).send({status:false});
			return;
		}
		const r = await id.CheckAddress(payload.alamat_jalan, payload.alamat_rtrw, payload.alamat_kelurahan, payload.alamat_kecamatan);
		res.status(200).send({status:r});
	})

	app.post('/client/identity/:nik/info', async function(req, res) {
		const payload = util.normalize(req.body);
		const id = await getID(req.params.nik);
		if (id == undefined) {
			res.status(200).send({status:false});
			return;
		}
		const r = await id.CheckAdditionalData(payload.agama, payload.status_perkawinan, payload.pekerjaan, payload.kewarganegaraan, payload.golongan_darah, payload.jenis_kelamin, payload.masa_berlaku);
		res.status(200).send({status:r});
	})

	app.get('/client/identity/:nik', async function(req, res) {
		const id = await getID(req.params.nik);
		if (id == undefined) {
			res.status(200).send({status:false});
			return;
		}
		const r = await id.CheckID(req.params.nik);
		res.status(200).send({status:r});
	})

	app.get('/client/authority/:address', async function(req, res) {
		const addr = '0x' + req.params.address;
		const r = await central.IsAuthorized(addr);
		res.status(200).send({status:r});
	})

	async function getID(nik) {
		authLoc = await central.GetLocation(nik);
		if (authLoc == '0x0000000000000000000000000000000000000000')
			return undefined
		auth = await Authority.at(authLoc);
		idAddr = await auth.GetIdentityAddress(nik);
		return await Identity.at(idAddr);
	}
}

module.exports = client