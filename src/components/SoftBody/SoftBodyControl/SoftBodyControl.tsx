import React from 'react';
import styles from './SoftBodyControl.module.scss';
import {Vector} from "../../../types";

type SoftBodyControlProps = Vector;

function SoftBodyControl({x, y}: SoftBodyControlProps) {
    return (
        <div className={styles.control} style={{left: `${x}px`, top: `${y}px`}}/>
    );
}

export default SoftBodyControl;