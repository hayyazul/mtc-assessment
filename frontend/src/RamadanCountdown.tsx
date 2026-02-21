// RamadanCountdown.tsx
import { useEffect, useState } from "react";
import { toHijri } from "./useIslamic";
import { formatTime12h } from "./formatTime";
import type { RamadanEntry } from "./Calendar";

function parseTime(timeStr: string | null, dayOffset: number = 0): Date | null {
  if (!timeStr) return null;
  const parts = timeStr.match(/(\d+):(\d+)(?::(\d+))?\s*(AM|PM)?/i);
  if (!parts) return null;
  let hours = parseInt(parts[1], 10);
  const minutes = parseInt(parts[2], 10);
  const seconds = parseInt(parts[3] || "0", 10);
  const meridiem = parts[4];
  if (meridiem) {
    if (meridiem.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;
  }
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, minutes, seconds, 0);
  return date;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

interface RamadanCountdownProps {
  ramadanData: RamadanEntry[];
}

export default function RamadanCountdown({ ramadanData }: RamadanCountdownProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    if (!ramadanData || !ramadanData.length) return;

    const today = new Date();
    const todayHijri = toHijri(today);
    if (todayHijri.monthName !== "Ramadan") {
      setCountdown(null);
      return;
    }

    const todayData = ramadanData[todayHijri.day - 1];
    const tomorrowData: RamadanEntry | null = todayHijri.day === ramadanData.length
      ? null
      : ramadanData[todayHijri.day];
    if (!todayData) return;

    const { sahur, iftar } = todayData;
    const tomorrowSahur: string | null = tomorrowData ? tomorrowData.sahur : null;

    function compute() {
      const now = new Date();
      const sahurTime = parseTime(sahur);
      const iftarTime = parseTime(iftar);
      const tomorrowSahurTime = parseTime(tomorrowSahur, 1);

      if (!sahurTime || !iftarTime) return;

      const msToSahur = sahurTime.getTime() - now.getTime();
      const msToIftar = iftarTime.getTime() - now.getTime();

      if (msToSahur > 0) {
        setLabel(`Time until Sahur (${formatTime12h(sahur)})`);
        setCountdown(msToSahur);
      } else if (msToIftar > 0) {
        setLabel(`Time until Iftar (${formatTime12h(iftar)})`);
        setCountdown(msToIftar);
      } else if (tomorrowSahurTime) {
        setLabel(`Time until Sahur (${formatTime12h(tomorrowSahur)})`);
        setCountdown(tomorrowSahurTime.getTime() - now.getTime());
      } else {
        setLabel("Ramadan has ended");
        setCountdown(0);
      }
    }

    compute();
    const interval = setInterval(compute, 1000);
    return () => clearInterval(interval);
  }, [ramadanData]);

  if (countdown === null) return null;

  return (
    <div className="ramadan-countdown">
      <span className="countdown-label">{label}</span>
      <span className="countdown-timer">{formatCountdown(countdown)}</span>
    </div>
  );
}