export default function PageIndicator({
  pagesCount,
  currentPage,
  className,
}: {
  pagesCount: number;
  currentPage: number;
  className: string;
}) {
  return (
    <ul
      className={`mb-4 flex items-center justify-end gap-1 pr-4  ${className}`}
    >
      {Array(pagesCount)
        .fill(0)
        .map((_, index) => (
          <li
            className={`h-[2px] w-3 ${
              currentPage == index ? "bg-gray-100" : "bg-gray-600"
            } `}
            key={index}
          ></li>
        ))}
    </ul>
  );
}
