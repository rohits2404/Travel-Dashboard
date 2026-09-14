import { getAllTrips } from "@/appwrite/trips";
import { Pager } from "@/components/admin/Pager";
import { Header } from "@/components/Header";
import { TripCard } from "@/components/TripCard";
import { parseTripData } from "@/lib/utils";

type PageProps = {
    searchParams: Promise<{
        page?: string;
    }>;
};

const PAGE_SIZE = 8;

const Trips = async ({ searchParams }: PageProps) => {
    const params = await searchParams;

    const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

    const offset = (page - 1) * PAGE_SIZE;

    const { allTrips, total } = await getAllTrips(PAGE_SIZE, offset);

    const trips = allTrips
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

    return (
        <main className="all-users wrapper">
            <Header
                title="Trips"
                description="View And Edit AI-Generated Travel Plans"
                ctaText="Create a Trip"
                ctaUrl="/trips/create"
            />

            <section>
                <h1 className="p-24-semibold text-dark-100 mb-4">
                    Manage Created Trips
                </h1>

                <div className="trip-grid mb-4">
                    {trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            id={trip.id}
                            name={trip.name}
                            imageUrl={trip.imageUrls[0]}
                            location={trip.itinerary?.[0]?.location ?? ""}
                            tags={[trip.interests, trip.travelStyle].filter(
                                (tag): tag is string => Boolean(tag),
                            )}
                            price={trip.estimatedPrice}
                        />
                    ))}
                </div>

                <Pager total={total} pageSize={PAGE_SIZE} currentPage={page} />
            </section>
        </main>
    );
};

export default Trips;
