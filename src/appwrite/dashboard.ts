"use server";

import { Query } from "node-appwrite";
import { appwriteConfig } from "./config";
import { parseTripData } from "@/lib/utils";
import { createAdminClient } from ".";

interface Document {
    [key: string]: any;
}

type FilterByDate = (
    items: Document[],
    key: string,
    start: string,
    end?: string,
) => number;

export const getUsersAndTripsStats = async (): Promise<DashboardStats> => {
    const { databases } = await createAdminClient();
    const now = new Date();

    const startCurrent = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
    ).toISOString();

    const startPrev = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
    ).toISOString();

    const endPrev = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
        999,
    ).toISOString();

    const [users, trips] = await Promise.all([
        databases.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            queries: [Query.limit(5000)],
        }),

        databases.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.tripCollectionId,
            queries: [Query.limit(5000)],
        }),
    ]);

    const filterByDate: FilterByDate = (items, key, start, end) => {
        return items.filter((item) => {
            const value = item[key];

            if (!value) {
                return false;
            }

            return value >= start && (!end || value <= end);
        }).length;
    };

    const filterUsersByRole = (role: string) => {
        return users.rows.filter((user: Document) => user.status === role);
    };

    const usersByRole = filterUsersByRole("user");

    return {
        totalUsers: users.total,

        usersJoined: {
            currentMonth: filterByDate(users.rows, "$createdAt", startCurrent),

            lastMonth: filterByDate(
                users.rows,
                "$createdAt",
                startPrev,
                endPrev,
            ),
        },

        userRole: {
            total: usersByRole.length,

            currentMonth: filterByDate(usersByRole, "$createdAt", startCurrent),

            lastMonth: filterByDate(
                usersByRole,
                "$createdAt",
                startPrev,
                endPrev,
            ),
        },

        totalTrips: trips.total,

        tripsCreated: {
            currentMonth: filterByDate(trips.rows, "$createdAt", startCurrent),

            lastMonth: filterByDate(
                trips.rows,
                "$createdAt",
                startPrev,
                endPrev,
            ),
        },
    };
};

export const getUserGrowthPerDay = async () => {
    const { databases } = await createAdminClient();
    const users = await databases.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.userCollectionId,
        queries: [Query.limit(5000)],
    });

    const userGrowth = users.rows.reduce(
        (acc: Record<string, number>, user: Document) => {
            const createdAt = user.$createdAt;

            if (!createdAt) {
                return acc;
            }

            const date = new Date(createdAt);

            const day = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });

            acc[day] = (acc[day] || 0) + 1;

            return acc;
        },
        {},
    );

    return Object.entries(userGrowth).map(([day, count]) => ({
        count,
        day,
    }));
};

export const getTripsCreatedPerDay = async () => {
    const { databases } = await createAdminClient();
    const trips = await databases.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.tripCollectionId,
        queries: [Query.limit(5000)],
    });

    const tripsGrowth = trips.rows.reduce(
        (acc: Record<string, number>, trip: Document) => {
            const createdAt = trip.$createdAt;

            if (!createdAt) {
                return acc;
            }

            const date = new Date(createdAt);

            const day = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });

            acc[day] = (acc[day] || 0) + 1;

            return acc;
        },
        {},
    );

    return Object.entries(tripsGrowth).map(([day, count]) => ({
        count,
        day,
    }));
};

export const getTripsByTravelStyle = async () => {
    const { databases } = await createAdminClient();
    const trips = await databases.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.tripCollectionId,
        queries: [Query.limit(5000)],
    });

    const travelStyleCounts = trips.rows.reduce(
        (acc: Record<string, number>, trip: Document) => {
            const tripDetail = parseTripData(trip.tripDetail);

            if (tripDetail && tripDetail.travelStyle) {
                const travelStyle = tripDetail.travelStyle;

                acc[travelStyle] = (acc[travelStyle] || 0) + 1;
            }

            return acc;
        },
        {},
    );

    return Object.entries(travelStyleCounts).map(([travelStyle, count]) => ({
        count,
        travelStyle,
    }));
};
