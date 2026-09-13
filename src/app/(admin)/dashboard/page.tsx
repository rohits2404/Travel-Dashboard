import { Header } from "@/components/Header";
import { user } from "@/constants";
import React from "react";

const Dashboard = () => {
    return (
        <main className="dashboard wrapper">
            <Header
                title={`Welcome ${user?.name ?? "Guest"} 👋`}
                description="Track Activity, Trends And Popular Destinations In Real Time"
            />
        </main>
    );
};

export default Dashboard;
