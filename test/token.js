const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("VotingSystem", function () {
  let VotingSystem;
  let votingSystem;
  let owner;
  let addr1;
  let addr2;

  before(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    VotingSystem = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystem.deploy(); // Deploy the contract
  });

  it("should create an election", async function () {
    await votingSystem.createElection("Election 1", 1699585200, 1700017200);
    const election = await votingSystem.getElection(0);
    expect(election.name).to.equal("Election 1");
    expect(election.startTime).to.equal(1699585200);
    expect(election.endTime).to.equal(1700017200);
  });

  it("should add a candidate", async function () {
    await votingSystem.createElection("Election 2", 1699585200, 1700017200);
    await votingSystem.addCandidate(0, "Candidate 1");
    const candidate = await votingSystem.getCandidate(0, "Candidate 1");
    expect(candidate.name).to.equal("Candidate 1");
  });

});
