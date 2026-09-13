export const appwriteConfig = {
    endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
    apiKey: process.env.APPWRITE_API_KEY!,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
    tripCollectionId: process.env.NEXT_PUBLIC_APPWRITE_TRIPS_COLLECTION_ID!,
};
