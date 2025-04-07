
import { Square, Color, Cell } from '../../clients.ts';
import styles from './FlatView.module.css'

function FlatView(props: {
    cubeData: Square[],
    getColor: (color: Color) => string,
    transformCubeDataToRows: (data: Square) => { [key: number]: Cell[] }
}) {
    const { cubeData, getColor, transformCubeDataToRows } = props;

    return <div className="view">
        {cubeData.map((side, index) => (
            <div key={index} className={`${styles.face} ${styles['face' + (index + 1)]}`}>
                {(() => {
                    const rows = transformCubeDataToRows(side);

                    return Object.keys(rows).map(rowKey => (
                        <div key={rowKey} className={styles.row}>
                            {rows[Number(rowKey)].map(cell => (
                                <div key={cell.column}
                                    style={{ backgroundColor: `${getColor(cell.color)}` }}
                                    className={styles.cell}
                                />
                            ))}
                        </div>
                    )) as React.ReactNode;
                })()}
            </div>
        ))}
    </div>
}

export default FlatView;