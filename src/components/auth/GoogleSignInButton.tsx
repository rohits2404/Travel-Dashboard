"use client";

import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { signInWithGoogle } from "@/appwrite/oauth";

export const GoogleSignInButton = () => {
    return (
        <form action={signInWithGoogle}>
            <ButtonComponent
                type="submit"
                className="button-class h-11! w-full!"
            >
                <img
                    src="/assets/icons/google.svg"
                    className="size-5"
                    alt="google"
                />

                <span className="p-18-semibold text-white">
                    Sign In With Google
                </span>
            </ButtonComponent>
        </form>
    );
};
