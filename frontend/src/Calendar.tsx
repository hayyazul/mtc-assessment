// Calendar.tsx
import { useEffect, useState } from "react";
import CalendarDay from "./CalendarDay";
import RamadanCountdown from "./RamadanCountdown";
import { toHijri, getHijriMonthBounds, HIJRI_MONTHS } from "./useIslamic";
import "./Calendar.css";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const GREGORIAN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export interface RamadanEntry {
  sahur: string;
  iftar: string;
}

type Cell = { gregDay: number; gregMonth: number; gregYear: number } | null;

export default function Calendar() {
  const today = new Date();

  const [gregMonth, setGregMonth] = useState<number>(today.getMonth());
  const [gregYear,  setGregYear]  = useState<number>(today.getFullYear());
  const [ramadanData, setRamadanData] = useState<RamadanEntry[]>([]);

  useEffect(() => {
    const fetchLocation = async (): Promise<{ lat: number; lon: number }> => {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        return { lat: pos.coords.latitude, lon: pos.coords.longitude };
      } catch {
        console.log("GPS failed, falling back to IP geolocation");
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        return { lat: data.latitude, lon: data.longitude };
      }
    };

    fetchLocation().then(({ lat, lon }) => {
      fetch(`http://localhost:8000/ramadan?lat=${lat}&lon=${lon}`)
        .then((res) => res.json())
        .then((data: RamadanEntry[]) => setRamadanData(data))
        .catch((err) => console.log("Failed to fetch ramadan data:", err));
    });
  }, []);

  const todayHijri = toHijri(today);
  const [hijriMonth, setHijriMonth] = useState<number>(todayHijri.month);
  const [hijriYear,  setHijriYear]  = useState<number>(todayHijri.year);

  const [primaryCalendar, setPrimaryCalendar] = useState<"gregorian" | "hijri">("gregorian");

  function prevGreg() {
    if (gregMonth === 0) { setGregMonth(11); setGregYear(gregYear - 1); }
    else setGregMonth(gregMonth - 1);
  }
  function nextGreg() {
    if (gregMonth === 11) { setGregMonth(0); setGregYear(gregYear + 1); }
    else setGregMonth(gregMonth + 1);
  }

  function prevHijri() {
    if (hijriMonth === 1) { setHijriMonth(12); setHijriYear(hijriYear - 1); }
    else setHijriMonth(hijriMonth - 1);
  }
  function nextHijri() {
    if (hijriMonth === 12) { setHijriMonth(1); setHijriYear(hijriYear + 1); }
    else setHijriMonth(hijriMonth + 1);
  }

  function toggleCalendar() {
    setPrimaryCalendar(primaryCalendar === "gregorian" ? "hijri" : "gregorian");
  }

  const cells: Cell[] = [];

  if (primaryCalendar === "gregorian") {
    const firstDow = new Date(gregYear, gregMonth, 1).getDay();
    const daysInMonth = new Date(gregYear, gregMonth + 1, 0).getDate();
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push({ gregDay: d, gregMonth, gregYear });
  } else {
    const { firstGregorian, lastGregorian } = getHijriMonthBounds(hijriMonth, hijriYear);
    const firstDow = firstGregorian.getDay();
    for (let i = 0; i < firstDow; i++) cells.push(null);
    let cursor = new Date(firstGregorian);
    while (cursor <= lastGregorian) {
      cells.push({
        gregDay:   cursor.getDate(),
        gregMonth: cursor.getMonth(),
        gregYear:  cursor.getFullYear(),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  while (cells.length % 7 !== 0) cells.push(null);

  const headerTitle = primaryCalendar === "gregorian"
    ? `${GREGORIAN_MONTHS[gregMonth]} ${gregYear}`
    : `${HIJRI_MONTHS[hijriMonth - 1]} ${hijriYear} AH`;

  const onPrev = primaryCalendar === "gregorian" ? prevGreg : prevHijri;
  const onNext = primaryCalendar === "gregorian" ? nextGreg : nextHijri;

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <button onClick={onPrev} className="nav-button">‹</button>
        <h2>{headerTitle}</h2>
        <button onClick={onNext} className="nav-button">›</button>
      </div>

      <div className="calendar-toggle-row">
        <button onClick={toggleCalendar} className="toggle-button">
          Switch to {primaryCalendar === "gregorian" ? "Hijri" : "Gregorian"}
        </button>
      </div>

      {!(ramadanData && ramadanData.length) ? (
        <div className="calendar-loading">Loading...</div>
      ) : (
        <div className="calendar-grid">
          {DAYS_OF_WEEK.map((label) => (
            <div key={label} className="day-label">{label}</div>
          ))}
          {cells.map((cell, index) => {
            const isToday = cell !== null &&
              cell.gregDay   === today.getDate() &&
              cell.gregMonth === today.getMonth() &&
              cell.gregYear  === today.getFullYear();

            return (
              <CalendarDay
                key={index}
                cell={cell}
                isToday={isToday}
                primaryCalendar={primaryCalendar}
                ramadanData={ramadanData}
              />
            );
          })}
        </div>
      )}
      <RamadanCountdown ramadanData={ramadanData} />
    </div>
  );
}