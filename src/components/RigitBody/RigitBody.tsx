import React, {ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import styles from './RigitBody.module.scss';
import RigitBodyControl from "./RigitBodyControl/RigitBodyControl";
import {Vector} from "../../types";
import RigitVertex from "./rigitVertex";
import useDrag from "../../hooks/useDrag";

interface RigitBodyProps {
    width: number;
    height: number;
    densityRatio?: number;
    isDebug?: boolean;
    children: (props: {controls: Vector[][]}) => ReactNode;
}

function RigitBody({width, height, densityRatio = .1, isDebug, children}: RigitBodyProps) {

    const isMounted = useRef(true);
    const getDefaultsMeta = useCallback(() => {
        const interval = Math.min(width, height) * densityRatio;
        const rowsCount = Math.floor(+(height / interval).toFixed(2));
        const colsCount = Math.floor(+(width / interval).toFixed(2));
        return {rowsCount, colsCount}
    }, [densityRatio, height, width]);

    const getDefaultControls = useCallback(() => {
        const {rowsCount, colsCount} = getDefaultsMeta();
        const distanceX = width / colsCount, distanceY = height / rowsCount,
            distanceDiagonal = Math.sqrt(distanceX ** 2 + distanceY ** 2), bigDiagonal = Math.sqrt(width**2+height**2);
        const controls = Array.from(Array(rowsCount + 1), (_, i) => Array.from(Array(colsCount + 1), (_, j) => new RigitVertex(width / colsCount * j, height / rowsCount * i, i, j)));
        for (let i = 1; i < controls.length; i++) {
            for (let j = 1; j < controls.length; j++) {
                const force = 1;//(2-Math.abs((i - rowsCount / 2)/rowsCount*2)) * .5;
                controls[i - 1][j - 1].linkVertex(controls[i - 1][j], distanceX, force);
                controls[i - 1][j].linkVertex(controls[i - 1][j - 1], distanceX, force);
                controls[i - 1][j].linkVertex(controls[i][j], distanceY, force);
                controls[i][j].linkVertex(controls[i - 1][j], distanceY, force);
                controls[i - 1][j - 1].linkVertex(controls[i][j], distanceDiagonal, force);
                controls[i][j].linkVertex(controls[i - 1][j - 1], distanceDiagonal, force);
                controls[i][j-1].linkVertex(controls[i - 1][j], distanceDiagonal, force);
                controls[i-1][j].linkVertex(controls[i][j-1], distanceDiagonal, force);
                controls[i - 1][j - 1].linkVertex(controls[i][j - 1], distanceY, force);
                controls[i][j - 1].linkVertex(controls[i - 1][j - 1], distanceY, force);
                controls[i][j - 1].linkVertex(controls[i][j], distanceX, force);
                controls[i][j].linkVertex(controls[i][j - 1], distanceX, force);
            }
        }

        controls[0][0].linkVertex(controls[0][controls[0].length-1], width);
        controls[0][controls[0].length-1].linkVertex(controls[0][0], width);
        controls[0][0].linkVertex(controls[controls.length-1][0], height);
        controls[controls.length-1][0].linkVertex(controls[0][0], height);
        controls[controls.length-1][0].linkVertex(controls[controls.length-1][controls[0].length-1], width);
        controls[controls.length-1][controls[0].length-1].linkVertex(controls[controls.length-1][0], width);
        controls[controls.length-1][controls[0].length-1].linkVertex(controls[0][controls[0].length-1], height);
        controls[0][controls[0].length-1].linkVertex(controls[controls.length-1][controls[0].length-1], height);
        controls[0][0].linkVertex(controls[controls.length-1][controls[0].length-1], bigDiagonal);
        controls[controls.length-1][controls[0].length-1].linkVertex(controls[0][0], bigDiagonal);
        controls[controls.length-1][0].linkVertex(controls[0][controls[0].length-1], bigDiagonal);
        controls[0][controls[0].length-1].linkVertex(controls[controls.length-1][0], bigDiagonal);

        return controls;
    }, [getDefaultsMeta, height, width]);

    const [controls, setControls] = useState<RigitVertex[][]>(getDefaultControls());

    const dragStart = useRef<Vector[]>([]);
   const {handlePointerDown, isDragging} = useDrag({
       onMouseDown() {
           const {rowsCount, colsCount} = getDefaultsMeta();
           dragStart.current = [
               {...controls[rowsCount/2][colsCount/2].position},
               {...controls[0][0].position},
               {...controls[0][colsCount].position},
               {...controls[rowsCount][0].position},
               {...controls[rowsCount][colsCount].position},
           ];
       },
       onMouseMove(dx, dy) {
           const {rowsCount, colsCount} = getDefaultsMeta();
           controls[0][0].position = {x: dragStart.current[1].x+dx, y: dragStart.current[1].y+dy};
           controls[0][colsCount].position = {x: dragStart.current[2].x+dx, y: dragStart.current[2].y+dy};
           controls[rowsCount][0].position = {x: dragStart.current[3].x+dx, y: dragStart.current[3].y+dy};
           controls[rowsCount][colsCount].position = {x: dragStart.current[4].x+dx, y: dragStart.current[4].y+dy};
       }
   });
    
    useEffect(() => {
        let key = {current: 1}

        function frame() {
            if(!key.current) return;

            const {rowsCount, colsCount} = getDefaultsMeta();
            const isStatic = (i: number, j: number) => (i===0 && j===0) || (i === 0 && j === colsCount) || (j === 0 && i === rowsCount) || (i === rowsCount && j === colsCount);

            setControls(oldControls => {
                for (const [i, row] of oldControls.entries()) {
                    for (const [j, vertex] of row.entries()) {
                        if (isStatic(i, j)) continue;
                        vertex.update();
                    }
                }

                for (const [i, row] of oldControls.entries()) {
                    for (const [j, vertex] of row.entries()) {
                        if (isStatic(i, j)) continue;
                        vertex.move();
                    }
                }

                return [...oldControls];
            });

            requestAnimationFrame(() => {
                frame()
            });
        }

        frame();
        return () => {
            key.current = 0;
        }
    }, [getDefaultsMeta]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, []);

    return (
        <div className={styles.container} onPointerDown={handlePointerDown} style={{width: `${width}px`, height: `${height}px`, cursor: isDragging ? 'grabbing' : 'grab'}}>
            {children({controls: controls.map(row => row.map(v => ({x: v.position.x, y: v.position.y})))})}
            {isDebug ? controls.map((row, i) => row.map((vertex, j) => <RigitBodyControl key={`${i}-${j}`}
                                                                                         x={vertex.position.x}
                                                                                         y={vertex.position.y}/>)) : null}
        </div>
    );
}

export default RigitBody;