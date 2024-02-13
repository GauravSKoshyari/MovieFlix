import { useEffect, useRef, useState } from "react";
import { createImageURL } from "../common/utils";
import Modal from "./modal";
import { MovieVideoInfo, fetchVideoInfo } from "../common/api";
import YouTube from "react-youtube";

import PlayIcon from "@heroicons/react/24/solid/PlayCircleIcon";
import LikeIcon from "@heroicons/react/24/outline/HandThumbUpIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import ChevronDown from "@heroicons/react/24/outline/ChevronDownIcon";
import { Position } from "../common/types";

const CARD_WIDTH = 200;

type MovieCardProp = {
  poster_path: string;
  id: number;
  title: string;
  uid: string;
};

export default function MovieCard({
  poster_path,
  id,
  title,
  uid,
}: MovieCardProp) {
  const [isOpen, setisOpen] = useState(false);
  const [videoInfo, setVideoInfo] = useState<MovieVideoInfo | null>(null);
  const movieCardRef = useRef<HTMLSelectElement>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [hidePoster, setHidePoster] = useState(false);

  async function onMouseEnter() {
    const [videoInfo] = await fetchVideoInfo(id.toString());
    let calculatedPosition = movieCardRef.current?.getBoundingClientRect();
    let top = (calculatedPosition?.top ?? 0) - 100;
    let left = (calculatedPosition?.left ?? 0) - 100;
    if (left < 0) {
      left = calculatedPosition?.left as number;
    }

    // 300 is width of youtube dialog - check below , we r taking slightly larger value
    let totalWidth = left + 350;
    // when dialog is going outside window
    if (totalWidth > document.body.clientWidth) {
      left = left - (totalWidth - document.body.clientWidth);
    }
    setPosition({ top, left });
    setVideoInfo(videoInfo);
    setisOpen(true);
  }
  useEffect(() => {
    movieCardRef.current?.addEventListener("mouseenter", onMouseEnter);
  }, []);

  //   when dialog opens , for first 800ms , poster will be shown ; after 800ms video/trailer will play
  useEffect(() => {
    if (videoInfo?.key) {
      setTimeout(() => {
        setHidePoster(true);
      }, 800);
    }
    if (!isOpen) {
      setHidePoster(false);
    }
  }, [videoInfo, isOpen]);

  function onClose() {
    setisOpen(false);
  }
  // don't think there is need of both  : todos
  function closeModal() {
    setisOpen(false);
  }
  return (
    <>
      <section
        ref={movieCardRef}
        key={uid}
        className="aspect-square h-[150px] w-[150px] flex-none  rounded-md"
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
        position={position}
      >
        {/* https://www.npmjs.com/package/react-youtube */}
        <section className="aspect-square transition-[height] duration-500 ease-in">
          <img
            src={createImageURL(poster_path, 300)}
            alt={title}
            className={`${
              hidePoster ? "invisible h-0" : "visible h-full"
            } w-full`}
          />
          <YouTube
            opts={{
              width: "300",
              height: "300",
              playerVars: { autoplay: 1, playsinline: 1, controls: 0 },
            }}
            videoId={videoInfo?.key}
            className={`${!hidePoster ? "invisible h-0" : "visible h-full"}`}
          />
          <section className="flex items-center justify-between p-6">
            <ul className="flex items-center justify-evenly gap-4">
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
            <ul className="flex items-center justify-evenly gap-4">
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
