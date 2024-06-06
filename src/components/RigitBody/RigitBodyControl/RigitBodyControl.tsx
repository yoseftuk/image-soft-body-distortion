import React from 'react';
import styles from './RigitBodyControl.module.scss';
import {Vector} from "../../../types";

type RigitBodyControlProps = Vector;

function RigitBodyControl({x, y}: RigitBodyControlProps) {
    return (
        <div className={styles.control} style={{left: `${x}px`, top: `${y}px`}}/>
    );
}

export default RigitBodyControl;