import { getAllUsers, getUser } from "@/appwrite/auth";
import {
    getTripsByTravelStyle,
    getUserGrowthPerDay,
    getUsersAndTripsStats,
} from "@/appwrite/dashboard";
import { getAllTrips } from "@/appwrite/trips";
import { Header } from "@/components/Header";
import { parseTripData } from "@/lib/utils";
import { DashboardClient } from "@/components/admin/DashboardClient";

const Dashboard = async () => {
    const [
        user,
        dashboardStats,
        trips,
        userGrowth,
        tripsByTravelStyle,
        allUsers,
    ] = await Promise.all([
        getUser(),
        getUsersAndTripsStats(),
        getAllTrips(4, 0),
        getUserGrowthPerDay(),
        getTripsByTravelStyle(),
        getAllUsers(4, 0),
    ]);

    const allTrips = trips.allTrips
        .map(({ $id, tripDetail, imageUrls }) => {
            const parsedTrip = parseTripData(tripDetail);

            if (!parsedTrip) {
                return null;
            }

            return {
                ...parsedTrip,
                id: $id,
                imageUrls: imageUrls ?? [],
            };
        })
        .filter((trip): trip is NonNullable<typeof trip> => trip !== null);

    const tripCounts = trips.allTrips.reduce<Record<string, number>>(
        (acc, trip) => {
            if (trip.userId) {
                acc[trip.userId] = (acc[trip.userId] ?? 0) + 1;
            }

            return acc;
        },
        {},
    );

    const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
        imageUrl: user.imageUrl ?? "",
        name: user.name,
        count: tripCounts[user.accountId] ?? 0,
    }));

    return (
        <main className="dashboard wrapper">
            <Header
                title={`Welcome ${user?.name ?? "Guest"} 👋`}
                description="Track activity, trends and popular destinations in real time"
            />

            <DashboardClient
                dashboardStats={dashboardStats}
                allTrips={allTrips}
                userGrowth={userGrowth}
                tripsByTravelStyle={tripsByTravelStyle}
                allUsers={mappedUsers}
            />
        </main>
    );
};

export default Dashboard;
