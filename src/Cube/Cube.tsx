import React, { useState, useEffect, useRef } from 'react';
import { CubeClient, Color, Square } from '../../clients.ts';
import styles from './Cube.module.css';
import infoIcon from '../assets/icons/info.svg';
import FlatView from './FlatView';
import NormalView from './NormalView.tsx';

function Cube() {
    const [rowCount, setRowCount] = useState(3);
    const [cubeData, setCubeData] = useState<Square[]>([]);
    const [isNormalView, setIsNormalView] = useState(true);
    const [isFlatView, setIsFlatView] = useState(false);

    const cubeClient = useRef<CubeClient>(new CubeClient());

    useEffect(() => {
        cubeClient.current.getDefaultCube(rowCount)
            .then((response) => {
                setCubeData(response);
            })
            .catch((error) => {
                console.error('Error fetching cube data:', error);
            });
    }, [rowCount]);

    const ChangeCubeData = (newCubeData: Square[]) => {
        setCubeData(newCubeData);
    }

    const onViewChange = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.currentTarget.id === 'normal-view') {
            setIsNormalView(true);
            setIsFlatView(false);
        } else if (event.currentTarget.id === 'flat-view') {
            setIsNormalView(false);
            setIsFlatView(true);
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowCount(Number(event.target.value));
    };

    const transformCubeDataToRows = (data: Square) => {
        const rows: { [key: number]: Cell[] } = {};

        data.cells.forEach((cell: Cell) => {
            if (!rows[cell.row]) {
                rows[cell.row] = [];
            }
            rows[cell.row].push(cell);
        });

        return rows;
    };

    const getColor = (color: Color) => Object.values(Color)[color] as string;

    return (
        <div className={styles.overview}>
            <div className={styles.description}>
                <span>Number of Rows: </span>
                <select value={rowCount} onChange={handleChange}>
                    {[...Array(8)].map((_, index) => (
                        <option key={index} value={index + 3}>{index + 3}</option>
                    ))}
                </select>
                <button id='normal-view' className={styles.button} onClick={(e) => onViewChange(e)}>Normal View</button>
                <button id='flat-view' className={styles.button} onClick={(e) => onViewChange(e)}>Flat View</button>
                <div className={styles.icon}>
                    <img src={infoIcon} alt='info-icon' />
                    <span className={styles.icon_text}>Hold the mouse button on any of the squares and swipe to rotate.</span>
                </div>
            </div>
            {isNormalView && (
                <NormalView
                    cubeData={cubeData}
                    getColor={getColor}
                    cubeClient={cubeClient.current}
                    rowCount={rowCount}
                    ChangeCubeData={ChangeCubeData}
                    transformCubeDataToRows={transformCubeDataToRows}
                />)
            }
            {isFlatView && (
                <FlatView cubeData={cubeData} getColor={getColor} transformCubeDataToRows={transformCubeDataToRows} />
            )}
        </div>
    );
}

export default Cube;