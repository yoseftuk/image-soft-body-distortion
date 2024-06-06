import {PointerEvent as ReactPointerEvent, useRef, useState} from 'react';
import useEvent from "./useEvent";
function useDrag({onMouseDown,onMouseUp, onMouseMove}: {onMouseMove: (dx: number, dy: number, e: PointerEvent) => void, onMouseDown?: (e: ReactPointerEvent) => void, onMouseUp?: (e: PointerEvent) => void}) {

    const dragStart = useRef({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState(false);

    const handlePointerDown = useEvent((e: ReactPointerEvent) => {
        e.stopPropagation();
        dragStart.current = {x: e.clientX, y: e.clientY};
        onMouseDown?.(e);

        const target = (e.target as HTMLElement);

        const onPointerMove = (e: PointerEvent) => {
            onMouseMove(e.clientX - dragStart.current.x, e.clientY - dragStart.current.y, e);
            setIsDragging(true);
        }

        const onPointerUp = (e: PointerEvent) => {
            onMouseUp?.(e);
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
            setIsDragging(false);
            target.removeEventListener('pointermove', onPointerMove);
        };

        target.setPointerCapture(e.pointerId);
        target.addEventListener('pointermove', onPointerMove);
        target.addEventListener('pointerup', onPointerUp, {once: true});
    });

    return {
        handlePointerDown,
        isDragging
    }
}

export default useDrag;