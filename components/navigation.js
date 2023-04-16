import { useUserContext } from "../context/user";
import { FaTwitter } from "react-icons/fa";

const Navigation = () => {
  const user = useUserContext();

  return (
    <div className="mr-6 md:w-[15%] text-center w-[40%]">
      <div className="font-bold">
        <h1 className="prose text-2xl">{user.login}</h1>
      </div>
      <p>📍 {user.location}</p>
      <div className="flex items-center justify-center">
        <FaTwitter />{" "}
        <a
          className="underline text-blue-400"
          href={`https://twitter.com/${user.twitter_username}`}
          target="_blank"
        >
          {" "}
          @{user.twitter_username}
        </a>
      </div>
    </div>
  );
};

export default Navigation;
