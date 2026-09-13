"use client";

import { sidebarItems } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@/types";

export const NavItems = ({
    user,
    handleLogout,
}: {
    user: User;
    handleLogout: () => Promise<void>;
}) => {
    const pathname = usePathname();

    return (
        <section className="nav-items">
            <Link href="/" className="link-logo">
                <img
                    src="/assets/icons/logo.svg"
                    alt="logo"
                    className="size-7.5"
                />

                <h1>Tourvisto</h1>
            </Link>

            <div className="container">
                <nav>
                    {sidebarItems.map(({ id, href, icon, label }) => {
                        const isActive = pathname === href;

                        return (
                            <Link href={href} key={id}>
                                <div
                                    className={cn("group nav-item", {
                                        "bg-primary-100 text-white!": isActive,
                                    })}
                                >
                                    <img
                                        src={icon}
                                        alt={label}
                                        className={cn(
                                            "size-0 group-hover:brightness-0 group-hover:invert",
                                            {
                                                "brightness-0 invert": isActive,
                                                "text-dark-200": !isActive,
                                            },
                                        )}
                                    />

                                    {label}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <footer className="nav-footer">
                    <img
                        src={user.imageUrl || "/assets/icons/avatar.svg"}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                    />

                    <article>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                    </article>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="cursor-pointer"
                    >
                        <img
                            src="/assets/icons/logout.svg"
                            alt="logout"
                            className="size-6"
                        />
                    </button>
                </footer>
            </div>
        </section>
    );
};
