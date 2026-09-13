"use client";

import {
    ColumnDirective,
    ColumnsDirective,
    GridComponent,
} from "@syncfusion/ej2-react-grids";
import type { User } from "@/types";
import { cn, formatDate } from "@/lib/utils";

interface AllUsersTableProps {
    users: User[];
}

const AllUsersTable = ({ users }: AllUsersTableProps) => {
    return (
        <GridComponent dataSource={users} gridLines="None">
            <ColumnsDirective>
                <ColumnDirective
                    field="name"
                    headerText="Name"
                    width="200"
                    textAlign="Left"
                    template={(props: User) => (
                        <div className="flex items-center gap-1.5 px-4">
                            <img
                                src={props.imageUrl ?? ""}
                                alt="user"
                                className="rounded-full size-8 aspect-square"
                                referrerPolicy="no-referrer"
                            />
                            <span>{props.name}</span>
                        </div>
                    )}
                />

                <ColumnDirective
                    field="email"
                    headerText="Email Address"
                    width="200"
                    textAlign="Left"
                />

                <ColumnDirective
                    field="dateJoined"
                    headerText="Date Joined"
                    width="140"
                    textAlign="Left"
                    template={({ dateJoined }: User) => formatDate(dateJoined)}
                />

                <ColumnDirective
                    field="status"
                    headerText="Type"
                    width="100"
                    textAlign="Left"
                    template={({ status }: User) => (
                        <article
                            className={cn(
                                "status-column",
                                status === "user"
                                    ? "bg-success-50"
                                    : "bg-light-300",
                            )}
                        >
                            <div
                                className={cn(
                                    "size-1.5 rounded-full",
                                    status === "user"
                                        ? "bg-success-500"
                                        : "bg-gray-500",
                                )}
                            />

                            <h3
                                className={cn(
                                    "font-inter text-xs font-medium",
                                    status === "user"
                                        ? "text-success-700"
                                        : "text-gray-500",
                                )}
                            >
                                {status}
                            </h3>
                        </article>
                    )}
                />
            </ColumnsDirective>
        </GridComponent>
    );
};

export default AllUsersTable;
