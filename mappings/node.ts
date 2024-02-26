import { BigInt } from "@graphprotocol/graph-ts";
import { Blockchain, Node } from "../generated/schema";
import { NodeRegistered, NodeUpdated, Transfer } from "../generated/NodeRegistry/NodeRegistry";

export function handleNodeRegister(event: NodeRegistered) {
  let blockchain = Blockchain.load("IoTeX");
  if (blockchain === null) {
    blockchain = new Blockchain("IoTeX");
    blockchain.totalNode = BigInt.zero();
    blockchain.totalReceiver = BigInt.zero();
    blockchain.save();
  }
  blockchain.totalNode = blockchain.totalNode.plus(BigInt.fromI32(1));
  blockchain.save();
  
  let node = Node.load(event.params.nodeId.toString());
  if (node === null) {
    node = new Node(event.params.nodeId.toString());
    node.owner = event.params.owner;
    node.operator = event.params.operator;
    node.createdAt = event.block.timestamp;
    node.updatedAt = event.block.timestamp;
    node.save();
  }
}

export function handleNodeUpdate(event: NodeUpdated) {
  let node = Node.load(event.params.nodeId.toString());
  if (node !== null) {
    node.operator = event.params.operator;
    node.updatedAt = event.block.timestamp;
    node.save();
  }
}

export function handleNodeTransfer(event: Transfer) {
  let node = Node.load(event.params.tokenId.toString());
  if (node !== null) {
    node.owner = event.params.to;
    node.updatedAt = event.block.timestamp;
    node.save();
  }
}
