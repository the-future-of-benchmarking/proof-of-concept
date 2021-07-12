/*
SPDX-License-Identifier: MIT
*/
pragma solidity >=0.8.0;
contract PaillierBalance {

    /*{REPLACE} - DO NOT TOUCH - AUTO GENERATED!!*/
    uint public encryptedBalance = 0x6bc7173a88bbbbe177a66a0e2fd2321e483f45a5ce0c05f69234e14245d99ad2;
    uint public g = 0x23dc012a8f2cee1aebf42e9ac5bde1f07cde02db4245f88144914e0dc3f80134;
    uint public n = 0xafefd0756600c67eef4583eeddfcd583;
    uint nSquared = 0x78e9bfa76668806bd40c21325804e943d1b5c1a06868e7fbf7bd93ed39fb4109;
    uint private lambda = 0x430606451aaaf648137ddc7d804ff04;
    uint private mu = 0x55db189016d33a23e46d21f6cb42d5d8;
    uint private upper_bound = 0x67ecf5e521a3abd5322ec82ecb440c05569ff0132890bf5951dcbcb9c3727594;
    uint private lower_bound = 0x6b1db260840ae9cdda7a017ee83965aa6fe11428f0fd8f887cc1b9001e7dda55;
    /*{END} - DO NOT TOUCH - AUTO GENERATED!!*/
    
    struct Benchmark {
    string name;
    uint sum;
    address[] participants;
    }
    bytes32[] public benchmarks;
    mapping(bytes32 => Benchmark) benchmarkStructs;

    address public controller;

    event Entry(
        address indexed _from,
        uint indexed newBalance,
        uint encryptedChange
    );
      
    constructor () {                                    
        controller = msg.sender;
    }

                                

    function homomorphicAdd(uint encryptedChange) public {
        /* require(msg.sender == controller); */
        uint encryptedBalanceInner = encryptedBalance;  
        uint nSquaredInner = nSquared; 
        uint encryptedBalanceTemp;                                          
        assembly {
            let _encryptedBalance := encryptedBalanceInner                  
            let _encryptedChange := encryptedChange             
            let _nSquared := nSquaredInner                  
            encryptedBalanceTemp := mulmod(_encryptedBalance, _encryptedChange,_nSquared)
        }
        encryptedBalance = encryptedBalanceTemp;  
        emit Entry(msg.sender, encryptedBalanceTemp, encryptedChange);                  
    }

    function homomorphicLesserThan(uint encryptedEntry, uint upperBound) public returns (uint) {
        /* Watch out, if Entry == lower_bound, results in 0 at subtraction */

        // https://mentalmodels4life.net/2018/07/07/multiplication-and-comparison-operations-in-paillier/
        // Add and Multiply with random
        uint lesser_than;
        uint nSquaredInner = nSquared;
    	uint random = random();
        assembly {
            let _nSquared := nSquaredInner 
            let _random := random
            lesser_than := mod(exp(mulmod(upperBound, encryptedEntry, _nSquared), _random), _nSquared)
        }
        return lesser_than;

    }

    function homomorphicGreaterThan(uint encryptedEntry, uint lowerBound) public returns (uint) {
        /* Watch out, if Entry == lower_bound, results in 0 at subtraction */

        // https://mentalmodels4life.net/2018/07/07/multiplication-and-comparison-operations-in-paillier/
        // Add and Multiply with random
        uint greater_than;
        uint nSquaredInner = nSquared;
        uint random = random();
        assembly {
            let _nSquared := nSquaredInner 
            let _random := random
            greater_than := mod(exp(mulmod(encryptedEntry, lowerBound, _nSquared), _random), _nSquared)
        }
        return greater_than;

    }

    function homomorphicCompare(uint encryptedValue) public {

    }

    /* https://ethereum.stackexchange.com/a/85138 */ 
    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, now, number)));
    }
}