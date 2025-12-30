// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HealthRecord {

    struct Record {
        string ipfsHash;
        address owner;
    }

    mapping(uint256 => Record) public records;
    mapping(uint256 => mapping(address => bool)) public access;

    uint256 public recordCount;

    /* ========= EVENTS ========= */

    event RecordAdded(
        uint256 indexed recordId,
        address indexed owner,
        string ipfsHash,
        uint256 timestamp
    );

    event AccessGranted(
        uint256 indexed recordId,
        address indexed owner,
        address indexed doctor,
        uint256 timestamp
    );

    /* ========= FUNCTIONS ========= */

    function addRecord(string memory _hash) public {
        records[recordCount] = Record(_hash, msg.sender);

        emit RecordAdded(
            recordCount,
            msg.sender,
            _hash,
            block.timestamp
        );

        recordCount++;
    }

    function grantAccess(uint256 _id, address _doctor) public {
        require(records[_id].owner == msg.sender, "Not owner");

        access[_id][_doctor] = true;

        emit AccessGranted(
            _id,
            msg.sender,
            _doctor,
            block.timestamp
        );
    }

    function hasAccess(uint256 _id, address _user)
        public
        view
        returns (bool)
    {
        return access[_id][_user];
    }
}
