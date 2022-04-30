import { ReactElement } from 'react';

export const WinPassLoseIndicator: React.FC<{
  winPercentage: number;
  passPercentage: number;
  losePercentage: number;
}> = ({ winPercentage, passPercentage, losePercentage }) => {
  return (
    <div style={{ height: 50, width: 50, display: 'flex' }}>
      <div
        style={{
          background: '#ff7875',
          width: 50 * winPercentage,
          height: 50,
        }}
      />
      <div
        style={{
          background: '#d9d9d9',
          width: 50 * passPercentage,
          height: 50,
        }}
      />
      <div
        style={{
          background: '#73d13d',
          width: 50 * losePercentage,
          height: 50,
        }}
      />
    </div>
  );
};
