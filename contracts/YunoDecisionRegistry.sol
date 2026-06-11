// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title YunoDecisionRegistry
/// @notice Minimal Mantle registry for auditable AI agent decisions.
contract YunoDecisionRegistry {
    struct Decision {
        address operator;
        bytes32 thesisHash;
        bytes32 actionHash;
        uint16 confidenceBps;
        int32 expectedRoiBps;
        uint32 maxDrawdownBps;
        uint256 timestamp;
        string metadataURI;
    }

    event DecisionRecorded(
        uint256 indexed decisionId,
        address indexed operator,
        bytes32 thesisHash,
        bytes32 actionHash,
        uint16 confidenceBps,
        int32 expectedRoiBps,
        uint32 maxDrawdownBps,
        string metadataURI
    );

    Decision[] private decisions;

    function recordDecision(
        bytes32 thesisHash,
        bytes32 actionHash,
        uint16 confidenceBps,
        int32 expectedRoiBps,
        uint32 maxDrawdownBps,
        string calldata metadataURI
    ) external returns (uint256 decisionId) {
        require(confidenceBps <= 10_000, "confidence too high");

        decisionId = decisions.length;
        decisions.push(
            Decision({
                operator: msg.sender,
                thesisHash: thesisHash,
                actionHash: actionHash,
                confidenceBps: confidenceBps,
                expectedRoiBps: expectedRoiBps,
                maxDrawdownBps: maxDrawdownBps,
                timestamp: block.timestamp,
                metadataURI: metadataURI
            })
        );

        emit DecisionRecorded(
            decisionId,
            msg.sender,
            thesisHash,
            actionHash,
            confidenceBps,
            expectedRoiBps,
            maxDrawdownBps,
            metadataURI
        );
    }

    function getDecision(uint256 decisionId) external view returns (Decision memory) {
        require(decisionId < decisions.length, "missing decision");
        return decisions[decisionId];
    }

    function decisionCount() external view returns (uint256) {
        return decisions.length;
    }
}
