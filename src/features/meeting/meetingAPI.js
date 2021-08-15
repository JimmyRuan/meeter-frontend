// A mock function to mimic making an async request for data
import {createAsyncThunk} from "@reduxjs/toolkit";

export function fetchCount(amount = 1) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );
}

// export function fetchMeetings() {
//   return new Promise((resolve) =>
//       // setTimeout(() => resolve({ data: amount }), 500)
//   );
// }

// export const fetchMeetings = createAsyncThunk('posts/fetchPosts', async () => {
//   const response = await client.get('/fakeApi/posts')
//   return response.posts
// })
