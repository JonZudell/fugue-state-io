class TreeNode {
  val: number;
  direction: "vertical" | "horizontal";
  children: TreeNode[];

  constructor(val: number, direction: "vertical" | "horizontal") {
    this.val = val;
    this.direction = direction;
    this.children = [];
  }
}

function catalanNumber(n: number): number {
  if (n <= 1) return 1;

  const catalan = Array(n + 1).fill(0);
  catalan[0] = 1;
  catalan[1] = 1;

  for (let i = 2; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      catalan[i] += catalan[j] * catalan[i - j - 1];
    }
  }

  return catalan[n];
}

function getNthCatalanTree(n: number, index: number): TreeNode | null {
  if (n === 0) return null;
  if (index >= catalanNumber(n)) throw new Error("Index out of bounds");

  const directions: ("vertical" | "horizontal")[] = ["vertical", "horizontal"];
  return buildTree(1, n, index, directions);
}

function buildTree(start: number, end: number, index: number, directions: ("vertical" | "horizontal")[]): TreeNode | null {
  if (start > end) return null;

  let count = 0;
  for (let i = start; i <= end; i++) {
    const leftCount = catalanNumber(i - start);
    const rightCount = catalanNumber(end - i);

    for (const direction of directions) {
      const totalCount = leftCount * rightCount;
      if (index < count + totalCount) {
        const leftIndex = Math.floor(index / rightCount);
        const rightIndex = index % rightCount;

        const root = new TreeNode(i, direction);
        const leftChild = buildTree(start, i - 1, leftIndex, directions);
        if (leftChild) {root.children.push(leftChild)};

        const rightChild = buildTree(i + 1, end, rightIndex, directions);
        if (rightChild) {root.children.push(rightChild)};
        return root;
      }
      count += totalCount;
    }
  }

  return null;
}

// Example usage:
const n = 3;
const index = 2;
const nthTree = getNthCatalanTree(n, index);
console.log(`The ${index + 1}-th Catalan tree for n = ${n} is`, nthTree);