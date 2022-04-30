export interface IGameRecord {
  textRecord: string;
  id: string;
  type: string;
  description: string;
  bigBlindChips: number;
  timestamp: Date;
  hands: [string, string];
  win: boolean;
  lose: boolean;
  pass: boolean;
  winBigBlinds: number;
}

const extractHand: (line: string) => string = (line) => {
  const extractHandsReg = / \[ (\w{2}) ]$/;
  const regResult = line.match(extractHandsReg);
  if (Array.isArray(regResult)) {
    return regResult[1];
  } else {
    return '';
  }
};

export const convertTextToGameRecord: (textRecord: string) => IGameRecord = (
  textRecord,
) => {
  const lines = textRecord.split('\r\n');
  const dealingIndex = lines.indexOf('Dealing...');
  const summaryIndex = lines.indexOf('*** SUMMARY ***');
  const heroName = textRecord.match(/Dealt to (\w*) \[/)?.[1];
  if (!heroName) {
    throw new Error();
  }
  const heroResult = lines
    .slice(summaryIndex + 1)
    .find((line) => line.includes(heroName));
  if (!heroResult) {
    throw new Error();
  }
  const hands: [string, string] = [
    extractHand(lines[dealingIndex + 1]),
    extractHand(lines[dealingIndex + 2]),
  ];
  const win = heroResult.includes('net ') ?? false;
  const lose = heroResult.includes('lost') ?? false;
  const pass = heroResult.includes("didn't bet") ?? false;

  const bigBlindChips = Number(
    lines[0].split(' - ')[2].match(/^(\d*)\/(\d*) /)?.[2],
  );
  let winBigBlinds = 0;
  if (win) {
    const reg = heroResult.match(/, net ([+\-,\d]+) \(/)?.[1];
    if (!reg) {
      console.error('heroResult', heroResult, reg);
      throw new Error();
    }
    winBigBlinds = Number(reg.replace(',', '')) / bigBlindChips;
  } else if (lose) {
    const reg = heroResult.match(/lost ([,\d]+) \(/)?.[1];
    if (!reg) {
      console.error('heroResult', heroResult, reg);
      throw new Error();
    }
    winBigBlinds = -Number(reg.replace(',', '')) / bigBlindChips;
  }

  return {
    textRecord,
    id: lines[0].split(' - ')[0],
    type: lines[0].split(' - ')[1],
    description: lines[0].split(' - ')[2],
    bigBlindChips,
    timestamp: new Date(lines[0].split(' - ')[3]),
    hands,
    win,
    lose,
    pass,
    winBigBlinds,
  };
};
