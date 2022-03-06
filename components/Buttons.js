import * as React from "react";
import { v4 as uuid } from "uuid";
import { FaFile, FaGithub, FaCalendar } from "react-icons/fa";
import { useRouter } from "next/router";

const links = [
  {
    url: "https://github.com/irhamputra",
    icon: <FaGithub />,
    text: "See my Github",
  },
  {
    url: "https://www.linkedin.com/in/muhamad-irham-prasetyo/",
    icon: <FaFile />,
    text: "See my CV",
  },
  {
    url: "meeting",
    icon: <FaCalendar />,
    text: "Set an Meeting",
  },
];

const Buttons = () => {
  const { push, query } = useRouter();

  const handleRedirect = React.useCallback(
    (url = "") =>
      typeof window !== "undefined" && url.includes("https")
        ? window.open(url, "_blank")
        : push({
            pathname: "/",
            query: { q: url },
          }),
    []
  );

  const clx = React.useCallback(
    (index) =>
      `animate__animated animate__fadeInUp animate__delay-${
        index + 2
      }s hover:shadow-xl bg-gray-900 text-white border py-2 px-3 rounded-2xl w-full mb-2 md:mb-0`,
    []
  );

  if (query.q) return null;

  return (
    <div className="block md:flex md:space-x-4 md:justify-center md:items-center">
      {links.map((link, index) => {
        return (
          <button
            key={uuid()}
            onClickCapture={() => handleRedirect(link.url)}
            type="button"
            className={clx(index)}
          >
            <div className="flex justify-center items-center space-x-2">
              {link.icon} <span>{link.text}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Buttons;
