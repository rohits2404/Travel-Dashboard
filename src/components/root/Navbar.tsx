"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { logoutUser } from "@/appwrite/auth";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface RootNavbarProps {
    user: User;
}

export const RootNavbar = ({ user }: RootNavbarProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const isTravelPage = pathname.startsWith("/travel");

    const handleLogout = async () => {
        await logoutUser();
        router.push("/sign-in");
        router.refresh();
    };

    return (
        <nav
            className={cn(
                "top-0 left-0 z-50 w-full",
                isTravelPage ? "bg-white" : "glassmorphism",
            )}
        >
            <header className="root-nav wrapper">
                <Link href="/" className="link-logo">
                    <img
                        src="/assets/icons/logo.svg"
                        alt="Tourvisto"
                        className="size-7.5"
                    />

                    <h1>Tourvisto</h1>
                </Link>

                <aside>
                    {user.status === "admin" && (
                        <Link
                            href="/dashboard"
                            className={cn(
                                "text-base font-normal text-white",
                                isTravelPage && "text-dark-100",
                            )}
                        >
                            Admin Panel
                        </Link>
                    )}

                    <img
                        src={user.imageUrl || "/assets/images/david.webp"}
                        alt={user.name || "User"}
                        referrerPolicy="no-referrer"
                    />

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="cursor-pointer"
                        aria-label="Logout"
                    >
                        <img
                            src="/assets/icons/logout.svg"
                            alt=""
                            className="size-6 rotate-180"
                        />
                    </button>
                </aside>
            </header>
        </nav>
    );
};
