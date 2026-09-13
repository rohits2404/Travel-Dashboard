import React from "react";
import { handleLogout } from "./actions/auth";

const Home = () => {
    return (
        <div>
            Home
            <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer"
            >
                <img
                    src="/assets/icons/logout.svg"
                    alt="logout"
                    className="size-6"
                />
            </button>
        </div>
    );
};

export default Home;
