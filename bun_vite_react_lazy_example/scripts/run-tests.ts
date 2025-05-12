import { spawn } from "child_process";

// Execute vitest with happy-dom environment
async function runTests() {
  try {
    // Use spawn to run the vitest command
    const child = spawn("npx", ["vitest", "run", "--environment", "happy-dom"], {
      stdio: ["inherit", "pipe", "inherit"], // Inherit stdin and stderr, capture stdout
    });

    let output = "";
    
    // Collect output
    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    // Wait for process to complete
    await new Promise((resolve, reject) => {
      child.on("close", (code) => {
        if (code === 0) {
          console.error(output);
          resolve(null);
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });
      
      child.on("error", reject);
    });
  } catch (error: unknown) {
    console.error("Test execution failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

runTests();
