pragma solidity ^0.4.4;

import "./Ownable.sol";
import "./Identity.sol";
import "./CentralAuthority.sol";

/**
 * The Authority is contract that represent area or regional government
 */
contract Authority is Ownable {
	string public name;
	mapping (bytes32 => address) public citizens;
	address public central;
	event IRegister(bytes32 indexed id, address indexed identity, bytes32 indexed primary);
	
	function Authority() public {
		
	}

	function SetCentral (address _central) onlyOwner public {
		central = _central;
	}
	
	function SetName(string _name) onlyOwner public {
		name = _name;
	}

	//Create ID with ID Hash and primary data Hash
	function CreateIdentity (string id, bytes32 primaryHash) onlyOwner public {
		bytes32 idHash = sha256(id);
		require (citizens[idHash] == 0x00);
		Identity person = new Identity();
		person.SetIDHash(idHash);
		person.SetPrimaryHash(primaryHash);
		citizens[idHash] = address(person);
		CentralAuthority hq = CentralAuthority(central);
		hq.RegisterCitizen(idHash);
		IRegister(idHash, address(person), primaryHash);
	}

	function GetIdentityAddress (string id) public view returns(address) {
		return citizens[sha256(id)];
	}
	
	//Update ID, Alamat, RT/RW, Kelurhan, Kabupaten
	function UpdateAddress (address identity, bytes32 addressHash, address newAuthority) onlyOwner public {
		Identity person = Identity(identity);
		person.SetAddressHash(addressHash);
		if (newAuthority != 0x00 && newAuthority != address(this)){
			CentralAuthority hq = CentralAuthority(central);
			hq.Relocate(person.idHash(), newAuthority);
			person.TransferOwnership(newAuthority);
		}
	}

	//Update ID, Agama, Status Perkawinan, Pekerjaan, Kewarganegaraan, Golongan Darah, Tanggal Berlaku
	function UpdateAdditionalData (address identity, bytes32 additionalHash) onlyOwner public{
		Identity person = Identity(identity);
		person.SetAdditionalHash(additionalHash);
	}
	
	function RemoveIdentity (string id) onlyOwner public {
		bytes32 idHash = sha256(id);
		Identity person = Identity(citizens[idHash]);
		person.Deactivate();
		citizens[idHash] = 0x00;
		CentralAuthority hq = CentralAuthority(central);
		hq.RemoveCitizen(idHash);
	}
	
	
}
