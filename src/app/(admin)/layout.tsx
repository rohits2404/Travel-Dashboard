import { AdminSidebar } from "@/components/admin/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import { getUser } from "@/appwrite/auth";
import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getUser();

    return (
        <div className="admin-layout">
            <MobileSidebar user={user} />
            <AdminSidebar />
            <aside className="children">{children}</aside>
        </div>
    );
};

export default AdminLayout;
