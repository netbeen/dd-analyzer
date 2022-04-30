import styles from './index.less';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { cardValues, PokerMatrics } from '@/component/PokerMatrics';
import { WinPassLoseIndicator } from '@/component/WinPassLoseIndicator';

const heroName = 'YY';

export default function IndexPage() {
  const [rawText, setRawText] = useState<string>('');
  const [gameRecords, setGameRecords] = useState<any[]>([]);

  const props = {
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

  const extractHand = (line: string) => {
    const extractHandsReg = / \[ (\w{2}) ]$/;
    const regResult = line.match(extractHandsReg);
    if (Array.isArray(regResult)) {
      return regResult[1];
    } else {
      return '';
    }
  };

  useEffect(() => {
    const gameRecords = rawText.split(
      '-----------------------------------------------------\r\n\r\n',
    );
    console.log('gameRecords', gameRecords[gameRecords.length - 2]);
    const formattedGameRecords = gameRecords
      .slice(0, gameRecords.length - 1)
      .map((textRecord) => {
        const lines = textRecord.split('\r\n');
        const dealingIndex = lines.indexOf('Dealing...');
        const summaryIndex = lines.indexOf('*** SUMMARY ***');
        const heroResult = lines
          .slice(summaryIndex + 1)
          .find((line) => line.includes(heroName));
        const hands = [
          extractHand(lines[dealingIndex + 1]),
          extractHand(lines[dealingIndex + 2]),
        ];
        const win = heroResult?.includes('net ');
        const lost = heroResult?.includes('lost');
        const pass = heroResult?.includes("didn't bet");
        return {
          textRecord,
          id: lines[0].split(' - ')[0],
          type: lines[0].split(' - ')[1],
          description: lines[0].split(' - ')[2],
          bigBlindChips: Number(
            lines[0].split(' - ')[2].match(/^(\d*)\/(\d*) /)?.[2],
          ),
          timestamp: new Date(lines[0].split(' - ')[3]),
          dealingIndex,
          hands,
          win,
          lost,
          pass,
          winBigBlinds: 0,
        };
      });
    setGameRecords(formattedGameRecords);
    console.log('formattedGameRecords', formattedGameRecords);
    console.log(
      'formattedGameRecords',
      formattedGameRecords[formattedGameRecords.length - 1],
    );
    console.log('有效手数', formattedGameRecords.length);
    console.log(
      'Win手数',
      formattedGameRecords.filter((item) => item.win).length,
    );
    console.log(
      'Pass手数',
      formattedGameRecords.filter((item) => item.pass).length,
    );
    console.log(
      'Lost手数',
      formattedGameRecords.filter((item) => item.lost).length,
    );
    console.log(
      'Win率',
      formattedGameRecords.filter((item) => item.win).length /
        formattedGameRecords.length,
    );
    console.log(
      'Pass率',
      formattedGameRecords.filter((item) => item.pass).length /
        formattedGameRecords.length,
    );
    console.log(
      'Lost率',
      formattedGameRecords.filter((item) => item.lost).length /
        formattedGameRecords.length,
    );
    console.log(
      formattedGameRecords.filter(
        (item) => !item.lost && !item.pass && !item.win,
      ),
    );
  }, [rawText]);

  return (
    <div>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <div>
        胜/弃/负：
        <PokerMatrics
          cell={cardValues.map((rowCard, rowIndex) =>
            cardValues.map((columnCard, columnIndex) => {
              if (rowIndex < columnIndex) {
                // s
                const records = gameRecords.filter(
                  (gameRecord) =>
                    gameRecord.hands[0].startsWith(cardValues[rowIndex]) &&
                    gameRecord.hands[1].startsWith(cardValues[columnIndex]) &&
                    gameRecord.hands[0][1] === gameRecord.hands[1][1],
                );
                return (
                  <WinPassLoseIndicator
                    winPercentage={
                      records.filter((record) => record.win).length /
                      records.length
                    }
                    passPercentage={
                      records.filter((record) => record.pass).length /
                      records.length
                    }
                    losePercentage={
                      records.filter((record) => record.lost).length /
                      records.length
                    }
                  />
                );
              } else if (rowIndex > columnIndex) {
                const records = gameRecords.filter(
                  (gameRecord) =>
                    gameRecord.hands[0].startsWith(cardValues[rowIndex]) &&
                    gameRecord.hands[1].startsWith(cardValues[columnIndex]) &&
                    gameRecord.hands[0][1] !== gameRecord.hands[1][1],
                );
                return (
                  <WinPassLoseIndicator
                    winPercentage={
                      records.filter((record) => record.win).length /
                      records.length
                    }
                    passPercentage={
                      records.filter((record) => record.pass).length /
                      records.length
                    }
                    losePercentage={
                      records.filter((record) => record.lost).length /
                      records.length
                    }
                  />
                );
              } else {
                // pair
                const records = gameRecords.filter(
                  (gameRecord) =>
                    gameRecord.hands[0].startsWith(cardValues[rowIndex]) &&
                    gameRecord.hands[1].startsWith(cardValues[columnIndex]),
                );
                return (
                  <WinPassLoseIndicator
                    winPercentage={
                      records.filter((record) => record.win).length /
                      records.length
                    }
                    passPercentage={
                      records.filter((record) => record.pass).length /
                      records.length
                    }
                    losePercentage={
                      records.filter((record) => record.lost).length /
                      records.length
                    }
                  />
                );
              }
            }),
          )}
        />
      </div>
    </div>
  );
}
