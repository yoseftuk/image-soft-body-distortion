import React from 'react';
import imageSrc from './assets/img-2.webp';
import styles from './App.module.scss';
import ImageDistortion from "./components/ImageDistortion/ImageDistortion";
import RigitBody from "./components/RigitBody/RigitBody";

const WIDTH = 500, HEIGHT = 500;

function App() {
  return (
    <div className={styles.container}>
     <RigitBody width={WIDTH} height={HEIGHT} densityRatio={.05}>{({controls}) => (
         <ImageDistortion src={imageSrc} width={WIDTH} height={HEIGHT} controls={controls} densityRatio={.05}/>
     )}</RigitBody>
    </div>
  );
}

export default App;
