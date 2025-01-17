import { ComponentTree } from "@/store/display-slice";

export function recurseTree(
  node: ComponentTree,
  path: number[],
): ComponentTree[] {
  console.log(path, node);
  const accumulatedNodes = node.type !== "root" ? [node] : [];

  if (node.components) {
    for (let i = 0; i < node.components.length; i++) {
      const component = node.components[i];
      accumulatedNodes.push(
        ...recurseTree(component as ComponentTree, [...path, i]),
      );
    }
  }
  console.log(accumulatedNodes);
  return accumulatedNodes;
}
