import { useEffect, useRef, useState } from "react";
import { MovieResponse, MovieResult, fetchRequest } from "../common/api";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";
import PageIndicator from "./page-indicator";
import MovieCard from "./movie-card";

type RowProp = {
  title: string;
  endpoint: string;
};

const CARD_WIDTH = 200;

function ContentRow({ title, endpoint }: RowProp) {
  const sliderRef = useRef<HTMLSelectElement>(null);
  const containerRef = useRef<HTMLSelectElement>(null);
  const [translateX, settranslateX] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);
  // how many pages/windows would be required to show row (obviously row is overflow-hidden)

  const [currentPage, setcurrentPage] = useState(0);

  const [rowData, setRowData] = useState<MovieResult[]>([]);

  const cardsPerPage = useRef(0);
  // we will find no of card in window , which which help to know how much to slide

  const disabelPrev = currentPage === 0;
  const disabelNext = currentPage + 1 === pagesCount;

  async function fetchRowData() {
    const response = await fetchRequest<MovieResponse<MovieResult[]>>(endpoint);
    setRowData(response.results);
  }

  function onNextClick() {
    if (sliderRef.current) {
      let updatedTranslateX = translateX - getTranslateXValue();
      sliderRef.current.style.transform = `translateX(${updatedTranslateX}%)`;
      settranslateX(updatedTranslateX);
      setcurrentPage(currentPage + 1);
    }
  }
  function onPrevClick() {
    if (sliderRef.current) {
      let updatedTranslateX = translateX + getTranslateXValue();
      sliderRef.current.style.transform = `translateX(${updatedTranslateX}%)`;
      settranslateX(updatedTranslateX);
      setcurrentPage(currentPage - 1);
    }
  }

  function getTranslateXValue() {
    let translateX = 0;
    if (sliderRef.current) {
      translateX =
        ((cardsPerPage.current * CARD_WIDTH) / sliderRef.current.clientWidth) *
        100;
    }
    return translateX;
  }

  useEffect(() => {
    if (rowData?.length) {
      if (containerRef.current) {
        cardsPerPage.current = Math.floor(
          containerRef.current.clientWidth / CARD_WIDTH,
        );
      }
      setPagesCount(Math.ceil(rowData.length / cardsPerPage.current));
    }
  }, [rowData.length]);

  useEffect(() => {
    fetchRowData();
  }, []);

  return (
    // check row-container in index.css
    <section className="row-container ml-12 hover:cursor-pointer">
      <h2 className="text-xl">{title}</h2>
      <PageIndicator
        className="mb-4 opacity-0 transition-opacity delay-300 ease-in"
        pagesCount={pagesCount}
        currentPage={currentPage}
      />
      {/* above className is also prop - not css  */}
      <section
        ref={containerRef}
        className="relative mb-8 flex  gap-2 overflow-hidden "
      >
        {!disabelPrev ? (
          <button
            className="absolute z-[1] h-full w-12 bg-black/25 opacity-0 transition-opacity delay-300 ease-in"
            onClick={onPrevClick}
          >
            <ChevronLeftIcon />
          </button>
        ) : null}

        {!disabelNext ? (
          <button
            className="absolute right-0 z-[1] h-full w-12 bg-black/25 opacity-0 transition-opacity delay-300 ease-in"
            onClick={onNextClick}
          >
            <ChevronRightIcon />
          </button>
        ) : null}
        <section
          ref={sliderRef}
          className="flex flex-nowrap gap-2 transition-transform duration-700 ease-linear"
        >
          {rowData?.map((row) => {
            return (
              <MovieCard
                uid={`$(row.id}-${title}`}
                key={`$(row.id}-${title}`}
                {...row}
              />
            );
          })}
        </section>
      </section>
    </section>
  );
}

export default ContentRow;
