import React, {useCallback, useEffect, useRef} from 'react';
import styles from './ImageDistorion.module.css';
import {Vector} from "../../types";

interface ImageDistortionProps {
    src: string;
    width: number;
    height: number;
    controls: Vector[][];
    densityRatio?: number;
}

function ImageDistortion({src, width, height, densityRatio = .1, controls}: ImageDistortionProps) {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const getDefaultsMeta = useCallback(() => {
        const interval = Math.min(width, height) * densityRatio;
        const rowsCount = Math.floor(+(height / interval).toFixed(2));
        const colsCount = Math.floor(+(width / interval).toFixed(2));
        return {rowsCount, colsCount}
    }, [densityRatio, height, width]);

    const drawDistortedImage = useCallback(() => {
        const ctx = canvasRef.current?.getContext?.('2d')!;
        const {rowsCount, colsCount} = getDefaultsMeta();

        function drawTriangle(p1: Vector, p2: Vector, p3: Vector) {
            const x1 = width / colsCount * p1.x, y1 = height / rowsCount * p1.y, x2 = width / colsCount * p2.x, y2 = height / rowsCount * p2.y, x3 = width / colsCount * p3.x, y3 = height / rowsCount * p3.y;
            const {x: x1Hat, y: y1Hat} = controls[p1.y][p1.x], {x: x2Hat, y: y2Hat} = controls[p2.y][p2.x], {x: x3Hat, y: y3Hat} = controls[p3.y][p3.x];

            const matrix = new DOMMatrix();
            matrix.m11 = x1;
            matrix.m12 = x2;
            matrix.m13 = x3;
            matrix.m21 = y1;
            matrix.m22 = y2;
            matrix.m23 = y3;
            matrix.m31 = 1;
            matrix.m32 = 1;
            matrix.m33 = 1;

            const {x: a, y: c, z: e} = new DOMPoint(x1Hat, x2Hat, x3Hat).matrixTransform(matrix.inverse());
            const {x: b, y: d, z: f} = new DOMPoint(y1Hat, y2Hat, y3Hat).matrixTransform(matrix.inverse());

            ctx.beginPath();
            ctx.save();
            ctx.setTransform(a, b, c, d, e, f);

            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.lineTo(x1, y1);
            ctx.clip();
            ctx.drawImage(imgRef.current!, 0, 0, width, height);
            ctx.restore();
            ctx.closePath();
        }

        ctx.clearRect(0, 0, width, height);

        for (let i=1; i<controls.length; i++) {
            for (let j=1; j<controls[i].length; j++) {
                drawTriangle({x: j-1, y: i-1}, {x: j-1, y: i}, {x: j, y: i});
                drawTriangle({x: j-1, y: i-1}, {x: j, y: i-1}, {x: j, y: i});
            }
        }

    }, [controls, getDefaultsMeta, height, width]);

    useEffect(() => {
        imgRef.current = new Image();
        imgRef.current.onload = drawDistortedImage;
        imgRef.current.src = src;
    }, [drawDistortedImage, src]);

    return (
        <div className={styles.container}>
            <canvas className={styles.canvas} width={width} height={height} ref={canvasRef}/>
        </div>
    );
}

export default ImageDistortion;