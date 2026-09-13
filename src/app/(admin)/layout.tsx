import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="admin-layout">
            MobileSidebar
            <aside className="w-full max-w-67.5 hidden lg:block">Sidebar</aside>
            <aside className="children">{children}</aside>
        </div>
    );
};

export default AdminLayout;
