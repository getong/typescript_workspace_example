import { config } from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");
const legacyLibp2pEnv = path.resolve(projectRoot, ".", ".", ".env");

const candidateEnvFiles = [
  process.env.NEST_LIBP2P_ENV_FILE,
  path.resolve(projectRoot, ".env"),
  legacyLibp2pEnv,
].filter((value, index, array): value is string => {
  if (value == null || value.length === 0) {
    return false;
  }

  return array.indexOf(value) === index;
});

let loaded = false;
for (const candidate of candidateEnvFiles) {
  if (existsSync(candidate)) {
    config({ path: candidate, override: false });
    loaded = true;
    break;
  }
}

if (!loaded) {
  config();
}
