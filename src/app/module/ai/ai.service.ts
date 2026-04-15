import { prisma } from "../../lib/prisma";

const getSearchSuggestions = async (query: string) => {
  if (!query || query.length < 1) {
    return [];
  }

  const [events, categories] = await Promise.all([
    prisma.event.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { title: true, venue: true },
    }),
    prisma.category.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 2,
      select: { name: true },
    }),
  ]);

  const suggestions = new Set<string>();

  categories.forEach((cat) => suggestions.add(cat.name));

  events.forEach((e) => {
    if (e.title) suggestions.add(e.title);
    if (e.venue) suggestions.add(e.venue);
  });

  return Array.from(suggestions).slice(0, 10);
};

const getRecommendations = async (userId?: string) => {
  let recommendedCategoryIds: string[] = [];

  if (userId) {
    const userParticipations = await prisma.participation.findMany({
      where: { userId, status: "APPROVED" },
      include: {
        event: { select: { categoryId: true } },
      },
      take: 20,
    });

    if (userParticipations.length > 0) {
      const catIds = userParticipations
        .map((p) => p.event.categoryId)
        .filter(Boolean);
      recommendedCategoryIds = Array.from(new Set(catIds)) as string[];
    }
  }

  let trendingEvents = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      category: true,
      organizer: { select: { name: true, image: true } },
      _count: { select: { participations: true } },
    },
  });

  if (recommendedCategoryIds.length > 0) {
    const personalized = await prisma.event.findMany({
      where: {
        isActive: true,
        categoryId: { in: recommendedCategoryIds },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        category: true,
        organizer: { select: { name: true, image: true } },
        _count: { select: { participations: true } },
      },
    });

    const combined = [...personalized, ...trendingEvents];
    const uniqueIds = new Set();

    trendingEvents = combined
      .filter((e) => {
        if (!uniqueIds.has(e.id)) {
          uniqueIds.add(e.id);
          return true;
        }
        return false;
      })
      .slice(0, 6);
  }
  return trendingEvents;
};

const getTrending = async () => {
  return await prisma.event.findMany({
    where: { isActive: true },
    orderBy: [{ createdAt: "desc" }],
    take: 10,
    include: {
      category: true,
      organizer: { select: { name: true, image: true } },
      _count: { select: { participations: true } },
    },
  });
};

const chatWithAssistant = async (message: string) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error(
      "Gemini API key is missing. Please configure GEMINI_API_KEY in .env file.",
    );
  }

  // Fetch live data context for the AI
  const liveEvents = await prisma.event.findMany({
    where: { isActive: true },
    take: 15,
    select: {
      title: true,
      date: true,
      fee: true,
      venue: true,
      category: { select: { name: true } },
      _count: { select: { participations: true } },
    },
  });

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    take: 10,
  });

  const context = JSON.stringify({ events: liveEvents, categories });

  const systemPrompt = `You are a helpful AI assistant for Planova - an event management platform. 
  Here is current data about our active events and categories: ${context}.
  Answer the user's questions about events, event categories, dates, venues, fees, and event recommendations. 
  Help users discover events that match their interests. Keep responses concise and helpful.
  If asked about something not related to events, politely redirect to event-related topics.`;

  // Call the Gemini API Rest Endpoint directly
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7,
        },
      }),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini Error: ", errText);
    throw new Error("Failed to communicate with Gemini API");
  }

  const data = await response.json();
  const reply =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I couldn't understand that. Please try asking about our events.";

  return { reply };
};

export const AIService = {
  getSearchSuggestions,
  getRecommendations,
  getTrending,
  chatWithAssistant,
};
