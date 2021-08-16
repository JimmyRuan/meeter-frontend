import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import meetingReducer from '../features/meeting/meetingSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    meeting: meetingReducer,
  },
});
