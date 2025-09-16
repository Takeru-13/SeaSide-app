import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function HomePage() {
  const [value, setValue] = useState<Date>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());

  // 日付を YYYY-MM-DD にするユーティリティ
  function ymd(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return (
    <main style={{ maxWidth: 520, margin: '0 auto', padding: 12 }}>
      <h1 style={{ fontSize: 16, margin: '8px 0' }}>
        {activeStartDate.getFullYear()}年 {activeStartDate.getMonth() + 1}月
      </h1>

      <Calendar
        locale="ja-JP"
        showNeighboringMonth={true}             // 前後月の日も表示
        activeStartDate={activeStartDate}      // 表示中の月
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setActiveStartDate(activeStartDate);
        }}
        onChange={(v) => setValue(v as Date)}  // 選択日更新
        value={value}
        onClickDay={(date) => {
          alert(`${ymd(date)} をクリック`);
          
        }}
        maxDetail="month"
      />

      <style>{`
        .react-calendar {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
        }
        .react-calendar__tile--now {
          outline: 2px solid #7ec8ff;
          outline-offset: -2px;
          border-radius: 10px;
        }
          .react-calendar__navigation__label {
  pointer-events: none;
}
      `}</style>
    </main>
  );
}
