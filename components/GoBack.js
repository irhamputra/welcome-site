import { useRouter } from "next/router";

const GoBack = () => {
  const { push } = useRouter();

  return (
    <button
      onClickCapture={() => push("/")}
      type="button"
      className="w-[54%] hover:shadow-xl bg-gray-900 text-white border py-2 px-3 rounded-2xl mt-5 animate__animated animate__fadeInUp animate__delay-2s"
    >
      Cancel
    </button>
  );
};

export default GoBack;
