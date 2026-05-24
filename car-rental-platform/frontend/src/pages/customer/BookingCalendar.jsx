import React, { useState } from 'react';

const DAYS   = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth()    === b.getMonth()    &&
  a.getDate()     === b.getDate();

const BookingCalendar = ({ bookedRanges = [], onRangeSelect }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selStart,  setSelStart]  = useState(null);
  const [selEnd,    setSelEnd]    = useState(null);
  const [error,     setError]     = useState('');

  const isBooked = (d) =>
    bookedRanges.some(r => {
      const s = new Date(r.startDate); s.setHours(0,0,0,0);
      const e = new Date(r.endDate);   e.setHours(0,0,0,0);
      return d >= s && d <= e;
    });

  const overlaps = (s, e) =>
    bookedRanges.some(r => {
      const rs = new Date(r.startDate); rs.setHours(0,0,0,0);
      const re = new Date(r.endDate);   re.setHours(0,0,0,0);
      return s <= re && e >= rs;
    });

  const handleClick = (date) => {
    if (!selStart || (selStart && selEnd)) {
      // first click — set start
      setSelStart(date);
      setSelEnd(null);
      setError('');
      onRangeSelect?.(null, null);
    } else {
      // second click — set end
      if (date <= selStart) {
        setSelStart(date);
        setSelEnd(null);
        return;
      }
      if (overlaps(selStart, date)) {
        setError('Your selection includes already-booked dates. Please choose a different range.');
        setSelStart(null);
        setSelEnd(null);
        onRangeSelect?.(null, null);
      } else {
        setSelEnd(date);
        setError('');
        onRangeSelect?.(selStart, date);
      }
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDay  = new Date(viewYear, viewMonth, 1);
  const lastDay   = new Date(viewYear, viewMonth + 1, 0);
  const blanks    = firstDay.getDay();
  const daysInMonth = lastDay.getDate();


  console.log('BookingCalendar received bookedRanges:', bookedRanges);
  console.log('Sample item:', bookedRanges[0]);
  console.log('startDate field:', bookedRanges[0]?.startDate);
  console.log('endDate field:', bookedRanges[0]?.endDate);

  
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      fontFamily: 'system-ui, sans-serif',
      width: '100%',
      boxSizing: 'border-box'
    }}>

      {/* ── Month navigation ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <button
          type="button"
          onClick={prevMonth}
          style={{
            background:'none', border:'1px solid #d1d5db',
            borderRadius:6, padding:'4px 12px', fontSize:18,
            cursor:'pointer', color:'#374151', lineHeight:1
          }}
        >‹</button>

        <span style={{ fontSize:15, fontWeight:600, color:'#111' }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>

        <button
          type="button"
          onClick={nextMonth}
          style={{
            background:'none', border:'1px solid #d1d5db',
            borderRadius:6, padding:'4px 12px', fontSize:18,
            cursor:'pointer', color:'#374151', lineHeight:1
          }}
        >›</button>
      </div>

      {/* ── Legend ── */}
      <div style={{ display:'flex', gap:16, fontSize:12, color:'#6b7280', marginBottom:12, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ width:12, height:12, borderRadius:3, background:'#fee2e2', border:'1px solid #fca5a5', display:'inline-block' }} />
          Already booked
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ width:12, height:12, borderRadius:3, background:'#dbeafe', display:'inline-block' }} />
          Your selection
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ width:12, height:12, borderRadius:3, background:'#2563eb', display:'inline-block' }} />
          Start / End
        </div>
      </div>

      {/* ── Calendar grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 3,
        width: '100%'
      }}>

        {/* Day name headers */}
        {DAYS.map(d => (
          <div key={d} style={{
            textAlign:'center', fontSize:11,
            fontWeight:600, color:'#9ca3af', padding:'4px 0'
          }}>
            {d}
          </div>
        ))}

        {/* Blank cells before month start */}
        {Array.from({ length: blanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date    = new Date(viewYear, viewMonth, i + 1);
          date.setHours(0, 0, 0, 0);
          const isPast   = date < today;
          const booked   = isBooked(date);
          const isStart  = selStart && sameDay(date, selStart);
          const isEnd    = selEnd   && sameDay(date, selEnd);
          const inRange  = selStart && selEnd && date > selStart && date < selEnd;
          const clickable = !isPast && !booked;

          // Determine background + text color
          let bg        = 'transparent';
          let color     = '#111';
          let textDeco  = 'none';
          let cursor    = 'pointer';
          let fontWeight = 'normal';

          if (isPast) {
            color  = '#d1d5db';
            cursor = 'not-allowed';
          } else if (booked) {
            bg       = '#fee2e2';
            color    = '#991b1b';
            cursor   = 'not-allowed';
            textDeco = 'line-through';
          } else if (isStart || isEnd) {
            bg         = '#2563eb';
            color      = '#fff';
            fontWeight = '700';
          } else if (inRange) {
            bg    = '#dbeafe';
            color = '#1e40af';
          }

          return (
            <div
              key={`day-${i}`}
              onClick={() => clickable && handleClick(date)}
              title={booked ? 'Already booked' : ''}
              style={{
                textAlign:      'center',
                fontSize:        13,
                padding:        '8px 2px',
                borderRadius:    6,
                background:      bg,
                color:           color,
                textDecoration:  textDeco,
                cursor:          cursor,
                fontWeight:      fontWeight,
                userSelect:     'none',
                position:       'relative',
                lineHeight:      1.3,
              }}
              onMouseEnter={e => {
                if (clickable && !isStart && !isEnd && !inRange)
                  e.currentTarget.style.background = '#f3f4f6';
              }}
              onMouseLeave={e => {
                if (clickable && !isStart && !isEnd && !inRange)
                  e.currentTarget.style.background = 'transparent';
              }}
            >
              {i + 1}
              {/* Red dot under booked dates */}
              {booked && (
                <span style={{
                  display:      'block',
                  width:         4,
                  height:        4,
                  borderRadius: '50%',
                  background:   '#dc2626',
                  margin:       '2px auto 0'
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Error message ── */}
      {error && (
        <div style={{
          marginTop:    10,
          background:  '#fee2e2',
          border:      '1px solid #fca5a5',
          borderRadius: 6,
          padding:     '8px 12px',
          fontSize:     13,
          color:       '#991b1b'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;