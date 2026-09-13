"use client";

import { NavItems } from "@/components/NavItems";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";

export const AdminSidebar = () => {
    return (
        <aside className="w-full max-w-67.5 hidden lg:block">
            <SidebarComponent width={270} enableGestures={false}>
                <NavItems />
            </SidebarComponent>
        </aside>
    );
};
