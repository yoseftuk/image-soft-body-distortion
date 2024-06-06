import React from 'react';
import styles from './Sidebar.module.scss';
import img1 from '../../assets/img-1.jpg';
import img2 from '../../assets/img-2.webp';
import img3 from '../../assets/img-3.jpg';
import img4 from '../../assets/img-4.webp';

const imageOptions = [img1, img2, img3, img4];

interface SidebarProps {
    selectedSource: string;

    onSourceChange(src: string): void;
    onReset(): void;
}

function Sidebar({selectedSource, onSourceChange, onReset}: SidebarProps) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {imageOptions.map(option => (
                    <div className={styles.option + (option === selectedSource ? ` ${styles.active}` : '')}
                         onClick={() => onSourceChange(option)}>
                        <img className={styles.img} alt={'source-option'} src={option}/>
                    </div>
                ))}
                <div className={styles.reset_btn} onClick={onReset}>Reset</div>
            </div>
        </div>
    );
}

export default Sidebar;