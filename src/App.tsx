import React, {useRef, useState} from 'react';
import imageSrc from './assets/img-2.webp';
import styles from './App.module.scss';
import ImageDistortion from "./components/ImageDistortion/ImageDistortion";
import RigitBody, {RigitBodyHandle} from "./components/RigitBody/RigitBody";
import Sidebar from "./components/Sidebar/Sidebar";

const WIDTH = 500, HEIGHT = 500, DENSITY_RATIO = .05;

function App() {
    const [source, setSource] = useState(imageSrc);
    const rigitRef = useRef<RigitBodyHandle | null>(null);

    return (
        <div className={styles.container}>
            <Sidebar selectedSource={source} onSourceChange={setSource} onReset={() => rigitRef.current?.reset()}/>
            <div className={styles.content}>
                <RigitBody width={WIDTH} height={HEIGHT} densityRatio={DENSITY_RATIO} ref={rigitRef}>{({controls}) => (
                    <ImageDistortion src={source} width={WIDTH} height={HEIGHT} controls={controls}
                                     densityRatio={DENSITY_RATIO}/>
                )}</RigitBody>
            </div>
        </div>
    );
}

export default App;
