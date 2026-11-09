const fs = require("fs");
const data = JSON.parse(fs.readFileSync("figma_data.json", "utf8"));
function findNode(root, id) {
  if (root.id === id) return root;
  if (root.children) {
    for (const c of root.children) {
      const f = findNode(c, id);
      if (f) return f;
    }
  }
  return null;
}
const hero = findNode(data.document, "27:28747");

function dumpSummary(n, depth=0) {
  const pad = "  ".repeat(depth);
  let extra = "";
  if (n.characters) extra += ` text="${n.characters.replace(/\n/g, " ")}"`;
  if (n.fills && n.fills.length) {
    const f = n.fills[0];
    if (f.color) extra += ` fill=#${[f.color.r, f.color.g, f.color.b].map(x=>Math.round(x*255).toString(16).padStart(2,"0")).join("")}`;
    if (f.type === "IMAGE") extra += ` fill=IMAGE(${f.imageRef})`;
  }
  if (n.style) extra += ` font=${n.style.fontFamily}/${n.style.fontSize}px/${n.style.fontWeight}`;
  console.log(`${pad}${n.name} (${n.type})${extra}`);
  if (depth < 5 && n.children) {
    for (const c of n.children) dumpSummary(c, depth+1);
  }
}
dumpSummary(hero);
