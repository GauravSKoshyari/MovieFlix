import React, { useEffect, useRef, useState } from "react";
import { createImageURL } from "../common/utils";
import Modal from "./modal";
import { fetchRequest } from "../common/api";
import { ENDPOINT } from "../common/endpoints";
import YouTube from "react-youtube";

import PlayIcon from "@heroicons/react/24/solid/PlayCircleIcon";
import LikeIcon from "@heroicons/react/24/outline/HandThumbUpIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import ChevronDown from "@heroicons/react/24/outline/ChevronDownIcon";

const CARD_WIDTH = 200;

// https://developer.themoviedb.org/reference/movie-videos
// https://api.themoviedb.org/3/movie/{movie_id}/videos
// getting these types -> using thunderclient , get ur json  output  -> get Schema from jsonhero -> use transform.tools to convert schema to ts interface/type
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

type MovieCardProp = {
  poster_path: string;
  id: number;
  title: string;
};

type Position = {
  top: number;
  left: number;
};

export default function MovieCard({ poster_path, id, title }: MovieCardProp) {
  const [isOpen, setisOpen] = useState(false);
  const [videoInfo, setVideoInfo] = useState<MovieVideoInfo | null>(null);
  const movieCardRef = useRef<HTMLSelectElement>(null);
  const [position, setPosition] = useState<Position | null>(null);

  async function fetchVideoInfo() {
    const response = await fetchRequest<MovieVideoResult<MovieVideoInfo[]>>(
      ENDPOINT.MOVIES_VIDEO.replace("{movie_id}", id.toString()),
    );
    return response.results.filter(
      (result) => result.site.toLowerCase() === "youtube",
    );
  }

  async function onMouseEnter(event: any) {
    const [videoInfo] = await fetchVideoInfo();
    setVideoInfo(videoInfo);
    setisOpen(true);
  }
  useEffect(() => {
    movieCardRef.current?.addEventListener("mouseenter", onMouseEnter);
  }, []);

  function onClose(value: boolean) {
    setisOpen(value);
  }
  function closeModal() {
    setisOpen(false);
  }
  return (
    <>
      <section
        ref={movieCardRef}
        key={id}
        className="aspect-square h-[200px] w-[200px] flex-none  rounded-md"
      >
        <img
          className="h-full w-full"
          src={createImageURL(poster_path, CARD_WIDTH)}
          alt={title}
        />
      </section>
      <Modal
        title={""}
        isOpen={isOpen}
        key={id}
        onClose={onClose}
        closeModal={closeModal}
      >
        {/* https://www.npmjs.com/package/react-youtube */}
        <section>
          <YouTube
            opts={{
              width: "450",
              playerVars: { autoplay: 1, playsinline: 1, controls: 0 },
            }}
            videoId={videoInfo?.key}
          />
          <section className="flex items-center justify-between p-6">
            <ul className="justify-evely flex items-center gap-4">
              <li className="h-12 w-12">
                <button className="h-full w-full">
                  <PlayIcon />
                </button>
              </li>
              <li className="h-12 w-12 rounded-full border-2 border-gray-500 p-2 hover:border-white">
                <button className="h-full w-full">
                  <PlusIcon />
                </button>
              </li>
              <li className="h-12 w-12 rounded-full border-2 border-gray-500 p-2 hover:border-white">
                <button className="h-full w-full">
                  <LikeIcon />
                </button>
              </li>
            </ul>
            <ul className="justify-evely flex items-center gap-4">
              <li className="h-12 w-12 rounded-full border-2 border-gray-500 p-2 hover:border-white">
                <button className="h-full w-full">
                  <ChevronDown />
                </button>
              </li>
            </ul>
          </section>
        </section>
      </Modal>
    </>
  );
}
