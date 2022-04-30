import { ReactElement } from 'react';

export const WinPassLoseIndicator: React.FC<{
  winPercentage: number;
  passPercentage: number;
  losePercentage: number;
}> = ({ winPercentage, passPercentage, losePercentage }) => {
  return (
    <div>
      {winPercentage} {passPercentage} {losePercentage}
    </div>
  );
};
