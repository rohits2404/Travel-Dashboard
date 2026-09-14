import { redirect } from "next/navigation";

import { getUser } from "@/appwrite/auth";
import { RootNavbar } from "@/components/root/Navbar";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    try {
        const user = await getUser();

        if (!user) {
            redirect("/sign-in");
        }

        return (
            <div className="bg-light-200">
                <RootNavbar user={user} />
                {children}
            </div>
        );
    } catch (error) {
        console.error("Error fetching user:", error);

        redirect("/sign-in");
    }
}
