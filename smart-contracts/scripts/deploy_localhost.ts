import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Wager = await ethers.getContractFactory("Wager");
  const wagerAmount = ethers.parseEther("1.0"); // Set wager to 1 MATIC
  const player1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const player2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  // Deploy the contract with player addresses and wager amount
  const wagerContract = await Wager.deploy(player1, player2, wagerAmount);

  await wagerContract.waitForDeployment();

  console.log("Wager contract deployed to:", wagerContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

