import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-date-range'

import format from 'date-fns/format'
import { addDays } from 'date-fns'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const DateRangeComp = ({dateRange, disabled = false}) => {  

  // date state
  const [range, setRange] = useState([
    {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  // open close
  const [open, setOpen] = useState(false)

  // get the target element to toggle 
  const refOne = useRef(null)

  useEffect(() => {
    // event listeners
    document.addEventListener("keydown", hideOnEscape, true)
    document.addEventListener("click", hideOnClickOutside, true)
  }, [])

  useEffect(() => {

    if (!open)
    {
      // dateselected()
    }

  },[open])
  // hide dropdown on ESC press
  const hideOnEscape = (e) => {
    // console.log(e.key)
    if( e.key === "Escape" ) {
      setOpen(false)
      // datechanged()
    }
  }

  // Hide on outside click
  const hideOnClickOutside = (e) => {
    // console.log(refOne.current)
    // console.log(e.target)
    if( refOne.current && !refOne.current.contains(e.target) ) {
       setOpen(false)
      // datechanged()
    }
  }

  const setDateRange = (e) => {
    setRange([e.selection])
    dateRange([e.selection])
  }

  function formatDate(date) {
    // const momentDate = moment.utc(date);
    // const localDate = momentDate.local();
  
    // const formattedDate = localDate.format('YYYY-MM-DD HH:mm A');
    // return formattedDate.split(' ')
    const d = new Date(date)
    const userLocale = navigator.language.substring(0,2);
    const options = {
      year: 'numeric',
      month: userLocale == 'en' ? 'short' : 'long' ,
      day: 'numeric',
    };
    const formattedDate = d.toLocaleDateString(userLocale, options);
    return formattedDate
  
  }
  
  return (
    <div className="calendarWrap w-100">

      <input
        value={`${formatDate(range[0].startDate)} to ${formatDate(range[0].endDate)}`}
        readOnly
        className="form-control h-45 ico-calendar"
        onClick={ () => setOpen(open => !open) }
        style={{fontSize: '13px'}}
        disabled={disabled}
      />

      <div ref={refOne}>
        {open && 
          <DateRange
            onChange={setDateRange}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            direction="horizontal"
            className="calendarElement"
          />
        }
      </div>

    </div>
  )
}

export default DateRangeComp