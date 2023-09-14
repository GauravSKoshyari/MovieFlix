import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import { useEffect, useRef, useState } from "react";
import profileImage from "/netflix-profile-picture.jpg";

export default function ProfileMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const profileMenuContainer = useRef<HTMLElement>(null);
  const timerId = useRef(0);

  //   when we hover over image or ChevronDownIcon section , ul menu appears & there  is a gap b/w with ul menu  . So , when u move cursor to ul menu , mouseleave event also occurs

  function onMouseEnter() {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    setShowMenu(true);
  }
  function onMouseExit() {
    timerId.current = setTimeout(() => {
      setShowMenu(false);
    }, 300);
  }
  useEffect(() => {
    profileMenuContainer.current?.addEventListener("mouseenter", onMouseEnter);
    profileMenuContainer.current?.addEventListener("mouseleave", onMouseExit);

    return () => {
      profileMenuContainer.current?.removeEventListener(
        "mouseenter",
        onMouseEnter,
      );
      profileMenuContainer.current?.removeEventListener(
        "mouseleave",
        onMouseExit,
      );
    };
  }, []);
  return (
    <section className="relative" ref={profileMenuContainer}>
      <section className="flex items-center gap-2">
        <img
          className="h-10 w-10 rounded-md"
          src={profileImage}
          alt="User profile image"
        />
        <ChevronDownIcon
          style={{ strokeWidth: ".2rem" }}
          className={`h-6 w-6 transition-transform duration-200 ${
            showMenu ? "rotate-180" : ""
          }`}
        />
      </section>
      {showMenu ? (
        <ul className="absolute -left-24 top-[60px] flex w-[200px] flex-col justify-center gap-4 bg-dark px-4 py-2">
          <li>username</li>
          <li>Manage Profiles</li>
          <li>Account</li>
          <li>Help Center</li>
          <li className="-mx-4 border-t border-t-gray-500 px-4 pt-2">
            Sign out of Netflix
          </li>
          {/* we gave it -mx-4 & px-4 to extend the border-top completely */}
        </ul>
      ) : null}
    </section>
  );
}
