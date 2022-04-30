import styles from './index.less';
import { Upload, Popover, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { cardValues, PokerMatrics } from '@/component/PokerMatrics';
import { WinPassLoseIndicator } from '@/component/WinPassLoseIndicator';
import { convertTextToGameRecord, IGameRecord } from '@/service/gameRecord';
import { percentageFormatter } from '@/service/utils';

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
    console.log('gameRecords', gameRecords[gameRecords.length - 2]);
    setGameRecords(formattedGameRecords);
  }, [rawText]);

  return (
    <div>
      {gameRecords.length === 0 && (
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      )}
      <div>
        胜/弃/负：
        <PokerMatrics
          cell={cardValues.map((rowCard, rowIndex) =>
            cardValues.map((columnCard, columnIndex) => {
              let totalRecords: IGameRecord[] = [];
              let winRecords: IGameRecord[] = [];
              let passRecords: IGameRecord[] = [];
              let loseRecords: IGameRecord[] = [];
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
              winRecords = totalRecords.filter((record) => record.win);
              passRecords = totalRecords.filter((record) => record.pass);
              loseRecords = totalRecords.filter((record) => record.lose);

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
                      winPercentage={winRecords.length / totalRecords.length}
                      passPercentage={passRecords.length / totalRecords.length}
                      losePercentage={loseRecords.length / totalRecords.length}
                    />
                  </div>
                </Popover>
              );
            }),
          )}
        />
      </div>
    </div>
  );
}
