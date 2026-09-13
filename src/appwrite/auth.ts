"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from ".";
import { appwriteConfig } from "./config";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/constants";
import type { User } from "@/types";

// Strips class instances / non-plain prototypes so data can safely
// cross the Server -> Client Component boundary.
const parseStringify = <T>(value: T): T => JSON.parse(JSON.stringify(value));

export const getExistingUser = async (id: string) => {
    const { databases } = await createAdminClient();

    try {
        const { rows, total } = await databases.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            queries: [Query.equal("accountId", id)],
        });
        return total > 0 ? parseStringify(rows[0]) : null;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

export const storeUserData = async () => {
    try {
        const { account } = await createSessionClient();
        const { databases } = await createAdminClient();

        const user = await account.get();

        const { providerAccessToken } = await account.getSession({
            sessionId: "current",
        });

        const profilePicture = providerAccessToken
            ? await getGooglePicture(providerAccessToken)
            : null;

        await databases.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            rowId: ID.unique(),
            data: {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: profilePicture,
                dateJoined: new Date().toISOString(),
                status: "user",
            },
        });
    } catch (error) {
        console.error("Error storing user data:", error);
    }
};

const getGooglePicture = async (accessToken: string) => {
    try {
        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error(
                `Google profile request failed: ${response.status}`,
            );
        }

        const data = await response.json();

        return data.photos?.[0]?.url ?? null;
    } catch (error) {
        console.error("Error fetching Google picture:", error);

        return null;
    }
};

export const logoutUser = async () => {
    try {
        const { account } = await createSessionClient();

        await account.deleteSession({
            sessionId: "current",
        });

        const cookieStore = await cookies();

        cookieStore.delete(SESSION_COOKIE);

        redirect("/sign-in");
    } catch (error) {
        console.error("Error during logout:", error);

        redirect("/sign-in");
    }
};

const mapUser = (row: any): User => ({
    $id: row.$id,
    accountId: row.accountId,
    name: row.name,
    email: row.email,
    imageUrl: row.imageUrl ?? null,
    dateJoined: row.dateJoined,
    status: row.status ?? "user",
});

export const getUser = async (): Promise<User> => {
    try {
        const { account } = await createSessionClient();
        const user = await account.get();

        const { databases } = await createAdminClient();

        const { rows } = await databases.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            queries: [Query.equal("accountId", user.$id)],
        });

        if (rows.length > 0) {
            return mapUser(rows[0]);
        }

        const session = await account.getSession({
            sessionId: "current",
        });

        let imageUrl: string | null = null;

        if (session.providerAccessToken) {
            imageUrl = await getGooglePicture(session.providerAccessToken);
        }

        const newUser = await databases.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            rowId: ID.unique(),
            data: {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl,
                dateJoined: new Date().toISOString(),
                status: "user",
            },
        });

        return mapUser(newUser);
    } catch (error) {
        console.error("Error fetching user:", error);
        redirect("/sign-in");
    }
};

export const getAllUsers = async (limit: number, offset: number) => {
    const { databases } = await createAdminClient();

    try {
        const { rows: users, total } = await databases.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            queries: [Query.limit(limit), Query.offset(offset)],
        });

        if (total === 0) return { users: [], total };

        return { users: parseStringify(users), total };
    } catch (e) {
        console.log("Error fetching users");
        return { users: [], total: 0 };
    }
};
