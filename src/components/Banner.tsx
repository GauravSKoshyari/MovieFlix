import { useEffect, useState } from "react";
import {
  MovieResponse,
  MovieResult,
  MovieVideoInfo,
  fetchRequest,
  fetchVideoInfo,
} from "../common/api";
import { ENDPOINT } from "../common/endpoints";
import { createImageURL } from "../common/utils";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import PlayIcon from "@heroicons/react/24/solid/PlayIcon";
import Info from "@heroicons/react/24/outline/InformationCircleIcon";

export default function Banner() {
  const [randomMovie, setrandomMovie] = useState<MovieResult>();
  const [videoInfo, setvideoInfo] = useState<MovieVideoInfo>();
  const [hidePoster, setHidePoster] = useState(false);
  const [showBackdrop, setshowBackdrop] = useState(false);

  // https://www.npmjs.com/package/react-youtube
  const options: YouTubeProps["opts"] = {
    width: document.body.clientWidth,
    height: "800",
    playerVars: {
      autoplay: 1,
      playsinline: 1,
      controls: 0,
    },
  };
  function getRandomIndex(last: number) {
    return Math.floor(Math.random() * (last - 1));
  }
  async function fetchPopularMovies() {
    const response = await fetchRequest<MovieResponse<MovieResult[]>>(
      ENDPOINT.MOVIES_POPULAR,
    );
    const filteredMovies = response.results.filter(
      (movie) => movie.backdrop_path,
    );
    const randomSelection =
      filteredMovies[getRandomIndex(filteredMovies.length)];
    const videoInfo = await fetchVideoInfo(randomSelection.id.toString());
    setvideoInfo(videoInfo[0]);
    setrandomMovie(randomSelection);
    setTimeout(() => {
      setHidePoster(true);
    }, 1500);
  }

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  function onStateChange(event: YouTubeEvent<number>) {
    // video has finished playing
    if (event.data === 0) {
      setHidePoster(false);
      setshowBackdrop(true);
    } else if (event.data === 1) {
      //video has started playing
      setHidePoster(true);
      setshowBackdrop(false);
    }
  }
  return (
    <section className="relative aspect-video h-[800px]  w-full">
      <img
        src={createImageURL(randomMovie?.backdrop_path ?? "", 0, "original")}
        alt={randomMovie?.title}
        className={`${hidePoster ? "invisible h-0" : "visible h-full w-full"}`}
      />
      {videoInfo ? (
        <YouTube
          videoId={videoInfo?.key}
          id="banner-video"
          opts={options}
          className={`${
            hidePoster ? "visible h-full" : "invisible h-0"
          } absolute z-[1] -mt-14`}
          onStateChange={onStateChange}
          // This event fires whenever the player's state changes
        />
      ) : null}
      {showBackdrop ? (
        <section className="absolute left-0 top-0 z-[1] h-full w-full bg-dark/60"></section>
      ) : null}
      <section className="absolute bottom-16 z-[1] ml-16 flex max-w-sm flex-col gap-2">
        <h2 className="text-6xl">{randomMovie?.title}</h2>
        <p className="line-clamp-3 text-sm">{randomMovie?.overview}</p>
        <section className="flex gap-2">
          <button className="flex w-[100px] items-center rounded-md bg-white p-2 text-dark">
            <PlayIcon className="h-8 w-8" /> <span>Play</span>
          </button>
          <button className="flex w-[150px] items-center rounded-md bg-zinc-400/50 p-2 text-white">
            <Info className="h-8 w-8" /> <span>More Info</span>
          </button>
        </section>
      </section>
    </section>
  );
}
