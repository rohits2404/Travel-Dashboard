"use server";

import { Account, Client, TablesDB, Storage } from "node-appwrite";
import { cookies } from "next/headers";
import { appwriteConfig } from "./config";
import { SESSION_COOKIE } from "@/constants";

export const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId)
        .setKey(appwriteConfig.apiKey);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new TablesDB(client);
        },
        get storage() {
            return new Storage(client);
        },
    };
};

export const createSessionClient = async () => {
    const cookieStore = await cookies();

    const session = cookieStore.get(SESSION_COOKIE);

    if (!session?.value) {
        throw new Error("No active session");
    }

    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId)
        .setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new TablesDB(client);
        },
        get storage() {
            return new Storage(client);
        },
    };
};
