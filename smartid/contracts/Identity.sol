pragma solidity ^0.4.4;

import "./Ownable.sol";

/**
 * The contractName contract does this and that...
 */
contract Identity is Ownable {

	bytes32 public idHash;
	bytes32 public primaryDataHash;
	bytes32 private addressHash;
	bytes32 private additionalDataHash;
	bool private active;

	function Identity () public{
		active = true;
	}	

	function HashID (string id) public pure returns(bytes32) {
		return sha256(id);
	}

	//Hash Nama, Tempat Lahir, Tanggal Lahir
	function HashPrimaryData(string name, string bplace, string bdate) public pure returns (bytes32) {
		bytes32 birth = sha256(sha256(bplace), sha256(bdate));
		return sha256(birth, sha256(name));
	}

	//Hash Alamat, RT/RW, Kelurhan, Kabupaten
	function HashAddress(string mainAddress, string area, string subdistrict, string district) public pure returns(bytes32) {
		bytes32 addr = sha256(sha256(mainAddress), sha256(area));
		bytes32 dist = sha256(sha256(subdistrict), sha256(district));
		return sha256(addr, dist);
	}

	//Hash Agama, Status Perkawinan, Pekerjaan, Kewarganegaraan, Golongan Darah, Jenis Kelamin, Tanggal Berlaku
	function HashAdditionalData (string religion, string marital, string job, string citizenship, string bloodType, string gender, string expired) public pure returns(bytes32) {
		bytes32 data1 = sha256(sha256(religion), sha256(marital));
		bytes32 data2 = sha256(sha256(job), sha256(citizenship));
		bytes32 data3 = sha256(sha256(bloodType), sha256(gender));
		bytes32 dataMerge = sha256(data1, data2);
		bytes32 dataMerge2 = sha256(data3, sha256(expired));
		return sha256(dataMerge, dataMerge2);
	}
	
	function SetIDHash (bytes32 hash) onlyOwner public {
		if (idHash != 0x00)
			return;
		idHash = hash;
	}
	
	function SetPrimaryHash (bytes32 hash) onlyOwner public {
		if (primaryDataHash != 0x00)
			return;
		primaryDataHash = hash;
	}

	
	function SetAddressHash (bytes32 hash) onlyOwner public {
		addressHash = hash;
	}
	
	
	function SetAdditionalHash (bytes32 hash) onlyOwner public{
		additionalDataHash = hash;
	}

	//Check NIK
	function CheckID (string id) public view returns(bool){
		require(idHash != 0x00);
		return idHash == sha256(id) && active;
	}
	
	//Check Nama, Tempat Lahir, Tanggal Lahir
	function CheckPrimaryData (string name, string bplace, string bdate) public view returns(bool) {
		require(primaryDataHash != 0x00);
		return primaryDataHash == HashPrimaryData(name, bplace, bdate) && active;
	}
	
	//Check Alamat, RT/RW, Kelurhan, Kabupaten
	function CheckAddress (string mainAddress, string area, string subdistrict, string district) public view returns(bool) {
		require(addressHash != 0x00);
		return addressHash == HashAddress(mainAddress, area, subdistrict, district) && active;
	}
	
	//Check Agama, Status Perkawinan, Pekerjaan, Kewarganegaraan, Golongan Darah, Tanggal Berlaku
	function CheckAdditionalData (string religion, string marital, string job, string citizenship, string bloodType, string gender, string expired) public view returns(bool) {
		require(additionalDataHash != 0x00);
		return additionalDataHash == HashAdditionalData(religion, marital, job, citizenship, bloodType, gender, expired) && active;
	}
	
	function GetLeftHash() public view returns (bytes32) {
		require (idHash != 0x00 && primaryDataHash != 0x00);
		return sha256(idHash,primaryDataHash);
	}

	function GetRightHash() public view returns (bytes32) {
		require(addressHash != 0x00 && additionalDataHash != 0x00);
		return sha256(addressHash,additionalDataHash);
	}

	function GetRootHash () public view returns (bytes32) {
		require (idHash != 0x00 && primaryDataHash != 0x00 && addressHash != 0x00 && additionalDataHash != 0x00);
		return sha256(sha256(idHash,primaryDataHash), sha256(addressHash,additionalDataHash));
	}

	function Deactivate () onlyOwner public {
		active = false;
	}
	
	
}
