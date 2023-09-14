import { MouseEvent, useEffect, useRef, useState } from "react";
import SearchIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const strokeWidth = { strokeWidth: ".rem" };
  const inputRef = useRef<HTMLInputElement>(null);

  //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
  // The globalThis property provides a standard way of accessing the global this value (and hence the global object itself) across environments.
  function handleOutsideClick(event: globalThis.MouseEvent) {
    if ((event.target as HTMLInputElement).id !== "searchbar") {
      // if id of elment on which u click is "searchbar"(line 50) , don't setOpen(false)
      setOpen(false);
    }
  }

  //MouseEvent is import at line 1 - important
  function toggleSearch(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!open) {
      inputRef.current?.focus();
    }
    setOpen(!open);
  }
  useEffect(() => {
    if (open) {
      window.addEventListener("click", handleOutsideClick);
    }
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [open]);
  return (
    <section className="flex w-[300px] items-center justify-end overflow-hidden">
      <button className={`h-8 ${!open ? "w-8" : "w-0"}`} onClick={toggleSearch}>
        <SearchIcon style={strokeWidth} />
      </button>
      <section
        className={`${
          open ? "animate-slide-rtl w-full border border-white p-1" : "w-0"
        } flex items-center gap-2 bg-dark `}
      >
        <button className="h-8 w-8">
          <SearchIcon style={strokeWidth} />
        </button>
        <input
          type="text"
          ref={inputRef}
          className="w-full bg-dark outline-none"
          name="searchbar"
          id="searchbar"
          placeholder="Title, people, genres"
        />
      </section>
    </section>
  );
}
