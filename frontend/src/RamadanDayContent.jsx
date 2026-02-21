// RamadanDayContent.jsx
import { formatTime12h } from "./formatTime";
import "./RamadanDayContent.css";

export default function RamadanDayContent({ sahur, iftar }) {
  return (
    <div className="ramadan-content">
      <div className="sahur-time">{`Sahur: ${formatTime12h(sahur)}`}</div>
      <div className="iftar-time">{`Iftar: ${formatTime12h(iftar)}`}</div>
    </div>
  );
}