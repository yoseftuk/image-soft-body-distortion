import React, {useId, useMemo} from 'react';
import {Vector} from "../../../types";

interface ImageParticleProps {
    p1: Vector;
    p2: Vector;
    p3: Vector;
    controls: Vector[][];
    intervalX: number;
    intervalY: number;
    src: string;
    width: number;
    height: number;
}

function ImageParticle({p1, p2, p3, controls, intervalX, intervalY, src, width, height}: ImageParticleProps) {
    const clipId = useId();
    const {transformMatrix, clipPath} = useMemo(() => {
        const x1 = intervalX * p1.x, y1 = intervalY * p1.y, x2 = intervalX * p2.x, y2 = intervalY * p2.y, x3 = intervalX * p3.x, y3 = intervalY * p3.y;
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
        
        const transformMatrix = new DOMMatrix([a, b, c, d, e, f]).toString();
        const clipPath = `M${x1} ${y1}L${x2} ${y2}L${x3} ${y3}Z`;
        
        return {transformMatrix, clipPath};
        
    },[intervalX, p1.x, p1.y, intervalY, p2.x, p2.y, p3.x, p3.y, controls]);

    return (
        <g transform={transformMatrix.toString()}>
            <clipPath  id={clipId}>
                <path d={clipPath}/>
            </clipPath>
            <image width={width} height={height} href={src} clipPath={`url(#${clipId})`}/>
        </g>
    );
}

export default ImageParticle;