import { MongoClient, type Db } from "mongodb"

// MongoDB connection URI from environment variables
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/school-cms"
const options = {
  // Connection options for better performance and reliability
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// In development mode, use a global variable to preserve the connection across module reloads
if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, create a new connection
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Helper function to get database instance
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("school-cms")
}

export default clientPromise
