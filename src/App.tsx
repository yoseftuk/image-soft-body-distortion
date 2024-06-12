import React, {useRef, useState} from 'react';
import imageSrc from './assets/img-2.webp';
import styles from './App.module.scss';
import ImageDistortion from "./components/ImageDistortion/ImageDistortion";
import SoftBody, {SoftBodyHandle} from "./components/SoftBody/SoftBody";
import Sidebar from "./components/Sidebar/Sidebar";

const WIDTH = 500, HEIGHT = 500, DENSITY_RATIO = .05;

function App() {
    const [source, setSource] = useState(imageSrc);
    const softBodyRef = useRef<SoftBodyHandle | null>(null);

    return (
        <div className={styles.container}>
            <Sidebar selectedSource={source} onSourceChange={setSource} onReset={() => softBodyRef.current?.reset()}/>
            <div className={styles.content}>
                <SoftBody width={WIDTH} height={HEIGHT} densityRatio={DENSITY_RATIO} ref={softBodyRef}>{({controls}) => (
                    <ImageDistortion src={source} width={WIDTH} height={HEIGHT} controls={controls}
                                     densityRatio={DENSITY_RATIO}/>
                )}</SoftBody>
                <div className={styles.instructions}>Drag the image to see the effect</div>
            </div>
        </div>
    );
}

export default App;
