import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  findMeetingsAsync, selectCurrentMeetings,
} from './meetingSlice';
import styles from './Meeting.module.css';
import moment from "moment";

function convertUtcToLocalTime(utcTimeStr) {
    let utcMoment = moment.utc(utcTimeStr)
    return utcMoment.local().format('ddd DD-MMM-YYYY, hh:mm A')
}

export function Meeting() {
  const currentMeetings = useSelector(selectCurrentMeetings);
  const dispatch = useDispatch();

  useEffect(() => {
    if( ! currentMeetings){
      dispatch(findMeetingsAsync());
    }
  });

  let meetingItems = null
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
                     {convertUtcToLocalTime(meeting.start_time)}
                 </div>
             </div>

             <div>
                 <div className={styles.field_name}>
                     End datetime:
                 </div>
                 <div className={styles.field_value}>
                     {convertUtcToLocalTime(meeting.end_time)}
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
  }

  return (

    <div>
      <h1>Meeting List</h1>
      <div className={styles.wrapper}>
        {meetingItems}
      </div>

    </div>
  );
}
