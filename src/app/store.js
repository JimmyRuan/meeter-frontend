import { configureStore } from '@reduxjs/toolkit';
import meetingReducer from '../features/meeting/meetingSlice';

export const store = configureStore({
  reducer: {
    meeting: meetingReducer,
  },
});
