const fs = require("fs");
const path = require("path");

function parseFilterFile(content) {
  const result = new Map();
  const blocks = content.split("\n\n");

  blocks.forEach((block) => {
    const lines = block.split("\n");
    if (lines[0].startsWith("Show #")) {
      const key = lines[0].trim();
      const properties = {};

      lines.slice(1).forEach((line) => {
        const [prop, ...values] = line.trim().split(/\s+/);
        if (prop && values.length > 0) {
          properties[prop] = values.join(" ");
        }
      });

      result.set(key, properties);
    }
  });

  return result;
}

const content = fs.readFileSync(
  path.join(__dirname, "../backup/POE2 EA Filter-1_1_Regular.filter"),
  "utf8"
);
const parsed = parseFilterFile(content);
console.log(parsed);
