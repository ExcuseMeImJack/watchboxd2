import React, { useEffect, useState } from 'react'
import { years } from '@/lib/utils/filterYears.js'
import { genres } from '@/lib/utils/genreCodes.js';
import { getFilmsByGenre, getFilmsByYear } from '@/lib/FetchRequests/films';

type Imports = {
  setSearchedItems: React.Dispatch<React.SetStateAction<any>>;
  setIsLoading: React.Dispatch<React.SetStateAction<any>>;
  setSearchFilter: React.Dispatch<React.SetStateAction<any>>;
  genreFilter: string;
  setGenreFilter: React.Dispatch<React.SetStateAction<any>>;
  yearFilter: string;
  setYearFilter: React.Dispatch<React.SetStateAction<any>>;
}

function FilmFilters({ setSearchedItems, setIsLoading, setSearchFilter, genreFilter, setGenreFilter, yearFilter, setYearFilter }: Imports) {

  useEffect(() => {
    const fetchFilmsByYear = async () => {
      setIsLoading(true);
      try {
        const films = await getFilmsByYear(yearFilter);
        setSearchedItems(films.films);
        // console.log(films)
      } catch (error) {
        console.error("Error fetching all films:", error);
      } finally {
        // setGenreFilter("");
        setSearchFilter("");
        setIsLoading(false);
      }

    }

    const fetchFilmsByGenre = async () => {
      setIsLoading(true);
      try {
        const films = await getFilmsByGenre(genreFilter);
        setSearchedItems(films.films);
        console.log(films)
      } catch (error) {
        console.error("Error fetching all films:", error);
      } finally {
        // setYearFilter("");
        setSearchFilter("");
        setIsLoading(false);
      }
    }

    // const fetchFilmsByFilter = async () => {

    // }

    // if(yearFilter || genreFilter) {
    //   fetchFilmsByFilter();
    // }

    if (yearFilter) {
      fetchFilmsByYear();
    }

    if (genreFilter) {
      fetchFilmsByGenre();
    }


  }, [genreFilter, yearFilter])


  return (
    <div className='flex gap-2 items-end'>
      <p className='font-bold'>Filter by:</p>
      <div className='flex gap-2'>
        <select
          className='w-36 h-8 rounded-lg text-md border-2 bg-[--pink] placeholder:text-white text-white text-center focus:outline-none hover:cursor-pointer'
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option className='text-white text-xs' value="" disabled>Year</option>
          {years.map((year, i) => (
            <option key={i} value={year} className='text-xs text-white hover:cursor-pointer'>
              {year}
            </option>
          ))}
        </select>
        <select
          className='w-36 h-8 rounded-lg text-md border-2 bg-[--purple] placeholder:text-white text-white text-center focus:outline-none hover:cursor-pointer'
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option className='text-white text-sm' value="" disabled>Genre</option>
          {Object.keys(genres["MOVIE"]).map((genre, i) => (
            <option key={i} value={genre} className='text-xs text-white '>
              {genre}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FilmFilters
