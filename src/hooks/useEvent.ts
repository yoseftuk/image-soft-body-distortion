import {useCallback, useRef} from "react";

function useEvent<Args extends unknown[], ReturnType>(cb?: (...args: Args) => ReturnType) {
    const cbRef = useRef(cb);
    cbRef.current = cb;
    
    return useCallback((...args: Args) => cbRef.current?.(...args), []);
}

export default useEvent;