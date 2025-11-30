import type { DaySchedule, TourInclusions } from "../types/tourdetails";
const mockDaySchedule: DaySchedule[] = [
    {
        id: 1,
        title: "Arrival & Desert Introduction",
        description: "Arrive in Tamanrasset and transfer to the desert camp. Meet your guide and enjoy a welcome tea ceremony while watching the sunset over the dunes.",
        activities: [
            "Airport pickup and transfer to camp",
            "Welcome tea ceremony",
        ],
        meals: "Dinner",
        accommodation: "Desert Camp (Traditional Tents)"
    },
    {
        id: 2,
        title: "Full Desert Experience",
        description: "Explore the vast Sahara desert with various activities including sandboarding, visiting nomadic settlements, and experiencing traditional Tuareg culture.",
        activities: [
            "Morning sandboarding session",
            "Visit to local nomadic community",
            "Traditional lunch with Tuareg family",
        ],
        meals: "Breakfast, Lunch, Dinner",
        accommodation: "Desert Camp (Traditional Tents)"
    },
    {
        id: 3,
        title: "Hoggar Mountains & Assekrem",
        description: "Journey to the Hoggar Mountains and visit the famous Assekrem plateau for breathtaking views and spiritual experience.",
        activities: [
            "Early morning drive to Hoggar Mountains",
            "Hike to Assekrem plateau",
            "Visit Charles de Foucauld hermitage",
        ],
        meals: "Breakfast, Lunch, Dinner",
        accommodation: "Mountain Lodge"
    },
    {
        id: 4,
        title: "Cultural Immersion Day",
        description: "Experience the rich culture and traditions of the region through music, crafts, and local cuisine.",
        activities: [
            "Traditional craft workshop",
            "Tuareg music and dance performance",
            "Cooking class - traditional dishes",
        ],
        meals: "Breakfast, Lunch, Dinner",
        accommodation: "Desert Camp (Traditional Tents)"
    },
    {
        id: 5,
        title: "Departure",
        description: "Enjoy a final breakfast in the desert before transferring back to the airport for your departure.",
        activities: [
            "Sunrise viewing",
            "Final breakfast",
            "Camp cleanup and packing",
            "Transfer to airport"
        ],
        meals: "Breakfast",
        accommodation: "N/A"
    }
];

const mockTourInclusions: TourInclusions = {
    included: [
        "Airport pickup and drop-off",
        "All accommodation (4 nights)",
        "All meals as specified in itinerary",
        "Professional English-speaking guide",
        "4x4 desert transportation",
    ],
    notIncluded: [
        "International flights",
        "Travel insurance",
        "Personal expenses and souvenirs",
        "Tips for guides and drivers",
    ],
    requirements: [
        "Valid passport (6 months validity)",
        "Travel insurance recommended",
        "Moderate physical fitness required",
        "Comfortable walking shoes",
        "Sun protection (hat, sunglasses, sunscreen)",
    ]
};

export { mockDaySchedule, mockTourInclusions };