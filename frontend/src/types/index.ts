export interface Activity {
  activity_id: string;
  title: string;
  category: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  organizer: string;
  registration_deadline: string | null;
  capacity: number | null;
  image_url: string | null;
  ai_summary: string | null;
  tags: string | null;
  target_audience: string | null;
  created_at: string;
  is_favorite: boolean;
  is_registered: boolean;
}

export interface Favorite {
  favorite_id: string;
  user_id: string;
  activity_id: string;
  created_at: string;
}

export interface Registration {
  registration_id: string;
  user_id: string;
  activity_id: string;
  status: string;
  registered_at: string;
}

export interface ActivityCardData {
  activity_id: string;
  title: string;
  category: string;
  start_time: string;
  end_time: string;
  location: string;
  organizer: string;
  image_url: string | null;
  is_favorite: boolean;
  is_registered: boolean;
}

export interface SearchResult {
  results: Activity[];
  count: number;
  interpreted?: {
    keywords: string;
    category: string | null;
    original_query: string;
  };
}
