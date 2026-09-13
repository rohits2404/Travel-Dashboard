"use server";

import { logoutUser } from "@/appwrite/auth";
import { redirect } from "next/navigation";

export async function handleLogout() {
    await logoutUser();
    redirect("/sign-in");
}
