export interface User {
    $id: string;
    accountId: string;
    name: string;
    email: string;
    imageUrl: string | null;
    dateJoined: string;
    status: "admin" | "user";
}

export type Country = {
    name: string;
    coordinates: [number, number];
    value: string;
    openStreetMap?: string;
};

export type TripFormData = {
    country: string;
    travelStyle: string;
    interest: string;
    budget: string;
    duration: number;
    groupType: string;
};

export type CreateTripResponse = {
    id?: string;
};
