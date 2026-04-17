export interface ISearchSuggestion {
  suggestions: string[];
}

export interface IEventRecommendation {
  id: string;
  title: string;
  date: Date;
  venue: string;
  fee: number;
  category: {
    id: string;
    name: string;
  } | null;
  organizer: {
    name: string;
    image: string | null;
  };
  _count: {
    participations: number;
  };
}

export interface IChatResponse {
  reply: string;
}
