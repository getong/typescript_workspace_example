import { db } from "./db";
import { users, posts, NewUser, NewPost } from "./db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { initializeDatabase } from "./db/init";
import { runMigrations } from "./db/migrate";

console.log("Starting Bun with Drizzle ORM example");

const main = async () => {
  try {
    // Initialize database and create tables
    console.log("Setting up database...");
    await initializeDatabase();
    await runMigrations();
    console.log("Database setup complete!");

    // Insert a user
    const newUser: NewUser = {
      name: "John Doe",
      email: "john@example.com",
    };

    // Using prepared statements for better performance
    const insertedUsers = await db
      .insert(users)
      .values(newUser)
      .returning()
      .onConflictDoUpdate({
        target: users.email,
        set: { name: newUser.name },
      });

    console.log("Inserted/Updated user:", insertedUsers[0]);

    // Create a blog post for the user
    if (insertedUsers.length > 0) {
      const newPost: NewPost = {
        title: "Getting Started with Drizzle ORM",
        content:
          "Drizzle ORM is a lightweight and type-safe SQL ORM for TypeScript.",
        userId: insertedUsers[0].id,
      };

      const insertedPost = await db.insert(posts).values(newPost).returning();

      console.log("Created post:", insertedPost[0]);
    }

    // Perform a join query
    const usersWithPosts = await db
      .select({
        user: users,
        postsCount: sql<number>`count(${posts.id})`,
      })
      .from(users)
      .leftJoin(posts, eq(users.id, posts.userId))
      .groupBy(users.id)
      .orderBy(desc(sql<number>`count(${posts.id})`));

    console.log("Users with post counts:", usersWithPosts);

    // Query specific user with their posts
    const specificUser = await db
      .select()
      .from(users)
      .where(eq(users.email, "john@example.com"))
      .leftJoin(posts, eq(users.id, posts.userId));

    console.log("Found user with posts:", specificUser);
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    // Proper cleanup for the connection
    process.exit(0);
  }
};

main();
