import * as React from "react";
import ReactCalendar from "react-calendar";
import { useRouter } from "next/router";
import GoBack from "./GoBack";
import Times from "./Times";

const Calendar = () => {
  const [date, setChangeDate] = React.useState(new Date());
  const [selectCurrDay, setSelectCurrDay] = React.useState("");
  const [showTime, setShowTime] = React.useState(false);
  const [selectTime, setSelectTime] = React.useState("");
  const ref = React.useRef();
  const { query } = useRouter();

  const handleMeeting = (val) => {
    setSelectCurrDay(new Date(val).toDateString());
    setShowTime(true);
    setSelectTime("");
  };

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowTime(false);
        setSelectCurrDay("");
        setSelectTime("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  if (!query?.q) return null;

  return (
    <>
      <div className="mt-4 flex justify-center space-x-4" ref={ref}>
        <ReactCalendar
          onChange={setChangeDate}
          minDate={new Date()}
          defaultView="month"
          onClickDay={handleMeeting}
          value={date}
          tileClassName="rounded-3xl"
          className="animate__animated animate__fadeInUp animate__delay-1s"
        />
        {showTime && (
          <div className="w-[50%]">
            <Times currDay={selectCurrDay} selectTime={setSelectTime} />
          </div>
        )}
      </div>

      <div className="flex justify-center items-center">
        {selectCurrDay && selectTime ? (
          `${selectCurrDay}, ${selectTime}`
        ) : (
          <GoBack />
        )}
      </div>
    </>
  );
};

export default Calendar;
