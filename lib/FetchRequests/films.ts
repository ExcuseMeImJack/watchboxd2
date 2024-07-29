import { NextResponse } from 'next/server';
import { isDateInFuture } from '@/lib/utils/isDateInFuture.js'
import { genres } from '../utils/genreCodes';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const options = {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER}`,
  },
};

export const dynamic = 'force-dynamic';

// Fetch random film backgrounds
export async function getRandomFilmBackground() {
  try {
    const res = await fetch('/api/films/getRandomFilmBackground');
    if (res.ok) {
      return await res.json();
    } else {
      const errorResponse = await res.json();
      return { error: `Error Fetching Film Data: ${errorResponse.status_message}` };
    }
  } catch (error) {
    return { error: `Error Fetching Film Data: ${error.message}` };
  }
}

// Fetch all films
export async function getAllFilms() {
  try {
    const res = await fetch('/api/films/getAllFilms');
    if (res.ok) {
      return await res.json();
    } else {
      const errorResponse = await res.json();
      return { error: `Error Fetching Film Data: ${errorResponse.status_message}` };
    }
  } catch (error) {
    return { error: `Error Fetching Film Data: ${error.message}` };
  }
}

// Fetch films by year
export async function getFilmsByYear(inputYear: string) {
  try {
    const res = await fetch(`/api/films/getFilmsByYear?query=${encodeURIComponent(inputYear)}`);

    if (!res.ok) {
      const errorResponse = await res.json();
      return (`Error Fetching Film Data: ${errorResponse.error}`);
    }

    const films = await res.json();
    return (films);
  } catch (error: any) {
    return (`Error Fetching Film Data: ${error.message}`);
  }
}

// Fetch films by genre
export async function getFilmsByGenre(inputGenre: string) {
  if (!API_KEY) return { error: 'API key is missing' };

  // Define TMDB API URL for fetching films by genre
  const TMDB_API_URL = 'https://api.themoviedb.org/3/discover/movie?with_genres=';

  try {
    const genreCode = genres.MOVIE[inputGenre];
    if (!genreCode) return { error: 'Invalid genre' };

    const res = await fetch(`${TMDB_API_URL}${genreCode}`, options);

    if (res.ok) {
      const films = await res.json();
      return { films: films.results };
    } else {
      const errorResponse = await res.json();
      return { error: `Error Fetching Film Data: ${errorResponse.status_message}` };
    }
  } catch (error: any) {
    return { error: `Error Fetching Film Data: ${error.message}` };
  }
}

// Fetch films by search query
export async function getFilmsBySearch(search: string) {
  try {
    const res = await fetch(`/api/films/getFilmsBySearch?query=${encodeURIComponent(search)}`);

    if (!res.ok) {
      const errorResponse = await res.json();
      return (`Error Fetching Film Data: ${errorResponse.error}`);
    }

    const films = await res.json();
    return (films);
  } catch (error: any) {
    return (`Error Fetching Film Data: ${error.message}`);
  }
}
