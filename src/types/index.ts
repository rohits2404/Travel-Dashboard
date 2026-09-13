export interface User {
    $id: string;
    accountId: string;
    name: string;
    email: string;
    imageUrl: string | null;
    dateJoined: string;
    status: "admin" | "user";
}
