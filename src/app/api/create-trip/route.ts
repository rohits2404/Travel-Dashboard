import { createAdminClient, createSessionClient } from "@/appwrite";
import { appwriteConfig } from "@/appwrite/config";
import { createProduct } from "@/lib/stripe";
import { parseMarkdownToJson, parseTripData } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { OpenAI } from "openai";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    const { country, numberOfDays, travelStyle, interests, budget, groupType } =
        await request.json();

    const client = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

    try {
        const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
        Budget: '${budget}'
        Interests: '${interests}'
        TravelStyle: '${travelStyle}'
        GroupType: '${groupType}'
        Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
        {
        "name": "A descriptive title for the trip",
        "description": "A brief description of the trip and its highlights not exceeding 100 words",
        "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
        "duration": ${numberOfDays},
        "budget": "${budget}",
        "travelStyle": "${travelStyle}",
        "country": "${country}",
        "interests": ${interests},
        "groupType": "${groupType}",
        "bestTimeToVisit": [
          '🌸 Season (from month to month): reason to visit',
          '☀️ Season (from month to month): reason to visit',
          '🍁 Season (from month to month): reason to visit',
          '❄️ Season (from month to month): reason to visit'
        ],
        "weatherInfo": [
          '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
        ],
        "location": {
          "city": "name of the city or region",
          "coordinates": [latitude, longitude],
          "openStreetMap": "link to open street map"
        },
        "itinerary": [
        {
          "day": 1,
          "location": "City/Region Name",
          "activities": [
            {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
            {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
            {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
          ]
        },
        ...
        ]
    }`;

        const textResult = await client.responses.create({
            model: "openai/gpt-oss-20b",
            input: prompt,
            max_output_tokens: 8000,
        });

        const rawOutput = textResult.output_text;

        console.log("AI output length:", rawOutput.length);
        console.log("AI output:", rawOutput);

        const trip = parseMarkdownToJson(rawOutput);

        if (!trip) {
            throw new Error("AI returned invalid trip JSON");
        }

        // Unsplash's current best-practice auth is the Authorization: Client-ID
        // header rather than a client_id query param, and query values must be
        // URI-encoded since country/interests/travelStyle are user-controlled.
        const searchQuery = encodeURIComponent(
            `${country} ${interests} ${travelStyle}`,
        );
        const imageResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=3`,
            {
                headers: {
                    Authorization: `Client-ID ${unsplashApiKey}`,
                },
            },
        );

        if (!imageResponse.ok) {
            throw new Error(
                `Unsplash request failed with status ${imageResponse.status}`,
            );
        }

        const imageData = await imageResponse.json();
        const imageUrls = imageData.results
            .slice(0, 3)
            .map((result: any) => result.urls?.regular || null);

        const { databases } = await createAdminClient();

        const { account } = await createSessionClient();

        const user = await account.get();

        if (!user?.$id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Appwrite renamed the Databases service to TablesDB: createDocument ->
        // createRow, collectionId -> tableId, documentId -> rowId, and all
        // params are now passed as a single object instead of positionally.
        const result = await databases.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.tripCollectionId,
            rowId: ID.unique(),
            data: {
                tripDetail: JSON.stringify(trip),
                imageUrls,
                userId: user.$id,
            },
        });

        const tripDetail = parseTripData(result.tripDetail) as Trip;
        const tripPrice = parseInt(
            tripDetail.estimatedPrice.replace("$", ""),
            10,
        );
        const paymentLink = await createProduct(
            tripDetail.name,
            tripDetail.description,
            imageUrls,
            tripPrice,
            result.$id,
        );

        // updateDocument -> updateRow, same object-param shape as createRow.
        await databases.updateRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.tripCollectionId,
            rowId: result.$id,
            data: {
                payment_link: paymentLink.url,
            },
        });

        return NextResponse.json({ id: result.$id });
    } catch (e) {
        console.error("Error generating travel plan: ", e);
        return NextResponse.json(
            { error: "Failed to generate travel plan" },
            { status: 500 },
        );
    }
}
