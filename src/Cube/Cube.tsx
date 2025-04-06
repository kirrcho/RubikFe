import React, { useState, useEffect, useRef } from 'react';
import { CubeClient, Cell, Color, FaceDirection, Square } from '../../clients.ts';
import './Cube.css';

function Cube() {
    const [rowCount, setRowCount] = useState(3);
    const [cubeData, setCubeData] = useState<Square[]>([]);
    const [cellToRotate, setCellToRotate] = useState<Cell | null>(null);
    const [startSwipeDirection, setStartSwipeDirection] = useState<number>();
    const [shouldMove, setShouldMove] = useState<boolean>(false);

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

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowCount(Number(event.target.value));
    };

    const handleCellClick = (e: React.MouseEvent, cell: Cell, square: Square) => {
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

    const handleMouseLeave = (e: React.MouseEvent, num: number, endSwipeDirection: FaceDirection) => {
        if (shouldMove) {
            cubeClient.current.rotateCube({ cubeData, length: rowCount, cell: cellToRotate, startSwipeDirection, endSwipeDirection })
                .then((response) => {
                    setCubeData(response);
                })
                .catch((error) => {
                    console.error('Error fetching cube data:', error);
                });
            console.log(num);
            setShouldMove(false);
            setCellToRotate(null);
        }
    };

    const transformCubeDataToRows = (data: Square, index: number) => {
        const rows: { [key: number]: Cell[] } = {};

        data.cells.forEach((cell: Cell) => {
            if (!rows[cell.row]) {
                rows[cell.row] = [];
            }
            rows[cell.row].push(cell);
        });

        const style = (color: Color) => ({ backgroundColor: `${Object.values(Color)[color]}` })

        return Object.keys(rows).map(rowKey => (
            <div key={rowKey} className="row">
                {rows[Number(rowKey)].map(cell => (
                    <div key={cell.column}
                        style={style(cell.color)}
                        className="cell"
                        id={index * rowCount * rowCount + (cell.row * rowCount + cell.column)}
                        first-rotation={cell.firstRotationNumber}
                        second-rotation={cell.secondRotationNumber}
                        third-rotation={cell.thirdRotationNumber}
                        onMouseDown={(e) => handleCellClick(e, cell, data)}
                        onMouseUp={(e) => handleMouseUp(e)}
                    />
                ))}
            </div>
        ));
    };

    return (
        <div className='overview'>
            <div className='description'>
                <span>Number of Rows:</span>
                <select value={rowCount} onChange={handleChange}>
                    {[...Array(8)].map((_, index) => (
                        <option key={index} value={index + 3}>{index + 3}</option>
                    ))}
                </select>
                <span className='icon'>
                    <svg fill="#ffffff" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 400 400" xmlSpace="preserve">
                        <g>
                            <g>
                                <path d="M199.996,0C89.719,0,0,89.72,0,200c0,110.279,89.719,200,199.996,200C310.281,400,400,310.279,400,200
			                    C400,89.72,310.281,0,199.996,0z M199.996,373.77C104.187,373.77,26.23,295.816,26.23,200
			                    c0-95.817,77.957-173.769,173.766-173.769c95.816,0,173.772,77.953,173.772,173.769
			                    C373.769,295.816,295.812,373.77,199.996,373.77z"/>
                                <path d="M199.996,91.382c-35.176,0-63.789,28.616-63.789,63.793c0,7.243,5.871,13.115,13.113,13.115
			                    c7.246,0,13.117-5.873,13.117-13.115c0-20.71,16.848-37.562,37.559-37.562c20.719,0,37.566,16.852,37.566,37.562
			                    c0,20.714-16.849,37.566-37.566,37.566c-7.242,0-13.113,5.873-13.113,13.114v45.684c0,7.243,5.871,13.115,13.113,13.115
			                    s13.117-5.872,13.117-13.115v-33.938c28.905-6.064,50.68-31.746,50.68-62.427C263.793,119.998,235.176,91.382,199.996,91.382z"/>
                                <path d="M200.004,273.738c-9.086,0-16.465,7.371-16.465,16.462s7.379,16.465,16.465,16.465c9.094,0,16.457-7.374,16.457-16.465
			                    S209.098,273.738,200.004,273.738z"/>
                            </g>
                        </g>
                    </svg>
                    <span className='icon-text'>Hold the mouse button on any of the squares and swipe to rotate.</span>
                </span>
            </div>
            <div className='matrix'>
                {cubeData.map((side, index) => (
                    <div key={index} className={`face face${index + 1}`}
                        onMouseEnter={(e) => handleMouseLeave(e, index + 1, side.direction)}>
                        {transformCubeDataToRows(side, index)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cube;