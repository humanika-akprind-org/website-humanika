import { MongoClient, MongoClientOptions } from "mongodb";

// Type for our global mongo client promise in development
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Validate and get MongoDB URI from environment variables
 */
const getMongoUri = (): string => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }
  return uri;
};

/**
 * MongoDB connection options
 */
const getMongoOptions = (): MongoClientOptions => ({
  // Add your MongoDB connection options here
  // For example:
  // connectTimeoutMS: 5000,
  // socketTimeoutMS: 30000,
  // maxPoolSize: 50,
});

/**
 * Create and cache MongoDB client promise
 */
const createMongoClientPromise = (): Promise<MongoClient> => {
  const uri = getMongoUri();
  const options = getMongoOptions();
  const client = new MongoClient(uri, options);

  return client.connect();
};

/**
 * Get cached or new MongoDB client promise
 */
const getMongoClientPromise = (): Promise<MongoClient> => {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable to preserve connection
    // across module reloads caused by HMR (Hot Module Replacement)
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createMongoClientPromise();
    }
    return global._mongoClientPromise;
  }

  // In production mode, create a new connection
  return createMongoClientPromise();
};

// Export the MongoDB client promise
const clientPromise = getMongoClientPromise();
export default clientPromise;
