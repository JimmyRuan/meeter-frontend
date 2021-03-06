// A mock function to mimic making an async request for data

const axios = require('axios')

export function fetchCount(amount = 1) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );
}

export function fetchMeetings() {
  return axios.get('http://127.0.0.1:3030/meetings');
}

export function cancelMeeting(meetingId, cancelReason) {
  return axios.patch('http://127.0.0.1:3030/meetings/' + meetingId, {
    "meeting": {
      "cancel_reason": cancelReason
    }
  })
}

export function addMeeting(meetingInfo) {
  return axios.post('http://127.0.0.1:3030/meetings/', {
    "meeting": meetingInfo
  })
}
