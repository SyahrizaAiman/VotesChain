// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Voter {
        address voterAddress;
        bool hasVoted;
    }

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Election {
        string name;
        uint256 startTime;
        uint256 endTime;
        mapping(address => Voter) voters;
        mapping(string => Candidate) candidates;
        string[] candidateNames; // Store candidate names separately
    }

    mapping(uint256 => Election) elections;
    uint256 nextElectionId;

    function createElection(string memory name, uint256 startTime, uint256 endTime) public {
        require(startTime > block.timestamp, "Election start time must be in the future");
        require(endTime > startTime, "Election end time must be after the start time");

        Election storage newElection = elections[nextElectionId];
        newElection.name = name;
        newElection.startTime = startTime;
        newElection.endTime = endTime;

        nextElectionId++;
    }

    function addCandidate(uint256 electionId, string memory name) public {
        Election storage election = elections[electionId];
        require(election.startTime > block.timestamp, "Election has already started");

        election.candidates[name] = Candidate(name, 0);
        election.candidateNames.push(name); // Store candidate name
    }

    function vote(uint256 electionId, string memory candidateName) public {
        Election storage election = elections[electionId];
        require(election.startTime < block.timestamp, "Election has not yet started");
        require(election.endTime > block.timestamp, "Election has already ended");
        require(!election.voters[msg.sender].hasVoted, "Voter has already voted");

        election.voters[msg.sender].hasVoted = true;
        election.candidates[candidateName].voteCount++;
    }

    function getElectionResults(uint256 electionId) public view returns (string[] memory candidateNames, uint256[] memory voteCounts) {
        Election storage election = elections[electionId];
        require(election.endTime < block.timestamp, "Election has not yet ended");

        uint256 numCandidates = election.candidateNames.length;
        candidateNames = new string[](numCandidates);
        voteCounts = new uint256[](numCandidates);

        for (uint256 i = 0; i < numCandidates; i++) {
            string memory candidateName = election.candidateNames[i];
            candidateNames[i] = candidateName;
            voteCounts[i] = election.candidates[candidateName].voteCount;
        }
    }
    function getElection(uint256 electionId) public view returns (string memory name, uint256 startTime, uint256 endTime) {
        Election storage election = elections[electionId];
        return (election.name, election.startTime, election.endTime);
    }

    function getCandidate(uint256 electionId, string memory candidateName) public view returns (string memory name, uint256 voteCount) {
        Election storage election = elections[electionId];
        Candidate storage candidate = election.candidates[candidateName];
        return (candidate.name, candidate.voteCount);
    }
}
