"use server";

import { OAuthProvider } from "node-appwrite";
import { createAdminClient } from ".";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signInWithGoogle = async () => {
    const { account } = await createAdminClient();

    const headersList = await headers();
    const origin = headersList.get("origin");

    if (!origin) {
        throw new Error("Unable to determine application origin");
    }

    const redirectUrl = await account.createOAuth2Token({
        provider: OAuthProvider.Google,
        success: `${origin}/oauth`,
        failure: `${origin}/sign-in`,
    });

    redirect(redirectUrl);
};
