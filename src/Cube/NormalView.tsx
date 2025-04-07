import React, { useState } from 'react';
import { Cell, Color, FaceDirection, Square, CubeClient } from '../../clients.ts';
import styles from './NormalView.module.css';

function NormalView(props: {
    cubeData: Square[],
    getColor: (color: Color) => string,
    cubeClient: CubeClient,
    rowCount: number,
    ChangeCubeData: (cubeData: Square[]) => void,
    transformCubeDataToRows: (data: Square) => { [key: number]: Cell[] },
}) {
    const { cubeData, getColor, cubeClient, rowCount, ChangeCubeData, transformCubeDataToRows } = props;

    const [cellToRotate, setCellToRotate] = useState<Cell | null>(null);
    const [startSwipeDirection, setStartSwipeDirection] = useState<number>();
    const [shouldMove, setShouldMove] = useState<boolean>(false);

    const handleOnMouseDown = (e: React.MouseEvent, cell: Cell, square: Square) => {
        e.stopPropagation();
        e.preventDefault();
        setCellToRotate(cell);
        setStartSwipeDirection(square.direction)
        setShouldMove(true);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setShouldMove(false);
    }

    const handleMouseEnter = (e: React.MouseEvent, num: number, endSwipeDirection: FaceDirection) => {
        if (shouldMove) {
            cubeClient.rotateCube({ cubeData, length: rowCount, cell: cellToRotate, startSwipeDirection, endSwipeDirection })
                .then((response) => {
                    ChangeCubeData(response);
                })
                .catch((error) => {
                    console.error('Error fetching cube data:', error);
                });
            setShouldMove(false);
            setCellToRotate(null);
        }
    };

    return <div className={styles.matrix}>
        {cubeData.map((side, index) => (
            <div key={index}
                className={`${styles.face} ${styles['face' + (index + 1)]}`}
                onMouseEnter={(e) => handleMouseEnter(e, index + 1, side.direction)}
            >
                {(() => {
                    const rows = transformCubeDataToRows(side);

                    return Object.keys(rows).map(rowKey => (
                        <div key={rowKey} className={styles.row}>
                            {rows[Number(rowKey)].map(cell => (
                                <div key={cell.column}
                                    style={{ backgroundColor: `${getColor(cell.color)}` }}
                                    className={styles.cell}
                                    first-rotation={cell.firstRotationNumber}
                                    second-rotation={cell.secondRotationNumber}
                                    third-rotation={cell.thirdRotationNumber}
                                    onMouseDown={(e) => handleOnMouseDown(e, cell, side)}
                                    onMouseUp={(e) => handleMouseUp(e)}
                                />
                            ))}
                        </div>
                    )) as React.ReactNode;
                })()}
            </div>
        ))}
    </div>
}

export default NormalView;