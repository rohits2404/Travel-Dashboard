import { getAllUsers } from "@/appwrite/auth";
import { Header } from "@/components/Header";
import AllUsersTable from "@/components/admin/AllUsersTable";

const AllUsers = async () => {
    const { users } = await getAllUsers(10, 0);

    return (
        <main className="all-users wrapper">
            <Header
                title="Manage Users"
                description="Filter, Sort, And Access Detailed User Profiles"
            />

            <AllUsersTable users={users} />
        </main>
    );
};

export default AllUsers;
