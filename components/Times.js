import * as React from "react";

const CET_BASE = 9;
const WIB_BASE = CET_BASE + 6;

const Times = ({ currDay, selectTime }) => {
  const handleTime = (time) => selectTime(time);

  const getTime = React.useCallback(
    ({ cet, wib }) => `${cet} CET / ${wib} WIB`,
    []
  );

  return (
    <>
      <div className="text-center mb-2">We will meet online on {currDay}</div>
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          onClick={() =>
            handleTime(getTime({ cet: CET_BASE + i, wib: WIB_BASE + i }))
          }
          className="hover:shadow-xl bg-transparent border border-black border py-2 px-3 w-full mb-4 rounded-2xl focus:bg-black focus:ring-gray-200 focus:text-white"
          type="button"
        >
          {getTime({ cet: CET_BASE + i, wib: WIB_BASE + i })}
        </button>
      ))}
    </>
  );
};

export default Times;
