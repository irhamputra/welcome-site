import * as React from "react";
import Calendar from "../components/Calendar";
import Buttons from "../components/Buttons";
import { useRouter } from "next/router";
import Image from "next/image";
import me from "../public/me.png";

export default function Home() {
  const { query } = useRouter();

  return (
    <div className="mx-4 my-4 md:m-0 w-full flex justify-center items-center h-full">
      <div className="prose">
        <div className="block md:flex md:justify-center md:items-center md:space-x-2">
          <div className="flex justify-center items-center animate__animated animate__fadeInUp">
            <Image src={me} width={270} height={270} alt="Irham" />
          </div>

          <div>
            <h1 className="animate__animated animate__fadeInUp mb-1">
              Hi! I'm Irham Putra 👋
            </h1>
            <h1 className="animate__animated animate__fadeInUp mb-1">
              Welcome to my personal website
            </h1>
          </div>
        </div>

        <p className="animate__animated animate__fadeInUp animate__delay-1s text-center mt-0">
          {query.q === "meeting" &&
            "Thank you for your time, but currently for concerning the health I just offer an online meeting. when do we want to meet online?"}
          {JSON.stringify(query) === JSON.stringify({}) &&
            "What can I help you?"}
        </p>

        <Buttons />
        <Calendar />
      </div>
    </div>
  );
}
