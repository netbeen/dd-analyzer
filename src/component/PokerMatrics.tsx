import { ReactElement } from 'react';

export const cardValues = [
  'A',
  'K',
  'Q',
  'J',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
];

export const PokerMatrics: React.FC<{ cell: Array<Array<ReactElement>> }> = ({
  cell,
}) => {
  return (
    <div>
      {cardValues.map((rowValue, rowIndex) => (
        <div style={{ display: 'flex' }}>
          {cardValues.map((columnValue, columnIndex) => (
            <div
              style={{
                width: 40,
                height: 40,
                border: '1px solid black',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute' }}>
                {rowIndex < columnIndex ? `${rowValue}${columnValue}s` : ''}
                {rowIndex > columnIndex ? `${columnValue}${rowValue}o` : ''}
                {rowIndex === columnIndex ? `${rowValue}${rowValue}` : ''}
              </div>
              <div>
                {cell[rowIndex]?.[columnIndex] && cell[rowIndex][columnIndex]}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
