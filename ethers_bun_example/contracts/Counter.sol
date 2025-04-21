// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public count;

    constructor(uint256 _initialCount) {
        count = _initialCount;
    }

    function increment() public {
        count += 1;
    }

    function decrement() public {
        count -= 1;
    }

    function setCount(uint256 _count) public {
        count = _count;
    }
}
