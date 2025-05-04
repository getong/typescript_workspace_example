import "reflect-metadata";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { UserController } from "./controllers/UserController";

// Load environment variables
dotenv.config();

async function runDemo() {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const userController = new UserController();

    // Create a new user
    console.log("Creating a new user...");
    const newUser = await userController.createUser({
      firstName: "John",
      lastName: "Doe",
      age: 30,
    });
    console.log("Created user:", newUser);

    // Get all users
    console.log("\nGetting all users...");
    const allUsers = await userController.getAllUsers();
    console.log("All users:", allUsers);

    // Update the user
    console.log("\nUpdating user...");
    const updatedUser = await userController.updateUser(newUser.id, {
      firstName: "Jane",
      age: 28,
    });
    console.log("Updated user:", updatedUser);

    // Get user by ID
    console.log("\nGetting user by ID...");
    const user = await userController.getUserById(newUser.id);
    console.log("User by ID:", user);

    // Delete the user
    console.log("\nDeleting user...");
    const deleted = await userController.deleteUser(newUser.id);
    console.log("User deleted:", deleted);

    // Verify deletion
    console.log("\nVerifying deletion...");
    const remainingUsers = await userController.getAllUsers();
    console.log("Remaining users:", remainingUsers);
  } catch (error) {
    console.error("Error during demo:", error);
  } finally {
    // Close connection when done
    await AppDataSource.destroy();
    console.log("Connection closed");
  }
}

// Run the demo
runDemo();
