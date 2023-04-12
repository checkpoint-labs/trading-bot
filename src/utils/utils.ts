import { getAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import { shortStringArrToStr } from '@snapshot-labs/sx/dist/utils/strings';
import { SplitUint256 } from '@snapshot-labs/sx/dist/utils/split-uint256';
import * as starknet from 'starknet';

const provider = new starknet.Provider({
  sequencer: {
    baseUrl: 'https://alpha4.starknet.io',
    feederGatewayUrl: 'feeder_gateway',
    gatewayUrl: 'gateway',
    network: 'goerli-alpha'
  }
});

export type Pair = {
  id: string;
  reserve0: number;
  reserve1: number;
  price: number;
  timestamp: number;
  synced: number;
  tx: string;
};

export function convertToDecimal(num: number, decimals: number): number {
  num /= 10 ** decimals;
  return num;
}

export const toAddress = (bn: BigNumber): string => {
  try {
    return getAddress(bn.toHexString());
  } catch (e) {
    return bn.toString();
  }
};

export const hexStrArrToStr = (data: string[], start: number, length: number | bigint): string => {
  const dataSlice = data.slice(start, start + Number(length));
  return shortStringArrToStr(dataSlice.map(m => BigInt(m)));
};

export async function loadPair(pairId: string, mysql): Promise<Pair | null> {
  const pair = await mysql.queryAsync('SELECT * FROM pairs WHERE id = ?', [pairId]);
  return pair.length > 0 ? pair[0] : null;
}

export async function createPair(pair: Pair, mysql): Promise<void> {
  await mysql.queryAsync('INSERT INTO pairs SET ?', [pair]);
}

export async function updatePair(pair: Pair, mysql): Promise<void> {
  await mysql.queryAsync(
    'UPDATE pairs SET reserve0 = ?, reserve1 = ?, price = ?, timestamp = ?, synced = ?, tx = ? WHERE id = ?',
    [pair.reserve0, pair.reserve1, pair.price, pair.timestamp, pair.synced, pair.tx, pair.id]
  );
}

export function getEvent(data: string[], format: string) {
  const params = format.split(',').map(param => param.trim());
  const event = {} as any;
  let len = 0;
  let skip = 0;
  params.forEach((param, i) => {
    const name = param.replace('(uint256)', '').replace('(felt)', '').replace('(felt*)', '');
    const next = i + skip;
    if (len > 0) {
      event[name] = data.slice(next, next + len);
      skip += len - 1;
      len = 0;
    } else {
      if (param.endsWith('(uint256)')) {
        const uint256 = data.slice(next, next + 2);
        event[name] = new SplitUint256(uint256[0], uint256[1]).toUint().toString();
        skip += 1;
      } else {
        event[name] = data[next];
      }
    }
    if (param.endsWith('_len')) len = parseInt(BigInt(data[next]).toString());
  });
  return event;
}

// Check if the last block has been synced
export async function synced(block): Promise<boolean> {
  const lastBlock = await provider.getBlock('latest');
  if (block.block_number >= lastBlock.block_number) return true;
  else return false;
}
