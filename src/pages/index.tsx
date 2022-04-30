import styles from './index.less';
import { Upload, Popover, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { cardValues, PokerMatrics } from '@/component/PokerMatrics';
import { WinPassLoseIndicator } from '@/component/WinPassLoseIndicator';
import { convertTextToGameRecord, IGameRecord } from '@/service/gameRecord';
import { numberFormatter, percentageFormatter } from '@/service/utils';

export default function IndexPage() {
  const [rawText, setRawText] = useState<string>('');
  const [gameRecords, setGameRecords] = useState<any[]>([]);

  const uploadProps = {
    name: 'file',
    listType: 'txt',
    beforeUpload(file: any) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          setRawText(reader.result as string);
        };
      });
    },
  };

  useEffect(() => {
    const gameRecords = rawText.split(
      '-----------------------------------------------------\r\n\r\n',
    );
    const formattedGameRecords = gameRecords
      .slice(0, gameRecords.length - 1)
      .map((textRecord) => {
        return convertTextToGameRecord(textRecord);
      });
    // console.log('gameRecords', gameRecords[gameRecords.length - 27], formattedGameRecords[formattedGameRecords.length - 26]);
    setGameRecords(formattedGameRecords);
  }, [rawText]);

  const specifyHandsGameRecords: IGameRecord[][][] = useMemo(() => {
    return cardValues.map((rowCard, rowIndex) =>
      cardValues.map((columnCard, columnIndex) => {
        let totalRecords: IGameRecord[];
        if (rowIndex < columnIndex) {
          totalRecords = gameRecords.filter(
            (gameRecord) =>
              gameRecord.hands[0].startsWith(cardValues[rowIndex]) &&
              gameRecord.hands[1].startsWith(cardValues[columnIndex]) &&
              gameRecord.hands[0][1] === gameRecord.hands[1][1],
          );
        } else if (rowIndex > columnIndex) {
          totalRecords = gameRecords.filter(
            (gameRecord) =>
              gameRecord.hands[0].startsWith(cardValues[rowIndex]) &&
              gameRecord.hands[1].startsWith(cardValues[columnIndex]) &&
              gameRecord.hands[0][1] !== gameRecord.hands[1][1],
          );
        } else {
          totalRecords = gameRecords.filter(
            (gameRecord) =>
              gameRecord.hands[0].startsWith(cardValues[rowIndex]) &&
              gameRecord.hands[1].startsWith(cardValues[columnIndex]),
          );
        }
        return totalRecords;
      }),
    );
  }, [gameRecords]);

  return (
    <div style={{ display: 'flex' }}>
      {gameRecords.length === 0 && (
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      )}
      {gameRecords.length > 0 && (
        <div>
          胜率表：
          <PokerMatrics
            cell={cardValues.map((rowCard, rowIndex) =>
              cardValues.map((columnCard, columnIndex) => {
                const totalRecords =
                  specifyHandsGameRecords[rowIndex][columnIndex];
                const winRecords = totalRecords.filter((record) => record.win);
                const passRecords = totalRecords.filter(
                  (record) => record.pass,
                );
                const loseRecords = totalRecords.filter(
                  (record) => record.lose,
                );

                return (
                  <Popover
                    content={
                      <div>
                        <div>
                          胜:{winRecords.length} 胜率:
                          {percentageFormatter.format(
                            winRecords.length / totalRecords.length,
                          )}
                        </div>
                        <div>
                          弃:{passRecords.length} 弃率:
                          {percentageFormatter.format(
                            passRecords.length / totalRecords.length,
                          )}
                        </div>
                        <div>
                          负:{loseRecords.length} 负率:
                          {percentageFormatter.format(
                            loseRecords.length / totalRecords.length,
                          )}
                        </div>
                      </div>
                    }
                    trigger="hover"
                  >
                    <div>
                      <WinPassLoseIndicator
                        winPercentage={
                          winRecords.length /
                          specifyHandsGameRecords[rowIndex][columnIndex].length
                        }
                        passPercentage={
                          passRecords.length /
                          specifyHandsGameRecords[rowIndex][columnIndex].length
                        }
                        losePercentage={
                          loseRecords.length /
                          specifyHandsGameRecords[rowIndex][columnIndex].length
                        }
                      />
                    </div>
                  </Popover>
                );
              }),
            )}
          />
        </div>
      )}
      {gameRecords.length > 0 && (
        <div>
          每手盈利表(BB)：
          <PokerMatrics
            cell={cardValues.map((rowCard, rowIndex) =>
              cardValues.map((columnCard, columnIndex) => {
                const totalRecords =
                  specifyHandsGameRecords[rowIndex][columnIndex];
                const profitPerHand =
                  totalRecords
                    .map((record) => record.winBigBlinds)
                    .reduce((pre, record) => pre + record, 0) /
                  totalRecords.length;

                let fontStyle: {
                  color: string;
                  fontWeight?: string;
                } = {
                  color: '#bfbfbf',
                };
                if (profitPerHand > 0.1 && profitPerHand < 5) {
                  fontStyle = {
                    color: '#ff7875',
                  };
                } else if (profitPerHand > 5) {
                  fontStyle = {
                    color: '#f5222d',
                    fontWeight: 'bold',
                  };
                } else if (profitPerHand < -0.1 && profitPerHand >= -5) {
                  fontStyle = {
                    color: '#73d13d',
                  };
                } else if (profitPerHand < -5) {
                  fontStyle = {
                    color: '#52c41a',
                    fontWeight: 'bold',
                  };
                }

                return (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      ...fontStyle,
                    }}
                  >
                    {numberFormatter.format(profitPerHand)}
                  </div>
                );
              }),
            )}
          />
        </div>
      )}
    </div>
  );
}
