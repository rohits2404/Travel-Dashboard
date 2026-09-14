import Link from "next/link";
import { Confetti } from "@/components/root/Confetti";

import { LEFT_CONFETTI, RIGHT_CONFETTI } from "@/constants";

export default async function PaymentSuccess({
    params,
}: {
    params: Promise<{
        tripId: string;
    }>;
}) {
    const { tripId } = await params;

    return (
        <main className="payment-success wrapper">
            <Confetti leftConfig={LEFT_CONFETTI} rightConfig={RIGHT_CONFETTI} />

            <section>
                <article>
                    <img
                        src="/assets/icons/check.svg"
                        alt="Payment successful"
                        className="size-24"
                    />

                    <h1>Thank & Welcome Aboard!</h1>

                    <p>
                        Your Trip Is Booked - Can't Wait To Have You On This
                        Adventure. Get Ready To Explore & Make Memories! ✨
                    </p>

                    {tripId && (
                        <Link href={`/travel/${tripId}`} className="w-full">
                            <div className="button-class h-11! w-full! flex items-center justify-center gap-2">
                                <img
                                    src="/assets/icons/itinerary-button.svg"
                                    alt=""
                                    className="size-5"
                                />

                                <span className="p-16-semibold text-white">
                                    View Trip Details
                                </span>
                            </div>
                        </Link>
                    )}

                    <Link href="/" className="w-full">
                        <div className="button-class-secondary h-11! w-full! flex items-center justify-center gap-2">
                            <img
                                src="/assets/icons/arrow-left.svg"
                                alt=""
                                className="size-5"
                            />

                            <span className="p-16-semibold">
                                Return To Homepage
                            </span>
                        </div>
                    </Link>
                </article>
            </section>
        </main>
    );
}
