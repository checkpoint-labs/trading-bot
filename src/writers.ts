import type { CheckpointWriter } from '@snapshot-labs/checkpoint';
import { convertToDecimal, createPair, getEvent, loadPair, Pair, updatePair, synced } from './utils/utils';

export async function handleSync({ block, tx, rawEvent, mysql }: Parameters<CheckpointWriter>[0]) {
  if (!rawEvent) return;
  const format = 'reserve0, reserve1';
  const data: any = getEvent(rawEvent.data, format);

  // Load the pair
  const pairId = process.env.PAIR!;
  let pair: Pair = {
    id: pairId,
    reserve0: 0,
    reserve1: 0,
    price: 0,
    timestamp: block!.timestamp,
    synced: block!.block_number,
    tx: tx.transaction_hash!,
  };
  const existingPair = await loadPair(pairId, mysql);
  if (existingPair) {
    pair = existingPair;
  }

  // Update reserves
  pair.reserve0 = convertToDecimal(data.reserve0, 18);
  pair.reserve1 = convertToDecimal(data.reserve1, 18);

  // Calculate the price
  const price = pair.reserve0 / convertToDecimal(data.amount0In, 18);

  // Update the pair
  pair.price = price;
  pair.timestamp = block!.timestamp;
  pair.synced = block!.block_number;
  pair.tx = tx.transaction_hash!;

  // Take profit
  if (price >= parseInt(process.env.TARGET!) && await synced(block)) {
    console.log("Alert! Pair price just reached take profit target!")
    // Insert your swap method here
  }

  // Stop loss
  if (price <= parseInt(process.env.TARGET!) && await synced(block)) {
    console.log("Alert! Pair price just reached stop loss target!")
    // Insert your swap method here
  }

  // Save or update the pair in the database
  await updatePair(pair, mysql);
}