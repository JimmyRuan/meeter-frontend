import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  findMeetingsAsync, selectCurrentMeetings,
} from './meetingSlice';
import styles from './Meeting.module.css';
import moment from "moment";

function convertUtcToLocalTime(utcTimeStr) {
    let utcMoment = moment.utc(utcTimeStr)
    return utcMoment.local()
}

function convertUtcToLocalTimeFormatted(utcTimeStr) {
    return convertUtcToLocalTime(utcTimeStr).format('ddd DD-MMM-YYYY, hh:mm A')
}

// function submitCalendarRange(startDay, endDay){
//     console.log('I am here at 19', [startDay, endDay])
// }

function calendarRanger(meetings,
                        startDay,
                        endDay,
                        setStartDay,
                        setEndDay,
                        submitCalendarRange) {
    const uniqueDates = []
    let dateStr = null

    // console.log('I am here at 26', [startDay, endDay])

    if(meetings){
        for(let index in meetings){
            let meeting = meetings[index]
            dateStr = convertUtcToLocalTime(meeting.start_time).format('YYYY/MM/DD')
            if(! uniqueDates.includes(dateStr)){
                uniqueDates.push(dateStr)
            }
        }
    }

    let dateItems = null
    if(uniqueDates.length > 0){
        dateItems = uniqueDates.map((uniqueDate) =>
            <option value={uniqueDate} key={uniqueDate}>
                {uniqueDate}
            </option>
        )
    }

    return (
        <div className={styles.calendar_ranger_wrapper}>
            <button onClick={() => {
                submitCalendarRange(startDay, endDay)
            }}>Calendar Selection Range</button>
            <div className={styles.calendar_ranger}>
                <div>
                    <label htmlFor="start_day">
                        Starting Day:
                    </label>
                    <select id="start_day" name="start_day"
                            defaultValue=''
                            onChange={ e => { setStartDay(e.target.value) }}>
                        <option value='' key='select-start-day'>
                            Select Start Day
                        </option>
                        {dateItems}
                    </select>
                </div>

                <div>
                    <label htmlFor="end_day">
                        Ending Day:
                    </label>
                    <select id="end_day" name="end_day"
                            defaultValue=''
                            onChange={ e => { setEndDay(e.target.value) }}>
                        <option value='' key='select-end-day'>
                            Select End Day
                        </option>
                        {dateItems}
                    </select>
                </div>
            </div>


        </div>
    )
}

export function Meeting() {
  const currentMeetings = useSelector(selectCurrentMeetings);
  const dispatch = useDispatch();

    const [startDay, setStartDay] = useState();
    const [endDay, setEndDay] = useState();

    const submitCalendarRange = () => {
        if( startDay === '' || endDay === ''){
            alert('Please specify "Start Day" and "End Day" for calendar day range')
            return false;
        }

        const startDayMoment = moment(startDay, 'YYYY/MM/DD')
        const endDayMoment = moment(endDay, 'YYYY/MM/DD')

        if(startDayMoment.isAfter(endDayMoment)){
            alert('"Start Day" must be before "End Day" for the the range')
            return false;
        }


    }


  useEffect(() => {
    if( ! currentMeetings){
      dispatch(findMeetingsAsync());
    }
  });


  let meetingItems = null
  let meetingsRange = null
  if(currentMeetings){
    meetingItems = currentMeetings.map((meeting) =>
      <div key={meeting.id}>
        <h3>{meeting.title}</h3>
         <div className={styles.meeting_wrapper}>
             <div>
                 <div className={styles.field_name}>
                     Start datetime:
                 </div>
                 <div className={styles.field_value}>
                     {convertUtcToLocalTimeFormatted(meeting.start_time)}
                 </div>
             </div>

             <div>
                 <div className={styles.field_name}>
                     End datetime:
                 </div>
                 <div className={styles.field_value}>
                     {convertUtcToLocalTimeFormatted(meeting.end_time)}
                 </div>
             </div>

             <div>
                 <div className={styles.field_name}>
                     Number of attendees:
                 </div>
                 <div className={styles.field_value}>
                     {meeting.attendees_number}
                 </div>
             </div>

             <div>
                 <div className={styles.field_name}>
                     Agenda:
                 </div>
                 <div className={styles.field_value}>
                     {meeting.agenda || 'N/A'}
                 </div>
             </div>

             <div>
                 <div className={styles.field_name}>
                     Status:
                 </div>
                 <div className={styles.field_value}>
                     {meeting.status}
                 </div>
             </div>
         </div>
      </div>
    );

    meetingsRange = calendarRanger(
        currentMeetings,
        startDay,
        endDay,
        setStartDay,
        setEndDay,
        submitCalendarRange
    )

  }

  return (

    <div>
      <h1>Meeting List</h1>
        {meetingsRange}
      <div className={styles.wrapper}>
        {meetingItems}
      </div>

    </div>
  );
}
