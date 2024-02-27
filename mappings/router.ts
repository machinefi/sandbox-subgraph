import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Blockchain, Project } from "../generated/schema";
import { ReceiverRegistered, ReceiverUnregistered } from "../generated/W3bstreamRouter/W3bstreamRouter";

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
