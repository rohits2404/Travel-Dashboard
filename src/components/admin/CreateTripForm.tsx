"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Header } from "../Header";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import {
    LayerDirective,
    LayersDirective,
    MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

import { comboBoxItems, selectItems } from "@/constants";
import { cn, formatKey } from "@/lib/utils";
import { world_map } from "@/constants/world_map";

type TripFormData = {
    country: string;
    travelStyle: string;
    interest: string;
    budget: string;
    duration: number;
    groupType: string;
};

type CreateTripResponse = {
    id?: string;
};

type ComboBoxChangeEvent = {
    value: string | undefined;
};

type ComboBoxFilteringEvent = {
    text: string;
    updateData: (data: Array<{ text: string; value: string }>) => void;
};

type CreateTripFormProps = {
    countries: Country[];
};

export default function CreateTripForm({ countries }: CreateTripFormProps) {
    const router = useRouter();

    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.value || "",
        travelStyle: "",
        interest: "",
        budget: "",
        duration: 0,
        groupType: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (key: keyof TripFormData, value: string | number) => {
        setFormData((previous) => ({
            ...previous,
            [key]: value,
        }));

        setError(null);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        if (
            !formData.country ||
            !formData.travelStyle ||
            !formData.interest ||
            !formData.budget ||
            !formData.groupType
        ) {
            setError("Please provide values for all fields");
            setLoading(false);
            return;
        }

        if (formData.duration < 1 || formData.duration > 10) {
            setError("Duration must be between 1 and 10 days");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/create-trip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    country: formData.country,
                    numberOfDays: formData.duration,
                    travelStyle: formData.travelStyle,
                    interests: formData.interest,
                    budget: formData.budget,
                    groupType: formData.groupType,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                throw new Error(
                    errorData?.error ||
                        `Failed to create trip (${response.status})`,
                );
            }

            const result: CreateTripResponse = await response.json();

            if (result?.id) {
                router.push(`/trips/${result.id}`);
            } else {
                throw new Error("Failed to generate a trip");
            }
        } catch (error) {
            console.error("Error generating trip:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while generating your trip.",
            );
        } finally {
            setLoading(false);
        }
    };

    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.value,
    }));

    const mapData = [
        {
            country: formData.country,
            color: "#EA382E",
            coordinates:
                countries.find((country) => country.value === formData.country)
                    ?.coordinates || [],
        },
    ];

    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header
                title="Add a New Trip"
                description="View and edit AI Generated travel plans"
            />

            <section className="mt-2.5 wrapper-md">
                <form className="trip-form" onSubmit={handleSubmit}>
                    {/* Country */}
                    <div>
                        <label htmlFor="country">Country</label>

                        <ComboBoxComponent
                            id="country"
                            dataSource={countryData}
                            fields={{
                                text: "text",
                                value: "value",
                            }}
                            placeholder="Select a Country"
                            className="combo-box"
                            value={formData.country}
                            allowFiltering
                            change={(e: ComboBoxChangeEvent) => {
                                if (e.value) {
                                    handleChange("country", e.value);
                                }
                            }}
                            filtering={(e: ComboBoxFilteringEvent) => {
                                const query = e.text.toLowerCase();

                                e.updateData(
                                    countries
                                        .filter((country) =>
                                            country.name
                                                .toLowerCase()
                                                .includes(query),
                                        )
                                        .map((country) => ({
                                            text: country.name,
                                            value: country.value,
                                        })),
                                );
                            }}
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label htmlFor="duration">Duration</label>

                        <input
                            id="duration"
                            name="duration"
                            type="number"
                            min={1}
                            max={10}
                            placeholder="Enter a number of days"
                            className="form-input placeholder:text-gray-100"
                            value={
                                formData.duration === 0 ? "" : formData.duration
                            }
                            onChange={(e) =>
                                handleChange("duration", Number(e.target.value))
                            }
                        />
                    </div>

                    {/* Select fields */}
                    {selectItems.map((key) => (
                        <div key={key}>
                            <label htmlFor={key}>{formatKey(key)}</label>

                            <ComboBoxComponent
                                id={key}
                                dataSource={comboBoxItems[key].map((item) => ({
                                    text: item,
                                    value: item,
                                }))}
                                fields={{
                                    text: "text",
                                    value: "value",
                                }}
                                placeholder={`Select ${formatKey(key)}`}
                                className="combo-box"
                                allowFiltering
                                value={
                                    formData[
                                        key as keyof TripFormData
                                    ] as string
                                }
                                change={(e: ComboBoxChangeEvent) => {
                                    if (e.value) {
                                        handleChange(key, e.value);
                                    }
                                }}
                                filtering={(e: ComboBoxFilteringEvent) => {
                                    const query = e.text.toLowerCase();

                                    e.updateData(
                                        comboBoxItems[key]
                                            .filter((item) =>
                                                item
                                                    .toLowerCase()
                                                    .includes(query),
                                            )
                                            .map((item) => ({
                                                text: item,
                                                value: item,
                                            })),
                                    );
                                }}
                            />
                        </div>
                    ))}

                    {/* World Map */}
                    <div>
                        <label htmlFor="location">
                            Location on the world map
                        </label>

                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective
                                    shapeData={world_map}
                                    dataSource={mapData}
                                    shapePropertyPath="name"
                                    shapeDataPath="country"
                                    shapeSettings={{
                                        colorValuePath: "color",
                                        fill: "#E5E5E5",
                                    }}
                                />
                            </LayersDirective>
                        </MapsComponent>
                    </div>

                    <div className="bg-gray-200 h-px w-full" />

                    {/* Error */}
                    {error && (
                        <div className="error">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <footer className="px-6 w-full">
                        <ButtonComponent
                            type="submit"
                            className="button-class h-12! w-full!"
                            disabled={loading}
                        >
                            <img
                                src={`/assets/icons/${
                                    loading ? "loader.svg" : "magic-star.svg"
                                }`}
                                className={cn("size-5", {
                                    "animate-spin": loading,
                                })}
                                alt=""
                            />

                            <span className="p-16-semibold text-white">
                                {loading ? "Generating..." : "Generate Trip"}
                            </span>
                        </ButtonComponent>
                    </footer>
                </form>
            </section>
        </main>
    );
}
