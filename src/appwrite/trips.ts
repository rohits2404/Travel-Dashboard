"use server";

import { Query } from "node-appwrite";
import { createAdminClient } from ".";
import { appwriteConfig } from "./config";

export const getAllTrips = async (limit: number, offset: number) => {
    const { databases } = await createAdminClient();

    try {
        const allTrips = await databases.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.tripCollectionId,
            queries: [
                Query.limit(limit),
                Query.offset(offset),
                Query.orderDesc("$createdAt"),
            ],
        });

        return {
            allTrips: allTrips.rows,
            total: allTrips.total,
        };
    } catch (error) {
        console.error("Failed to fetch trips:", error);

        return {
            allTrips: [],
            total: 0,
        };
    }
};

export const getTripById = async (tripId: string) => {
    const { databases } = await createAdminClient();

    try {
        const trip = await databases.getRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.tripCollectionId,
            rowId: tripId,
        });

        return trip;
    } catch (error) {
        console.error("Trip not found:", error);
        return null;
    }
};
