import axios from 'axios';
import moment from 'moment';

const MOONBASE_TREASURY_ADDRESS = '0x982d6e3eb8aba3c929e2902f1e7a9a73e4d96be7';
const MEMBERSHIP_PRICE_USD = 40;

// rinkeby DAI
const ACCEPTED_TOKEN = '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735';

// yes im storing api key here, wouldnt do that in a professionnal prod environment
const apiKey = '9XG3EM42EY7GBNMWCYKYNDPIIAD7EQA2WA';

interface ITransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}
interface ITransactionCurated {
  value: number;
  contractAddress: string;
  tokenSymbol: string;
  timeStamp: number;
}

function curateTransactions(transactions: Array<ITransaction>) {
  const curatedTransactions: Array<ITransactionCurated> = [];

  transactions.map((transaction: ITransaction) => {
    curatedTransactions.push({
      value: parseInt(transaction.value) / 1000000000000000000,
      tokenSymbol: transaction.tokenSymbol,
      contractAddress: transaction.contractAddress,
      timeStamp: parseInt(transaction.timeStamp) * 1000,
    });
  });
  return curatedTransactions;
}

const testTransactions: Array<ITransaction> = [
  {
    blockNumber: '11026339',
    timeStamp: '1657853667',
    hash: '0xf1dcb10d9e1a681223f433a649524fbf1992fb481650645c2d43eca14639310f',
    nonce: '5',
    blockHash: '0x71815b0da88848253f23be588b249d5b078eee623f92eb23d61e406b8b97eeb4',
    from: '0x0f04024bda15f6e5d48ed92938654a6449f483ed',
    contractAddress: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
    to: '0x5f4664b531fddceecbdffa91700e7a6c64e40fac',
    value: '500000000000000000000',
    tokenName: 'Dai Stablecoin',
    tokenSymbol: 'DAI',
    tokenDecimal: '18',
    transactionIndex: '2',
    gas: '191673',
    gasPrice: '1940000018',
    gasUsed: '135764',
    cumulativeGasUsed: '283154',
    input: 'deprecated',
    confirmations: '39',
  },
  {
    blockNumber: '11026367',
    timeStamp: '1657854087',
    hash: '0xf46cf280f414957b761b0206ca2764951bb81e4d80746964fdb191490d75d9c8',
    nonce: '6',
    blockHash: '0x9e2eb0be16e5827cd0deb56df9224b503d69e8fda06831ae90dc77d1d6366c69',
    from: '0x5f4664b531fddceecbdffa91700e7a6c64e40fac',
    contractAddress: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
    to: '0x982d6e3eb8aba3c929e2902f1e7a9a73e4d96be7',
    value: '40000000000000000000',
    tokenName: 'Dai Stablecoin',
    tokenSymbol: 'DAI',
    tokenDecimal: '18',
    transactionIndex: '10',
    gas: '77727',
    gasPrice: '1500000008',
    gasUsed: '51818',
    cumulativeGasUsed: '744876',
    input: 'deprecated',
    confirmations: '11',
  },
];

export function checkTransactions(transactions: Array<ITransaction>) {
  const daiTransactionsToTreasury: Array<ITransaction> = transactions.filter((transaction: ITransaction) => {
    return transaction.to === MOONBASE_TREASURY_ADDRESS && transaction.contractAddress === ACCEPTED_TOKEN;
  });
  const curatedTransactions = curateTransactions(daiTransactionsToTreasury);
  let isAccountActive = false;
  curatedTransactions.map((transaction: ITransactionCurated) => {
    const transactionTime = moment(transaction.timeStamp);
    if (transactionTime.isAfter(moment().startOf('month')) && transactionTime.isBefore(moment().endOf('month')) && transaction.value >= MEMBERSHIP_PRICE_USD) isAccountActive = true;
  });
  return isAccountActive;
}

export const checkIsAccountActive = async (address: string) => {
  const url = `https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${apiKey}`;
  const transactions = await axios.get(url);
  return checkTransactions(transactions.data.result);
};
