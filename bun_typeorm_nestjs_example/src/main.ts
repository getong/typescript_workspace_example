import "reflect-metadata";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";

// Load environment variables
dotenv.config();

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
