import { getUser } from "@/appwrite/auth";
import { SidebarClient } from "./SidebarClient";

export const AdminSidebar = async () => {
    const user = await getUser();

    return <SidebarClient user={user} />;
};
