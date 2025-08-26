// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract TwitpayEscrow {

   struct Bounty {
      address creator;
      uint256 maxNumberOfRecipient;
      uint256 totalAmount;
      uint256 amountPerRecipient;
      uint256 expirationTime;
      bool isActive;
      mapping(address => bool) hasClaimed;
      mapping(address => bool) whitelist;
      uint256 claimedCount;
    }
    
    mapping(uint256 => Bounty) public bounties;
    mapping(address => uint256[]) public userBounties;

    mapping(uint256 => address[]) public bountiesWaitlist;
   
    uint256 public nextBountyId = 1;
    address public verifier; // Address that can verify recipients
    
    event TransferCreated(
        uint256 indexed bountyId,
        address indexed creator,
        uint256 totalAmount
    );
    
    event RecipientVerified(
        uint256 indexed transferId,
        address indexed recipient,
        address indexed verifier
    );
    
    event EtherClaimed(
        uint256 indexed transferId,
        address indexed recipient,
        uint256 amount
    );
    
    event TransferRefunded(
        uint256 indexed transferId,
        address indexed creator,
        uint256 refundAmount
    );
    
    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can perform this action");
        _;
    }
    
    modifier onlyCreator(uint256 bountyId) {
        require(msg.sender == bounties[bountyId].creator, "Only creator can perform this action");
        _;
    }
    
    modifier bountyExists(uint256 bountyId) {
        require(bountyId < nextBountyId && bountyId > 0, "bounty does not exist");
        _;
    }
    
    modifier bountyActive(uint256 bountyId) {
        require(bounties[bountyId].isActive, "bounty is not active");
        _;
    }
    
    modifier hasExpired(uint256 bountyId) {
        require(block.timestamp >= bounties[bountyId].expirationTime, "bounty has not expired yet");
        _;
    }
    
   modifier notExpired(uint256 bountyId) {
      require(block.timestamp < bounties[bountyId].expirationTime, "bounty has expired");
      _;
    }
    constructor(address _verifier) {
        verifier = _verifier;
    }
    
    function createBounty(
        uint256 expirationDuration,
        uint256 maxNumberOfRecipient,
        uint256 amountPerRecipient
    ) external payable {
        require(msg.value > 0, "Must send ether");
        require(expirationDuration > 0, "Expiration duration must be positive");
        
        uint256 bountyId = nextBountyId++;
        require(amountPerRecipient > 0, "Amount per recipient must be greater than 0");
        
        Bounty storage newBounty = bounties[bountyId];
        newBounty.creator = msg.sender;
        newBounty.totalAmount = msg.value;
        newBounty.amountPerRecipient = amountPerRecipient;
        newBounty.expirationTime = block.timestamp + expirationDuration;
        newBounty.isActive = true;
        newBounty.claimedCount = 0;
        newBounty.maxNumberOfRecipient = maxNumberOfRecipient;
        
        // Track bounties
        userBounties[msg.sender].push(bountyId);
        
        emit TransferCreated(
            bountyId,
            msg.sender,
            msg.value
        );
    }
    
    /**
     * @dev Verify a recipient for a specific transfer
     * @param bountyId The bounty ID
     * @param recipient The recipient to verify
     */
    function verifyRecipient(uint256 bountyId, address recipient) 
        external 
        onlyVerifier 
        bountyExists(bountyId) 
        bountyActive(bountyId)
        notExpired(bountyId)
    {
        
        if (bounties[bountyId].whitelist[recipient]) {
            bounties[bountyId].whitelist[recipient] = true;
        }
    }
    
    /**
     * @dev Allow verified recipients to claim their ether
     * @param bountyId The bounty ID to claim from
     */
    function claimEther(uint256 bountyId) 
        external 
        bountyActive(bountyId) 
        bountyExists(bountyId)
        notExpired(bountyId)
    {
        Bounty storage bounty = bounties[bountyId];
        
        require(bounty.whitelist[msg.sender], "Recipient not verified");
        require(!bounty.hasClaimed[msg.sender], "Already claimed");

        uint256 claimAmount = bounty.amountPerRecipient;
        require(bounty.totalAmount - claimAmount > 0, "bounty reward exhausted");
        (bool success, ) = payable(msg.sender).call{value: claimAmount}("");
        require(success, "Transfer failed");
                
        bounty.hasClaimed[msg.sender] = true;
        bounty.claimedCount++;
        emit EtherClaimed(bountyId, msg.sender, claimAmount);
    }
    
    /**
     * @dev Allow creator to claim refund after expiration
     * @param bountyId The bounty ID to refund
     */
    function claimRefund(uint256 bountyId) 
        external 
        bountyExists(bountyId) 
        onlyCreator(bountyId)
        bountyActive(bountyId)
        hasExpired(bountyId)
    {
        Bounty storage bounty = bounties[bountyId];
        
        uint256 unclaimedAmount = bounty.totalAmount - (bounty.claimedCount * bounty.amountPerRecipient);
        require(unclaimedAmount > 0, "No unclaimed fund to refund");
        
        (bool success, ) = payable(msg.sender).call{value: unclaimedAmount}("");
        require(success, "Refund failed");
        
        bounty.isActive = false;
        emit TransferRefunded(bountyId, msg.sender, unclaimedAmount);
    }
    
    /**
     * @dev Get transfer details
     */
    function getTransfer(uint256 bountyId) 
        external 
        view 
        bountyExists(bountyId)
        returns (
            address creator,
            uint256 totalAmount,
            uint256 amountPerRecipient,
            uint256 expirationTime,
            bool isActive,
            uint256 claimedCount,
            uint256 maxNumberOfRecipient
        ) 
    {
        Bounty storage bounty = bounties[bountyId];
        return (
            bounty.creator,
            bounty.totalAmount,
            bounty.amountPerRecipient,
            bounty.expirationTime,
            bounty.isActive,
            bounty.claimedCount,
            bounty.maxNumberOfRecipient
        );
    }
    
   //  function isRecipientVerified(uint256 bountId, address recipient) 
   //    external 
   //    view 
   //    bountyExists(bountyId)
   //    returns (bool) 
   //  {
   //    return transfers[transferId].hasVerified[recipient];
   //  }
    
    /**
     * @dev Check if recipient has claimed for a transfer
     */
    function hasRecipientClaimed(uint256 bountyId, address recipient) 
        external 
        view 
        bountyExists(bountyId)
        returns (bool) 
    {
        return bounties[bountyId].hasClaimed[recipient];
    }

   function isVerified(uint256 bountyId, address recipient) view external returns (bool) {
      bool isValidRecipient = false;
      for (uint256 i = 0; i < bountiesWaitlist[bountyId].length; i++) {
         if (bountiesWaitlist[bountyId][i] == recipient) {
               isValidRecipient = true;
               break;
         }
      }
      return isValidRecipient;
   }
    
    /**
     * @dev Get transfers created by an address
     */
    function getCreatorTransfers(address creator) external view returns (uint256[] memory) {
        return userBounties[creator];
    }
    
   //  function getRecipientTransfers(address recipient) external view returns (uint256[] memory) {
   //      return recipientTransfers[recipient];
   //  }
    
    /**
     * @dev Update verifier address (only current verifier can do this)
     */
    function updateVerifier(address newVerifier) external onlyVerifier {
        require(newVerifier != address(0), "Invalid verifier address");
        verifier = newVerifier;
    }
    
   //  function getContractBalance() external view returns (uint256) {
   //      return address(this).balance;
   //  }
    
    /**
     * @dev Emergency function to check if transfer has expired
     */
    function isBountyExpired(uint256 bountyId) 
        external 
        view 
        bountyExists(bountyId)
        returns (bool) 
    {
        return block.timestamp >= bounties[bountyId].expirationTime;
    }

}