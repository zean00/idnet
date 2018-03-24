pragma solidity ^0.4.4;

import "./Ownable.sol";
/**
 * The CentralAuthority is global single contract that represent central government
 */
contract CentralAuthority is Ownable {
	string public name;
	mapping (address => bool) private authorities;
	mapping (bytes32 => address) placement;
	
	function CentralAuthority() public{
		authorities[this] = true;
	}

	modifier onlyAuthority() {
	    if (authorities[msg.sender] == true)
	      _;
	  }

	function SetName(string _name) onlyOwner public {
		name = _name;
	}

	//Register Authority
	function RegisterAuthority(address authority) onlyOwner public {
		authorities[authority] = true;
	}

	//Check if Authority is registered on central 
	function IsAuthorized(address authority) public view returns(bool) {
		return authorities[authority];
	}
	
	//Register citizen and store the location (only for Authority)
	function RegisterCitizen (bytes32 idHash) onlyAuthority public {
		require (placement[idHash] == 0x00);
		placement[idHash] = msg.sender;
	}
	

	function Relocate(bytes32 idHash, address newAuthority) onlyAuthority public {
		require (placement[idHash] == msg.sender);
		placement[idHash] = newAuthority;
	}

	function RemoveCitizen (bytes32 idHash) onlyAuthority public {
		placement[idHash] = 0x00;
	}

	function GetLocation (string id) public view returns(address) {
		return placement[sha256(id)];
	}
	
	function RemoveAuthority (address authority) onlyOwner public {
		authorities[authority] = false;
	}
	
	
	
}
