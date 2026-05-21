export interface Movie {
  id: number;
  title?: string;
  original_title: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  poster_path?: string;
  genres?: { id: number; name: string }[];
  tagline?: string;
  vote_count?: number;
  runtime?: number;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  overview: string;
  poster_path?: string;
  genres?: { id: number; name: string }[];
  tagline?: string;
  vote_count?: number;
  episode_run_time?: number[];
}

export interface Person {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  known_for_department: string;
  birthday: string;
  place_of_birth: string;
  popularity: number;
  gender: number;
  biography: string;
}

export interface Genre {
  id: number;
  name: string;
}
