import {createAsyncThunk, createSlice, current} from '@reduxjs/toolkit';
import {fetchMeetings} from './meetingAPI';
import moment from "moment";

const initialState = {
  value: 0,
  meetings: null,
  current_meetings: null,
  selected_meeting: null,
  try_to_cancel: false,
  status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const findMeetingsAsync = createAsyncThunk(
  'meeting/fetchMeetings',
  async () => {
    const response = await fetchMeetings();
    return response.data;
  }
);

export const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    filterMeetings: (state, action) => {

        if(! action.payload.start_day || ! action.payload.end_day){
            return false;
        }

        const startDayMoment = moment(action.payload.start_day, 'YYYY/MM/DD')
        const endDayMoment = moment(action.payload.end_day, 'YYYY/MM/DD')

        const startDay = startDayMoment.startOf('day').subtract(1, 'seconds')
        const endDay = endDayMoment.endOf('day').add(1, 'seconds')

        const currentState = current(state)

       state.current_meetings = currentState.meetings.filter((meeting) => {
           const selectedMeetingStartTime = moment(meeting.start_time)
           return selectedMeetingStartTime.isAfter(startDay) && selectedMeetingStartTime.isBefore(endDay)
       })
    },

    selectMeeting: (state, action) => {
        state.selected_meeting = action.payload
        if(! action.payload){
            state.try_to_cancel = false
        }
    },

    showCancelForm: (state, action)  => {
        state.try_to_cancel = action.payload
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.

  extraReducers: (builder) => {
    builder
      .addCase(findMeetingsAsync.pending, (state) => {
          state.status = 'loading';
      })
      .addCase(findMeetingsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.meetings = action.payload;
        state.current_meetings = action.payload;
      });
  },
});

export const { filterMeetings, selectMeeting, showCancelForm } = meetingSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectAllMeetings = (state) => state.meeting.meetings;
export const selectCurrentMeetings = (state) => state.meeting.current_meetings;
export const getSelectedMeeting = (state) => state.meeting.selected_meeting;
export const getIsCancelling = (state) => state.meeting.try_to_cancel;



export default meetingSlice.reducer;
