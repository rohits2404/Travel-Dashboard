import { createAdminClient } from "@/appwrite";
import { SESSION_COOKIE } from "@/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);

        const userId = url.searchParams.get("userId");
        const secret = url.searchParams.get("secret");

        if (!userId || !secret) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        const { account } = await createAdminClient();

        // Exchange OAuth userId + secret for an Appwrite session
        const session = await account.createSession({
            userId,
            secret,
        });

        const cookieStore = await cookies();

        cookieStore.set(SESSION_COOKIE, session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            expires: new Date(session.expire),
        });

        return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
        console.error("OAuth callback error:", error);

        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
}
