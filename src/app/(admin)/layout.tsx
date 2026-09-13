import { AdminSidebar } from "@/components/admin/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="admin-layout">
            <MobileSidebar />
            <AdminSidebar />
            <aside className="children">{children}</aside>
        </div>
    );
};

export default AdminLayout;
