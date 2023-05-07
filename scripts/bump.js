// @ts-ignore
import fs from "node:fs";
// @ts-ignore
import packageJson from "../package.json" assert { type: "json" };

/**
 * @typedef {"major" | "minor" | "patch" | "premajor" | "preminor" | "prepatch" | "prerelease"} Bump
 * @typedef {{ major: number, minor: number, patch: number, preId: string | undefined, preNum: number | undefined }} Version
 */

/**
 * @returns {Version}
 */
function getCurrentVersion() {
  const version = packageJson.version;
  const [major, minor, rest] = version.split(".");
  const [patch, pre] = rest.split("-");
  const [preId, preNum] = pre ? pre.split(".") : [undefined, undefined];
  return {
    major: parseInt(major),
    minor: parseInt(minor),
    patch: parseInt(patch),
    preId,
    preNum: preNum ? parseInt(preNum) : undefined,
  };
}

/**
 * @param {Version} current
 * @param {Bump} bump
 */
function getVersionForBumpType(current, bump) {
  switch (bump) {
    case "major":
      return {
        major: current.major + 1,
        minor: 0,
        patch: 0,
        preId: undefined,
        preNum: undefined,
      };
    case "minor":
      return {
        major: current.major,
        minor: current.minor + 1,
        patch: 0,
        preId: undefined,
        preNum: undefined,
      };
    case "patch":
      return {
        major: current.major,
        minor: current.minor,
        patch: current.patch + 1,
        preId: undefined,
        preNum: undefined,
      };
    case "premajor":
      return {
        major: current.major + 1,
        minor: 0,
        patch: 0,
        preId: "alpha",
        preNum: 0,
      };
    case "preminor":
      return {
        major: current.major,
        minor: current.minor + 1,
        patch: 0,
        preId: "alpha",
        preNum: 0,
      };
    case "prepatch":
      return {
        major: current.major,
        minor: current.minor,
        patch: current.patch + 1,
        preId: "alpha",
        preNum: 0,
      };
    case "prerelease":
      if (!current.preId || !current.preNum)
        throw new Error(
          `Cannot bump prerelease version when current version is not prerelease. Please use "premajor", "preminor", or "prepatch" to initialize a prerelease, then use "prerelease" to bump the prerelease version in future.`,
        );
      return {
        major: current.major,
        minor: current.minor,
        patch: current.patch,
        preId: "alpha",
        preNum: current.preNum + 1,
      };
    default:
      throw new Error(
        `Invalid bump type: ${bump}. Valid bump types are "major", "minor", "patch", "premajor", "preminor", "prepatch", and "prerelease".`,
      );
  }
}

/**
 * @param {Version} version
 * @returns {string}
 */
function versionToString(version) {
  return `${version.major}.${version.minor}.${version.patch}${
    version.preId ? `-${version.preId}.${version.preNum ?? 0}` : ""
  }`;
}

/**
 *
 * @param {string} file
 * @returns {string}
 */
function pathOf(file) {
  // @ts-expect-error
  return new URL(file, import.meta.url).pathname;
}

/**
 * @param {string} version
 */
function writeToVersionFiles(version) {
  // package.json - version
  const packageJsonPath = pathOf("../package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  packageJson.version = version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // tauri.conf.json - package.version
  const tauriConfJsonPath = pathOf("../tauri.conf.json");
  const tauriConfJson = JSON.parse(fs.readFileSync(tauriConfJsonPath, "utf8"));
  tauriConfJson.package.version = version;
  fs.writeFileSync(tauriConfJsonPath, JSON.stringify(tauriConfJson, null, 2));

  // Cargo.toml - package.version (use raw replace instead of parsing toml)
  const cargoTomlPath = pathOf("../Cargo.toml");
  const cargoToml = fs.readFileSync(cargoTomlPath, "utf8");
  const newCargoToml = cargoToml.replace(/\nversion = ".*"\n/, `\nversion = "${version}"\n`);
  fs.writeFileSync(cargoTomlPath, newCargoToml);
}
function main() {
  if (/\d+\.\d+\.\d+(-.+\.\d+)?/.test(process.argv[2])) {
    console.log(`Forcing version to ${process.argv[2]}... (press Ctrl+C to cancel)`);
    setTimeout(() => {
      writeToVersionFiles(process.argv[2]);
      console.log(`Forced version to ${process.argv[2]}`);
    }, 3000);
  } else {
    const current = getCurrentVersion();
    const next = getVersionForBumpType(current, process.argv[2]);
    const nextVersionString = versionToString(next);
    writeToVersionFiles(nextVersionString);
    console.log(`Bumped version from ${versionToString(current)} to ${versionToString(next)}`);
  }
}

setTimeout(() => {
  console.clear();
  try {
    main();
  } catch (e) {
    // @ts-ignore
    console.error(e.message);
  }
}, 0);
