// CalendarDay.tsx
import { toHijri } from "./useIslamic";
import RamadanDayContent from "./RamadanDayContent";
import type { RamadanEntry } from "./Calendar";
import "./CalendarDay.css";

const GREGORIAN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface Cell {
  gregDay: number;
  gregMonth: number;
  gregYear: number;
}

interface CalendarDayProps {
  cell: Cell | null;
  isToday: boolean;
  primaryCalendar: "gregorian" | "hijri";
  ramadanData: RamadanEntry[];
}

export default function CalendarDay({ cell, isToday, primaryCalendar, ramadanData }: CalendarDayProps) {
  if (cell === null) {
    return <div className="day-empty" />;
  }

  const { gregDay, gregMonth, gregYear } = cell;
  const hijri = toHijri(new Date(gregYear, gregMonth, gregDay));
  const currentHijri = toHijri(new Date());

  const primaryNumber   = primaryCalendar === "gregorian" ? gregDay : hijri.day;
  const secondaryNumber = primaryCalendar === "gregorian"
    ? `${hijri.day} ${hijri.monthName}`
    : `${gregDay} ${GREGORIAN_MONTHS[gregMonth]}`;

  let sahur: string | null = null;
  let iftar: string | null = null;
  if (hijri.monthName === "Ramadan" &&
      hijri.year === currentHijri.year &&
      ramadanData &&
      ramadanData.length) {
    sahur = ramadanData[hijri.day - 1].sahur;
    iftar = ramadanData[hijri.day - 1].iftar;
  }

  return (
    <div className={`day-cell ${isToday ? "today" : ""}`}>
      <span className="day-number">{primaryNumber}</span>
      <span className="day-secondary">{secondaryNumber}</span>
      <div className="day-content">
        {hijri.monthName === "Ramadan" && hijri.year === currentHijri.year
          ? <RamadanDayContent sahur={sahur} iftar={iftar} />
          : ""}
      </div>
    </div>
  );
}