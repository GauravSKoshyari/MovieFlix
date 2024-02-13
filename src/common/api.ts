
// https://developer.themoviedb.org/reference/movie-details
// one of api link-  https://api.themoviedb.org/3/movie/{movie_id}
// u can pass query params also -> https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=en-US

import { ENDPOINT } from "./endpoints"

// this is type for each element in 'results' arary of below MovieResponse
export type MovieResult=  {
    adult: boolean
    backdrop_path: string
    genre_ids: number[]
    id: number
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
    [k: string]: unknown
  }

  // output of this  :  https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=01a290c8709cdf55939b8d063e463997&region=IN
  // https://developer.themoviedb.org/reference/movie-popular-list
// get  json  output  -> get Schema from jsonhero -> use transform.tools to convert schema to ts interface/type
  export interface MovieResponse<T> {
    page: number
    results: T
    total_pages: number
    total_results: number
    [k: string]: unknown
  }


export async function fetchRequest<T>(endpoint:string){
    const url = new URL(endpoint , import.meta.env.VITE_BASE_API);
    url.searchParams.append("api_key",import.meta.env.VITE_API_KEY);
    const response = await fetch(url);
    return response.json() as Promise<T>;
    // type assertion - you are asserting that the JSON data returned by response.json() will have a structure that matches the type T.
    // You are telling TypeScript that you expect the result of response.json() to be a Promise that resolves to a value of type T
}

// todo: take a note - promise with typescript

// https://developer.themoviedb.org/reference/movie-videos
// https://api.themoviedb.org/3/movie/{movie_id}/videos
// getting these types ->  get  json  output  -> get Schema from jsonhero -> use transform.tools to convert schema to ts interface/type
export type MovieVideoResult<T> = {
    id: number;
    results: T;
    [k: string]: unknown;
  };
  
  export type MovieVideoInfo = {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: string;
    [k: string]: unknown;
  };


export async function fetchVideoInfo(id : string) {
    const response = await fetchRequest<MovieVideoResult<MovieVideoInfo[]>>(
      ENDPOINT.MOVIES_VIDEO.replace("{movie_id}", id),
    );
    return response.results.filter(
      (result) => result.site.toLowerCase() === "youtube" && result.type.toLowerCase() === "trailer",
    );
  }