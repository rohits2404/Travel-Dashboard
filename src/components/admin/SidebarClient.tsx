"use client";

import { NavItems } from "@/components/NavItems";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import type { User } from "@/types";
import { handleLogout } from "@/app/actions/auth";

export const SidebarClient = ({ user }: { user: User }) => {
    return (
        <aside className="w-full max-w-67.5 hidden lg:block">
            <SidebarComponent width="270px" enableGestures={false}>
                <NavItems user={user} handleLogout={handleLogout} />
            </SidebarComponent>
        </aside>
    );
};
