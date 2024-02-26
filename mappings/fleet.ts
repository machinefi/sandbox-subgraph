import { NodeAllowed, NodeDisallowed } from "../generated/FleetManager/FleetManager";
import { ProjectNode } from "../generated/schema";

export function handleNodeAllow(event: NodeAllowed): void {
  const id = event.params.projectId.toString() + "-" + event.params.nodeId.toString();
  let pn = ProjectNode.load(id);

  if (pn === null) {
    pn = new ProjectNode(id);
    pn.project = event.params.projectId.toString();
    pn.node = event.params.nodeId.toString();
    pn.binded = true;
    pn.save();
  }
}

export function handleNodeDisallow(event: NodeDisallowed): void {
  const id = event.params.projectId.toString() + "-" + event.params.nodeId.toString();
  let pn = ProjectNode.load(id);

  if (pn !== null) {
    pn.binded = false;
    pn.save();
  }
}
