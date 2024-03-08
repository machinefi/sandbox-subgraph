import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Blockchain, Project, RouterData } from "../generated/schema";
import { DataReceived, ReceiverRegistered, ReceiverUnregistered } from "../generated/W3bstreamRouter/W3bstreamRouter";

export function handleReceiverRegister(event: ReceiverRegistered): void {
  let blockchain = Blockchain.load("IoTeX");
  if (blockchain !== null) {
    blockchain.totalReceiver = blockchain.totalReceiver.plus(BigInt.fromI32(1));
    blockchain.save();
  }

  let project = Project.load(event.params.projectId.toString());
  if (project !== null) {
    project.receiver = event.params.receiver;
    project.updatedAt = event.block.timestamp;
    project.save();
  }
}

export function handleReceiverUnregister(event: ReceiverUnregistered): void {
  let project = Project.load(event.params.projectId.toString());
  if (project !== null) {
    project.receiver = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
    project.updatedAt = event.block.timestamp;
    project.save();
  }
}

export function handleDataReceive(event: DataReceived): void {
  const data = new RouterData(event.transaction.hash.toString());
  data.success = event.params.success;
  data.operator = event.params.operator;
  data.input = event.transaction.input;
  data.reason = event.params.revertReason;
  data.createdAt = event.block.timestamp;
  data.save();
}
