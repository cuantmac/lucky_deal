import {ErrorMsg} from '@src/helper/message';
import {wait} from '@src/helper/helper';

export interface Data {
  height: number;
  color: string;
  text: string;
}

const texts = [
  'qweuy qweij qwehj',
  'qqgg qjj asdjashd adhjakjd asdjaksdj asdjaksd asdjsjdasd',
  'aaa',
  'basd abbasd asdjh asdbjh asdb',
  'gbha aaa',
  'asdajiok aksdjsajd asjdnajsnd asdjns asndjsd asdj asdj asdasd asdsd as d sd sd s a sds dsd a dasd  asd asd asd ad',
  'asd sa asdasdj ajd asjdnajsnd asdjns asndjsd asdj asdj asdasd jd asjdnajsnd asdjns asndjsd asdj asdj asdasdjd asjdnajsnd asdjns asndjsd asdj asdj asdasdjd asjdnajsnd asdjns asndjsd asdj asdj asdasdjd asjdnajsnd asdjns asndjsd asdj asdj asdasd',
  'aksdjsajd asjdnajsnd asdjns asndjsd asdj asdj asaksdjsajd asjdnajsnd asdjns asndjsd asdj asdj asaksdjsajd asjdnajsnd asdjns asndjsd asdj asdj asaksdjsajd asjdnajsnd asdjns asndjsd asdj asdj asaksdjsajd asjdnajsnd asdjns asndjsd asdj asdj asaksdjsajd asjdnajsnd asdjns asndjsd asdj asdj as',
];

const random = (min: number, max: number) => {
  return Math.ceil(Math.random() * (max - min)) + min;
};

const randomColor = () => {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
};

const randomHeight = () => {
  return random(80, 140);
};

const randomText = () => {
  return texts[random(1, 7)];
};

export const getRandomData = (num = 1000) => {
  const data: Data[] = [];
  for (let i = 0; i < num; i += 1) {
    data.push({
      color: randomColor(),
      height: randomHeight(),
      text: randomText(),
    });
  }
  return data;
};

const exampleData: Data[] = getRandomData(10000);

let hasError = false;
export const getData = async (page: number, pageNum = 10) => {
  await wait(10);
  if (page === 6) {
    throw new Error('heheh');
  }
  return exampleData
    .slice(page * pageNum, (page + 1) * pageNum)
    .map((data, index) => {
      return {
        ...data,
        text: 'page【' + page + '】 index【' + (index + 1) + '】 ' + data.text,
      };
    });
};
