const fs = require("fs");
const path = require("path");

function parseFilterFile(content) {
  const result = new Map();
  const blocks = content.split("\n");

  for (let i = 0; i < blocks.length; i++) {
    const line = blocks[i];
    if (["Show #", "Hide #"].some((o) => line.startsWith(o))) {
      const map = new Map();
      let attributeIndex = i + 1;
      let nextLine = blocks[attributeIndex];
      while (nextLine?.length >= 2) {
        const [prop, ...values] = nextLine.trim().split(/\s+/);
        map.set(prop, values);
        nextLine = blocks[attributeIndex++];
      }
      i = attributeIndex - 1;
      result.set(line, map);
    }
  }
  return result;
}

function genFilterFile(map) {
  let result = "";

  for (let [key, value] of map) {
    result += key + "\n";
    for (let [childKey, childValue] of value) {
      result += "  " + childKey + " " + childValue.join(" ") + "\n";
    }
    result += "\n\n";
  }

  return result;
}

function addCustomSound(mapFrom, mapTarget) {
  for (let [key, value] of mapFrom) {
    if (!key.startsWith("Show #")) {
      console.log(key);
      continue;
    }
    const target = mapTarget.get(key);
    if (target?.get("CustomAlertSound")) {
      value.set("CustomAlertSound", target?.get("CustomAlertSound"));
    }
  }
  return mapFrom;
}

const processObject = [
  {
    from: "new_0_Soft.filter",
    target: "POE2 EA Filter-1_0_Soft.filter",
  },
  {
    from: "new_1_Regular.filter",
    target: "POE2 EA Filter-1_1_Regular.filter",
  },
  {
    from: "new_2_Semi-Strict.filter",
    target: "POE2 EA Filter-1_2_Semi-Strict.filter",
  },
  {
    from: "new_3_Strict.filter",
    target: "POE2 EA Filter-1_3_Strict.filter",
  },
  {
    from: "new_4_Very Strict.filter",
    target: "POE2 EA Filter-1_4_Very Strict.filter",
  },
  {
    from: "new_5_Uber Strict.filter",
    target: "POE2 EA Filter-1_5_Uber Strict.filter",
  },
  {
    from: "new_6_Uber Plus Strict.filter",
    target: "POE2 EA Filter-1_6_Uber Plus Strict.filter",
  },
];

function main() {
  processObject.forEach(({ from, target }) => {
    const fromFile = fs.readFileSync(
      path.join(__dirname, "../source", from),
      "utf8"
    );
    const compareFile = fs.readFileSync(
      path.join(__dirname, "../backup", target),
      "utf8"
    );

    const fromMap = parseFilterFile(fromFile);
    const compareMap = parseFilterFile(compareFile);

    const targetMap = addCustomSound(fromMap, compareMap);

    const targetFile = genFilterFile(targetMap);
    fs.writeFileSync(path.join(__dirname, "../", from), targetFile, "utf-8");
  });
}

main();
