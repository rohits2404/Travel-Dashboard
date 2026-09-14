import { getAllTrips, getTripById } from "@/appwrite/trips";
import { InfoPill } from "@/components/InfoPill";
import { PayTripButton } from "@/components/root/PayTripButton";
import { TravelDetailChips } from "@/components/root/TravelDetailChips";
import { TripCard } from "@/components/TripCard";
import { cn, parseTripData } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
    params: Promise<{
        tripId: string;
    }>;
};

export default async function TravelDetail({ params }: PageProps) {
    const { tripId } = await params;

    if (!tripId) {
        notFound();
    }

    const [trip, trips] = await Promise.all([
        getTripById(tripId),
        getAllTrips(4, 0),
    ]);

    if (!trip) {
        notFound();
    }

    const imageUrls = trip.imageUrls ?? [];
    const tripData = parseTripData(trip.tripDetail);
    const paymentLink = trip.payment_link;

    if (!tripData) {
        notFound();
    }

    const {
        name,
        duration,
        itinerary,
        travelStyle,
        groupType,
        budget,
        interests,
        estimatedPrice,
        description,
        bestTimeToVisit,
        weatherInfo,
        country,
    } = tripData;

    const allTrips = trips.allTrips
        .map(({ $id, tripDetail, imageUrls }) => {
            const parsedTrip = parseTripData(tripDetail);

            if (!parsedTrip) return null;

            return {
                ...parsedTrip,
                id: $id,
                imageUrls: imageUrls ?? [],
            };
        })
        .filter((trip): trip is NonNullable<typeof trip> => trip !== null);

    const pillItems = [
        {
            text: travelStyle,
            bg: "!bg-pink-50 !text-pink-500",
        },
        {
            text: groupType,
            bg: "!bg-primary-50 !text-primary-500",
        },
        {
            text: budget,
            bg: "!bg-success-50 !text-success-700",
        },
        {
            text: interests,
            bg: "!bg-navy-50 !text-navy-500",
        },
    ];

    const visitTimeAndWeatherInfo = [
        {
            title: "Best Time to Visit:",
            items: bestTimeToVisit,
        },
        {
            title: "Weather:",
            items: weatherInfo,
        },
    ];

    return (
        <main className="travel-detail pt-40 wrapper">
            <div className="travel-div">
                <Link href="/" className="back-link">
                    <img src="/assets/icons/arrow-left.svg" alt="back icon" />
                    <span>Go Back</span>
                </Link>

                <section className="container wrapper-md">
                    {/* Header */}
                    <header>
                        <h1 className="p-40-semibold text-dark-100">{name}</h1>

                        <div className="flex items-center gap-5">
                            <InfoPill
                                text={`${duration} day plan`}
                                image="/assets/icons/calendar.svg"
                            />

                            <InfoPill
                                text={
                                    itinerary
                                        ?.slice(0, 4)
                                        .map((item) => item.location)
                                        .join(", ") || ""
                                }
                                image="/assets/icons/location-mark.svg"
                            />
                        </div>
                    </header>

                    {/* Gallery */}
                    <section className="gallery">
                        {imageUrls.map((url: string, index: number) => (
                            <img
                                src={url}
                                key={index}
                                alt={`${name} destination ${index + 1}`}
                                className={cn(
                                    "w-full rounded-xl object-cover",
                                    index === 0
                                        ? "md:col-span-2 md:row-span-2 h-82.5"
                                        : "md:row-span-1 h-37.5",
                                )}
                            />
                        ))}
                    </section>

                    {/* Tags + Rating */}
                    <TravelDetailChips items={pillItems} />

                    {/* Title / Price */}
                    <section className="title">
                        <article>
                            <h3>
                                {duration}-Day {country} {travelStyle} Trip
                            </h3>

                            <p>
                                {budget}, {groupType} and {interests}
                            </p>
                        </article>

                        <h2>{estimatedPrice}</h2>
                    </section>

                    {/* Description */}
                    <p className="text-sm md:text-lg font-normal text-dark-400">
                        {description}
                    </p>

                    {/* Itinerary */}
                    <ul className="itinerary">
                        {itinerary?.map((dayPlan: DayPlan, index: number) => (
                            <li key={index}>
                                <h3>
                                    Day {dayPlan.day}: {dayPlan.location}
                                </h3>

                                <ul>
                                    {dayPlan.activities.map(
                                        (activity, activityIndex) => (
                                            <li key={activityIndex}>
                                                <span className="flex-shring-0 p-18-semibold">
                                                    {activity.time}
                                                </span>

                                                <p className="grow">
                                                    {activity.description}
                                                </p>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </li>
                        ))}
                    </ul>

                    {/* Best Time / Weather */}
                    {visitTimeAndWeatherInfo.map((section) => (
                        <section key={section.title} className="visit">
                            <div>
                                <h3>{section.title}</h3>

                                <ul>
                                    {section.items?.map((item) => (
                                        <li key={item}>
                                            <p className="grow">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    ))}

                    {/* Payment */}
                    {paymentLink && (
                        <PayTripButton
                            paymentLink={paymentLink}
                            estimatedPrice={estimatedPrice}
                        />
                    )}
                </section>
            </div>

            {/* Popular Trips */}
            <section className="flex flex-col gap-6">
                <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>

                <div className="trip-grid">
                    {allTrips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            id={trip.id}
                            name={trip.name}
                            imageUrl={trip.imageUrls[0]}
                            location={trip.itinerary?.[0]?.location ?? ""}
                            tags={[trip.interests, trip.travelStyle]}
                            price={trip.estimatedPrice}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
