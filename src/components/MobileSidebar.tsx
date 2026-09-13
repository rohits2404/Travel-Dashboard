"use client";

import Link from "next/link";
import { useRef } from "react";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { NavItems } from "./NavItems";
import type { User } from "@/types";

export const MobileSidebar = ({ user }: { user: User }) => {
    const sidebarRef = useRef<SidebarComponent | null>(null);

    const toggleSidebar = () => {
        sidebarRef.current?.toggle();
    };

    return (
        <div className="mobile-sidebar wrapper">
            <header>
                <Link href="/">
                    <img
                        src="/assets/icons/logo.svg"
                        alt="Logo"
                        className="size-7.5"
                    />

                    <h1>Tourvisto</h1>
                </Link>

                <button onClick={toggleSidebar}>
                    <img
                        src="/assets/icons/menu.svg"
                        alt="menu"
                        className="size-7"
                    />
                </button>
            </header>

            <SidebarComponent
                ref={sidebarRef}
                width="270px"
                created={() => sidebarRef.current?.hide()}
                closeOnDocumentClick={true}
                showBackdrop={true}
                type="Over"
            >
                <NavItems user={user} handleClick={toggleSidebar} />
            </SidebarComponent>
        </div>
    );
};
