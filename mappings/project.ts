import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Blockchain, Project } from "../generated/schema";
import {
  ProjectPaused,
  ProjectUnpaused,
  ProjectUpserted,
  Transfer,
} from "../generated/ProjectRegistrar/ProjectRegistrar";

export function handleProjectUpsert(event: ProjectUpserted): void {
  let blockchain = Blockchain.load("IoTeX");
  if (blockchain === null) {
    blockchain = new Blockchain("IoTeX");
    blockchain.totalNode = BigInt.zero();
    blockchain.totalProject = BigInt.zero();
    blockchain.totalReceiver = BigInt.zero();
    blockchain.save();
  }

  let project = Project.load(event.params.projectId.toString());

  if (project === null) {
    project = new Project(event.params.projectId.toString());
    project.paused = false;
    project.owner = event.transaction.from;
    project.receiver = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
    project.hash = event.params.hash;
    project.uri = event.params.uri;
    project.createdAt = event.block.timestamp;
    project.updatedAt = event.block.timestamp;
    project.save();

    blockchain.totalProject = blockchain.totalProject.plus(BigInt.fromI32(1));
    blockchain.save();
  } else {
    project.hash = event.params.hash;
    project.uri = event.params.uri;
    project.updatedAt = event.block.timestamp;
    project.save();
  }
}

export function handleProjectTransfer(event: Transfer): void {
  let project = Project.load(event.params.tokenId.toString());
  if (project !== null) {
    project.owner = event.params.to;
    project.updatedAt = event.block.timestamp;
    project.save();
  }
}

export function handleProjectPause(event: ProjectPaused): void {
  let project = Project.load(event.params.projectId.toString());
  if (project !== null) {
    project.paused = true;
    project.updatedAt = event.block.timestamp;
    project.save();
  }
}

export function handleProjectUnpause(event: ProjectUnpaused): void {
  let project = Project.load(event.params.projectId.toString());
  if (project !== null) {
    project.paused = false;
    project.updatedAt = event.block.timestamp;
    project.save();
  }
}
