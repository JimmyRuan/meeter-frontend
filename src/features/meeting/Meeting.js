import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from './meetingSlice';
import styles from './Meeting.module.css';

export function Meeting() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

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
      {/*<div className={styles.row}>*/}
      {/*  <button*/}
      {/*    className={styles.button}*/}
      {/*    aria-label="Decrement value"*/}
      {/*    onClick={() => dispatch(decrement())}*/}
      {/*  >*/}
      {/*    -*/}
      {/*  </button>*/}
      {/*  <span className={styles.value}>{count}</span>*/}
      {/*  <button*/}
      {/*    className={styles.button}*/}
      {/*    aria-label="Increment value"*/}
      {/*    onClick={() => dispatch(increment())}*/}
      {/*  >*/}
      {/*    +*/}
      {/*  </button>*/}
      {/*</div>*/}
      {/*<div className={styles.row}>*/}
      {/*  <input*/}
      {/*    className={styles.textbox}*/}
      {/*    aria-label="Set increment amount"*/}
      {/*    value={incrementAmount}*/}
      {/*    onChange={(e) => setIncrementAmount(e.target.value)}*/}
      {/*  />*/}
      {/*  <button*/}
      {/*    className={styles.button}*/}
      {/*    onClick={() => dispatch(incrementByAmount(incrementValue))}*/}
      {/*  >*/}
      {/*    Add Amount--*/}
      {/*  </button>*/}
      {/*  <button*/}
      {/*    className={styles.asyncButton}*/}
      {/*    onClick={() => dispatch(incrementAsync(incrementValue))}*/}
      {/*  >*/}
      {/*    Add Async*/}
      {/*  </button>*/}
      {/*  <button*/}
      {/*    className={styles.button}*/}
      {/*    onClick={() => dispatch(incrementIfOdd(incrementValue))}*/}
      {/*  >*/}
      {/*    Add If Odd*/}
      {/*  </button>*/}
      {/*</div>*/}
    </div>
  );
}
