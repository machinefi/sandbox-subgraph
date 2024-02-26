import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Blockchain, Project } from "../generated/schema";
import { ProjectUpserted } from "../generated/ProjectRegistrar/ProjectRegistrar";

export function handleProjectRegister(event: ProjectUpserted): void {
  let blockchain = Blockchain.load("IoTeX");
  if (blockchain === null) {
    blockchain = new Blockchain("IoTeX");
    blockchain.totalNode = BigInt.zero();
    blockchain.totalProject = BigInt.zero();
    blockchain.totalReceiver = BigInt.zero();
    blockchain.save();
  }
  blockchain.totalProject = blockchain.totalProject.plus(BigInt.fromI32(1));
  blockchain.save();

  let project = Project.load(event.params.projectId.toString());
  if (project === null) {
    project = new Project(event.params.projectId.toString());
    project.paused = false;
    project.receiver = Bytes.fromHexString('0x0000000000000000000000000000000000000000');
    project.hash = event.params.hash;
    project.uri = event.params.uri;
    project.createdAt = event.block.timestamp;
    project.updatedAt = event.block.timestamp;
    project.save();
  }
}
