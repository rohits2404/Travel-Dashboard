import { notFound } from "next/navigation";

import { getAllTrips, getTripById } from "@/appwrite/trips";
import { cn, parseTripData } from "@/lib/utils";

import { Header } from "@/components/Header";
import { InfoPill } from "@/components/InfoPill";
import { TripCard } from "@/components/TripCard";
import { TripTags } from "@/components/admin/TripTags";

type PageProps = {
    params: Promise<{
        tripId: string;
    }>;
};

const TripDetail = async ({ params }: PageProps) => {
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
    } = tripData || {};

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

    const pillItems = [
        {
            text: travelStyle ?? "",
            bg: "!bg-pink-50 !text-pink-500",
        },
        {
            text: groupType ?? "",
            bg: "!bg-primary-50 !text-primary-500",
        },
        {
            text: budget ?? "",
            bg: "!bg-success-50 !text-success-700",
        },
        {
            text: interests ?? "",
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
        <main className="travel-detail wrapper">
            <Header
                title="Trip Details"
                description="View and edit AI-generated travel plans"
            />

            <section className="container wrapper-md">
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
                                    .map((item: DayPlan) => item.location)
                                    .join(", ") || ""
                            }
                            image="/assets/icons/location-mark.svg"
                        />
                    </div>
                </header>

                <section className="gallery">
                    {imageUrls.map((url: string, index: number) => (
                        <img
                            src={url}
                            key={index}
                            alt={`${name} trip image ${index + 1}`}
                            className={cn(
                                "w-full rounded-xl object-cover",
                                index === 0
                                    ? "md:col-span-2 md:row-span-2 h-82.5"
                                    : "md:row-span-1 h-37.5",
                            )}
                        />
                    ))}
                </section>

                <TripTags items={pillItems} />

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

                <p className="text-sm md:text-lg font-normal text-dark-400">
                    {description}
                </p>

                <ul className="itinerary">
                    {itinerary?.map((dayPlan: DayPlan) => (
                        <li key={dayPlan.day}>
                            <h3>
                                Day {dayPlan.day}: {dayPlan.location}
                            </h3>

                            <ul>
                                {dayPlan.activities.map(
                                    (activity, index: number) => (
                                        <li key={index}>
                                            <span className="shrink-0 p-18-semibold">
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

                {visitTimeAndWeatherInfo.map((section) => (
                    <section key={section.title} className="visit">
                        <div>
                            <h3>{section.title}</h3>

                            <ul>
                                {section.items?.map((item: string) => (
                                    <li key={item}>
                                        <p className="grow">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                ))}
            </section>

            <section className="flex flex-col gap-6">
                <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>

                <div className="trip-grid">
                    {allTrips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            id={trip.id}
                            name={trip.name || ""}
                            imageUrl={trip.imageUrls[0]}
                            location={trip.itinerary?.[0]?.location ?? ""}
                            tags={[trip.interests, trip.travelStyle].filter(
                                (tag): tag is string => Boolean(tag),
                            )}
                            price={trip.estimatedPrice || ""}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default TripDetail;
