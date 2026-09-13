import { createSessionClient } from "@/appwrite";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import Link from "next/link";
import { redirect } from "next/navigation";

const SignIn = async () => {
    try {
        const { account } = await createSessionClient();

        const user = await account.get();

        if (user.$id) {
            redirect("/dashboard");
        }
    } catch {
        // No active session — user is not logged in.
    }

    return (
        <main className="auth">
            <section className="size-full glassmorphism flex-center px-6">
                <div className="sign-in-card">
                    <header className="header">
                        <Link href="/">
                            <img
                                src="/assets/icons/logo.svg"
                                alt="logo"
                                className="size-7.5"
                            />
                        </Link>

                        <h1 className="p-28-bold text-dark-100">Tourvisto</h1>
                    </header>

                    <article>
                        <h2 className="p-28-semibold text-dark-100 text-center">
                            Start Your Travel Journey
                        </h2>

                        <p className="p-18-regular text-center text-gray-100 leading-7!">
                            Sign In With Google To Manage Destinations,
                            Itineraries, And User Activity With Ease.
                        </p>
                    </article>

                    <GoogleSignInButton />
                </div>
            </section>
        </main>
    );
};

export default SignIn;
