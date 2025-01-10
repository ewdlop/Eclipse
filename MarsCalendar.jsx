import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

// Mars calendar constants
const MARS_YEAR = 668.5991 // Mars solar days (sols)
const MONTHS = [
  { name: 'Sagittarius', days: 56 },
  { name: 'Dhanus', days: 56 },
  { name: 'Capricorn', days: 56 },
  { name: 'Makara', days: 56 },
  { name: 'Aquarius', days: 56 },
  { name: 'Kumbha', days: 56 },
  { name: 'Pisces', days: 56 },
  { name: 'Mina', days: 56 },
  { name: 'Aries', days: 56 },
  { name: 'Mesha', days: 56 },
  { name: 'Taurus', days: 56 },
  { name: 'Rishabha', days: 55 }
];

const MarsCalendar = () => {
  const [earthDate, setEarthDate] = useState(new Date());
  const [marsData, setMarsData] = useState(null);

  useEffect(() => {
    calculateMarsDate(earthDate);
  }, [earthDate]);

  const calculateMarsDate = (date) => {
    // Reference date: Mars Sol 1, January 29, 1995 (arbitrary epoch)
    const referenceDate = new Date('1995-01-29');
    const msDifference = date.getTime() - referenceDate.getTime();
    const earthDays = msDifference / (1000 * 60 * 60 * 24);
    
    // Convert to Mars sols (1 sol = 24h 37m 22s = 88,775 seconds)
    const sols = earthDays * (86400 / 88775);
    
    // Calculate Mars year
    const marsYear = Math.floor(sols / MARS_YEAR);
    let remainingSols = sols % MARS_YEAR;
    
    // Find month and day
    let monthIndex = 0;
    while (remainingSols > MONTHS[monthIndex].days) {
      remainingSols -= MONTHS[monthIndex].days;
      monthIndex++;
    }
    
    // Calculate Mars time
    const marsTimeOfDay = (remainingSols % 1) * 24;
    const marsHours = Math.floor(marsTimeOfDay);
    const marsMinutes = Math.floor((marsTimeOfDay - marsHours) * 60);

    setMarsData({
      year: marsYear + 1,
      month: monthIndex,
      sol: Math.floor(remainingSols) + 1,
      hour: marsHours,
      minute: marsMinutes
    });
  };

  return (
    <div class="mars-calendar">
      <div class="earth-input">
        <h2>Earth Date</h2>
        <input 
          type="datetime-local" 
          value={earthDate.toISOString().slice(0, 16)} 
          onChange={(e) => setEarthDate(new Date(e.target.value))}
        />
      </div>

      {marsData && (
        <div class="mars-date">
          <h2>Mars Date</h2>
          <div class="date-display">
            <div class="year-display">
              Year {marsData.year}
            </div>
            <div class="month-display">
              {MONTHS[marsData.month].name}
            </div>
            <div class="sol-display">
              Sol {marsData.sol}
            </div>
            <div class="time-display">
              {marsData.hour.toString().padStart(2, '0')}:
              {marsData.minute.toString().padStart(2, '0')}
            </div>
          </div>

          <div class="calendar-grid">
            {['Sol', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'].map(day => (
              <div class="calendar-header">{day}</div>
            ))}
            
            {Array.from({ length: MONTHS[marsData.month].days }, (_, i) => {
              const dayNum = i + 1;
              const isCurrentSol = dayNum === marsData.sol;
              return (
                <div class={`calendar-day ${isCurrentSol ? 'current-sol' : ''}`}>
                  {dayNum}
                </div>
              );
            })}
          </div>

          <div class="season-info">
            <h3>Current Season</h3>
            {/* Calculate season based on month */}
            {marsData.month <= 2 ? 'Northern Winter' :
             marsData.month <= 5 ? 'Northern Spring' :
             marsData.month <= 8 ? 'Northern Summer' :
             'Northern Fall'}
          </div>
        </div>
      )}

      <style>{`
        .mars-calendar {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .earth-input {
          margin-bottom: 30px;
        }

        input[type="datetime-local"] {
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
          max-width: 300px;
        }

        .mars-date {
          background-color: #fff1e6;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .date-display {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 20px;
          text-align: center;
        }

        .year-display, .month-display, .sol-display, .time-display {
          padding: 10px;
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 4px;
          margin: 20px 0;
        }

        .calendar-header {
          background-color: #b45309;
          color: white;
          padding: 8px;
          text-align: center;
          font-weight: bold;
          border-radius: 4px;
        }

        .calendar-day {
          background-color: #fff;
          padding: 8px;
          text-align: center;
          border-radius: 4px;
          cursor: pointer;
        }

        .current-sol {
          background-color: #b45309;
          color: white;
          font-weight: bold;
        }

        .season-info {
          text-align: center;
          margin-top: 20px;
          padding: 15px;
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        @media (max-width: 600px) {
          .date-display {
            grid-template-columns: 1fr;
          }

          .calendar-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default MarsCalendar;

