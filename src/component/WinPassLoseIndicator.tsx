import { ReactElement } from 'react';

export const WinPassLoseIndicator: React.FC<{
  winPercentage: number;
  passPercentage: number;
  losePercentage: number;
}> = ({ winPercentage, passPercentage, losePercentage }) => {
  return (
    <div style={{ height: 40, width: 40, display: 'flex' }}>
      <div
        style={{
          background: '#ff7875',
          width: 40 * winPercentage,
          height: 40,
        }}
      />
      <div
        style={{
          background: '#d9d9d9',
          width: 40 * passPercentage,
          height: 40,
        }}
      />
      <div
        style={{
          background: '#73d13d',
          width: 40 * losePercentage,
          height: 40,
        }}
      />
    </div>
  );
};
