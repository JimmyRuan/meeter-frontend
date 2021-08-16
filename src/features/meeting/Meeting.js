import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount, findMeetingsAsync,
} from './meetingSlice';
import styles from './Meeting.module.css';
import {fetchMeetings} from "./meetingAPI";
import {fetchCount} from "../counter/counterAPI";

export function Meeting() {

  // let data = fetchMeetings();



  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  useEffect(() => {
    // Update the document title using the browser API
    //document.title = `You clicked ${count} times`;
    // console.log('I am here at 31');
    dispatch(findMeetingsAsync());
    // console.log('I am here at 33');
  });

  // dispatch(findMeetingsAsync());


  return (
    <div>
      <h1>Meeting List</h1>
      <div className={styles.wrapper}>
        <div>2</div>
        <div>2</div>
        <div>2</div>
        <div>2</div>
        <div>2</div>
        <div>2</div>
        <div>2</div>
        <div>2</div>
        <div>2</div>
        <div>2</div>
      </div>

    </div>
  );
}
