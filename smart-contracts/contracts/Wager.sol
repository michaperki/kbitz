
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wager {
    address public player1;
    address public player2;
    uint public wagerAmount;
    bool public gameActive;

    constructor(address _player1, address _player2, uint _wagerAmount) {
        player1 = _player1;
        player2 = _player2;
        wagerAmount = _wagerAmount;
        gameActive = true;
    }

    function deposit() public payable {
        require(gameActive, "Game is not active");
        require(msg.value == wagerAmount, "Incorrect wager amount");
        require(msg.sender == player1 || msg.sender == player2, "Only players can deposit");

        // The contract now holds the wager amount from both players
    }

    function declareWinner(address winner) public {
        require(gameActive, "Game is already over");
        require(msg.sender == player1 || msg.sender == player2, "Only players can declare the winner");

        payable(winner).transfer(address(this).balance);
        gameActive = false;  // End the game after the winner is declared
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
