// Load some additional build information to GraphQL
const { createHash } = require("crypto");
const { exec } = require("child_process");
const {
  promises: { access, readFile },
} = require("fs");
const { F_OK } = require("constants");
const { join } = require("path");

exports.sourceNodes = async ({ actions: { createNode } }, pluginOptions) => {
  // Get basic git information
  const gitInfo = (
    await new Promise((resolve, reject) =>
      exec('git log -1 --format="%H%n%at"', (err, stdout) => (err ? reject(err) : resolve(stdout)))
    )
  ).split("\n");

  // Get package.json and package-lock.json
  let project = pluginOptions && pluginOptions.path ? await getPackages(pluginOptions.path) : {};

  const version = (project.package || {}).version;

  const data = {
    version: version || false,
    gitCommit: gitInfo[0] || false,
    gitDate: gitInfo[1] || false
  };

  createNode(processNode(data));

  project = null;
  return;
};

function processNode(data) {
  return {
    id: "buildInformation",
    parent: null,
    children: [],
    internal: {
      type: "BuildInformation",
      contentDigest: createHash("md5")
        .update(JSON.stringify(data))
        .digest("hex"),
      description: "Contains additional Gatsby build information",
    },

    ...data,
  };
}

async function getPackages(rootPath) {
  const packagePath = join(rootPath, "package.json");
  try {
    await access(packagePath, F_OK);
    return {
      package: JSON.parse((await readFile(packagePath)).toString()),
    };
  } catch (err) {
    throw new Error("Failed to fetch package JSON: " + err.message)
  }
}
