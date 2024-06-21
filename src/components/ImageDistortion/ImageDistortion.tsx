import React, {useCallback, useId} from 'react';
import styles from './ImageDistorion.module.scss';
import {Vector} from "../../types";
import ImageParticle from "./ImageParticle/ImageParticle";

interface ImageDistortionProps {
    src: string;
    width: number;
    height: number;
    controls: Vector[][];
    densityRatio?: number;
}

function ImageDistortion({src, width, height, densityRatio = .1, controls}: ImageDistortionProps) {
    const filterId = useId();
    const getDefaultsMeta = useCallback(() => {
        const interval = Math.min(width, height) * densityRatio;
        const rowsCount = Math.floor(+(height / interval).toFixed(2));
        const colsCount = Math.floor(+(width / interval).toFixed(2));
        return {rowsCount, colsCount}
    }, [densityRatio, height, width]);

    function renderParticles() {
        const {rowsCount, colsCount} = getDefaultsMeta();
        const res = [];
        const commonProps = {
            width, height, controls, intervalX: width / colsCount, intervalY: height / rowsCount, src
        }

        for (let i = 1; i < controls.length; i++) {
            for (let j = 1; j < controls[i].length; j++) {
                res.push(<ImageParticle key={`${i}-${j}-1`} p1={{x: j - 1, y: i - 1}} p2={{x: j - 1, y: i}}
                                        p3={{x: j, y: i}} {...commonProps}/>);
                res.push(<ImageParticle key={`${i}-${j}-2`} p1={{x: j - 1, y: i - 1}} p2={{x: j, y: i - 1}}
                                        p3={{x: j, y: i}} {...commonProps}/>);
            }
        }

        return res;
    }

    return (
        <svg className={styles.container} viewBox={`0 0 ${width} ${height}`} width={width} height={height}
             xmlns={'http://www.w3.org/2000/svg'}>
            <defs>
                <filter id={filterId}>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
                    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                                   result="goo"/>
                    <feBlend in="SourceGraphic" in2="goo"/>
                </filter>
            </defs>
            <g filter={`url(#${filterId})`}>
                {renderParticles()}
            </g>
        </svg>
    );
}

export default ImageDistortion;