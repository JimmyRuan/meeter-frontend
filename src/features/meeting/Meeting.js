import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    selectAllMeetings,
    filterMeetings,
    findMeetingsAsync,
    selectCurrentMeetings,
    selectMeeting,
    getSelectedMeeting,
    getIsCancelling,
    showCancelForm,
    cancelMeetingsAsync, addMeetingsAsync,
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

function calendarRanger(meetings,
                        startDay,
                        endDay,
                        setStartDay,
                        setEndDay,
                        submitCalendarRange) {
    const uniqueDates = []
    let dateStr = null

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
            <button className={styles.button}
                onClick={() => {
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
  const allMeetings = useSelector(selectAllMeetings);
  const selectedMeeting = useSelector(getSelectedMeeting)
  const isCancel = useSelector(getIsCancelling);
  let currentMeetings = useSelector(selectCurrentMeetings);
  if(selectedMeeting && currentMeetings){
      currentMeetings = currentMeetings.filter((meeting) => {
          return meeting.id === selectedMeeting.id
      })
  }

  const dispatch = useDispatch();

    const [startDay, setStartDay] = useState();
    const [endDay, setEndDay] = useState();
    const [cancelReason, setCancelReason] = useState();
    const [isMeetingFormShown, setIsMeetingFormShown] = useState(false);

    //new form info
    const [newTitle, setNewTitle] = useState();
    const [newStartTime, setNewStartTime] = useState();
    const [newEndTime, setNewEndTime] = useState();
    const [newAttendeesNumber, setNewAttendeesNumber] = useState()
    const [newAgenda, setNewAgenda] = useState();


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

        dispatch(filterMeetings({start_day: startDay, end_day: endDay}))
    }


  useEffect(() => {
    if( ! currentMeetings){
      dispatch(findMeetingsAsync());
    }
  });


  let meetingItems = null
  let meetingsRange = null
    const editMeeting = () => {
        if(! selectedMeeting){
            return null
        }

        const backDiv = <div className={styles.meeting_back}
                             onClick={() => {
                                 dispatch(selectMeeting(null))
                             }}>
            Back
        </div>;

        let cancelMeetingDiv = null
        if(! selectedMeeting.cancel_reason){
            cancelMeetingDiv =<div className={styles.meeting_cancel} onClick={() => {
                                     if(! isCancel) {
                                         dispatch(showCancelForm(true))
                                     } else {
                                         if(! cancelReason){
                                             alert('Please specify the cancellation reason')
                                             return false
                                         }
                                         dispatch(cancelMeetingsAsync({
                                             meetingId: selectedMeeting.id,
                                             cancelReason: cancelReason
                                         }))
                                     }

                                 }}>
                                Cancel Meeting
                              </div>
        }

        return (<div>
            {backDiv}
            {cancelMeetingDiv}
        </div>);
    }

    const showMeeting = (myMeeting) => {
        if(selectedMeeting){
            return null
        }
        return (
            <div className={styles.meeting_back}
                 onClick={() => {
                     dispatch(selectMeeting(myMeeting))
                 }}>
                Show
            </div>);
    }

    const showCancelReason = () => {
        if(! isCancel || ! selectedMeeting){
            return null
        }
      return (
          <div className={styles.meeting_cancel_container}>
              <div className={styles.meeting_cancel_label}>
                  Please specify meeting cancel reason
              </div>
              <textarea className={styles.meeting_cancel_textarea}
                  onChange={ (e) => {
                      setCancelReason(e.target.value)
                  }}
                  name='cancel_reason' />
          </div>)
    }

    const showCancelMessage = (meeting) => {
         if(meeting.cancel_reason){
             return (
                 <div>
                     <div className={styles.field_name}>
                         Cancellation Reason:
                     </div>
                     <div className={styles.field_value}>
                         {meeting.cancel_reason}
                     </div>
                 </div>
             )
         }

         return null;
    }

    // const [newTitle, setNewTitle] = useState();
    // const [newStartTime, setNewStartTime] = useState();
    // const [newEndTime, setNewEndTime] = useState();
    // const [newAttendeesNumber, setNewAttendeesNumber] = useState()
    // const [newAgenda, setNewAgenda] = useState();

    const showMeetingForm = () => {
        if(isMeetingFormShown){
            return (<div>
                <h2>New Meeting</h2>
                <div className={styles.meeting_form}>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" onChange={(e) => {
                            setNewTitle(e.target.value)
                        }} />
                    </div>

                    <div>
                        <label htmlFor="start_time">Start Time:</label>
                        <input type="text" id="start_time" name="start_time" onChange={(e) => {
                            setNewStartTime(e.target.value)
                        }} />
                    </div>

                    <div>
                        <label htmlFor="end_time">End Time:</label>
                        <input type="text" id="end_time" name="end_time"  onChange={(e) => {
                            setNewEndTime(e.target.value)
                        }} />
                    </div>

                    <div>
                        <label htmlFor="attendees_number">Attendees Number:</label>
                        <input type="text" id="attendees_number" name="attendees_number"  onChange={(e) => {
                            setNewAttendeesNumber(e.target.value)
                        }} />
                    </div>

                    <div>
                        <label htmlFor="agenda">Agenda:</label>
                        <textarea name="agenda"  onChange={(e) => {
                            setNewAgenda(e.target.value)
                        }} />
                    </div>

                    <div className={styles.submit} onClick={() => {
                        const params = {
                            calendar_id: 1,
                            start_time: newStartTime,
                            end_time: newEndTime,
                            title: newTitle,
                            agenda: newAgenda,
                            attendees_number: newAttendeesNumber,
                        }
                        dispatch(addMeetingsAsync(params))
                    }}>
                        <div>Submit</div>
                    </div>
                </div>

                <div className={styles.cancel_new_form}
                    onClick={() => setIsMeetingFormShown(false)}>Cancel</div>
            </div>)
        }

        return null

    }

    if(currentMeetings){
    meetingItems = currentMeetings.map((meeting) =>
      <div key={meeting.id}
           className={styles.meeting_main}>
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

              {showCancelMessage(meeting)}

          </div>
          {showCancelReason()}
          {showMeeting(meeting)}
          {editMeeting(cancelReason)}
      </div>
    );

    meetingsRange = calendarRanger(
        allMeetings,
        startDay,
        endDay,
        setStartDay,
        setEndDay,
        submitCalendarRange
    )

  }

  const meetingForm = showMeetingForm();
  if(meetingForm){
      return meetingForm
  }


  return (

    <div>
      <h1>Meeting List</h1>
        {showMeetingForm()}
        {meetingsRange}
        <div>
            <div onClick={() => {
                setIsMeetingFormShown(true)
            }}
                className={styles.new_meeting_button}>Add New Meeting</div>
        </div>
      <div className={styles.wrapper}>
        {meetingItems}
      </div>

    </div>
  );
}
