// RamadanDayContent.tsx
import { formatTime12h } from "./formatTime";
import "./RamadanDayContent.css";

interface RamadanDayContentProps {
  sahur: string | null;
  iftar: string | null;
}

export default function RamadanDayContent({ sahur, iftar }: RamadanDayContentProps) {
  return (
    <div className="ramadan-content">
      <div className="sahur-time">{`Sahur: ${formatTime12h(sahur)}`}</div>
      <div className="iftar-time">{`Iftar: ${formatTime12h(iftar)}`}</div>
    </div>
  );
}