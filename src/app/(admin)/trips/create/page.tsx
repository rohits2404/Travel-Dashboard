import CreateTripForm from "@/components/admin/CreateTripForm";

type RestCountry = {
    names?: {
        common?: string;
        official?: string;
    };
    flag?: {
        emoji?: string;
    };
    coordinates?: {
        lat?: number;
        lng?: number;
    };
    links?: {
        openstreetmap?: string;
    };
};

async function getCountries(): Promise<Country[]> {
    const response = await fetch(
        "https://api.restcountries.com/countries/v5?limit=100",
        {
            headers: {
                Authorization: `Bearer ${process.env.REST_COUNTRIES_API_KEY}`,
            },
            next: {
                revalidate: 86400,
            },
        },
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    const json = await response.json();

    const countries = json.data?.objects;

    if (!Array.isArray(countries)) {
        console.error("Unexpected countries response:", json);
        throw new Error("Invalid countries API response");
    }

    return countries.map((country: RestCountry) => ({
        name: `${country.flag?.emoji ?? ""} ${
            country.names?.common ?? ""
        }`.trim(),

        value: country.names?.common ?? "",

        coordinates: [
            country.coordinates?.lat ?? 0,
            country.coordinates?.lng ?? 0,
        ],

        openStreetMap: country.links?.openstreetmap,
    }));
}

export default async function CreateTripPage() {
    const countries = await getCountries();

    return <CreateTripForm countries={countries} />;
}
