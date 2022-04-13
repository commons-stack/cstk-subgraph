import { BigDecimal, BigInt, Bytes } from '@graphprotocol/graph-ts';

export const ZERO = BigInt.fromI32(0);
export const ZERO_BD = BigDecimal.fromString('0');
export const ONE_BD = BigDecimal.fromString('1');

export const ZERO_ADDRESS = Bytes.fromHexString('0x0000000000000000000000000000000000000000');
export const CSTK_ADDRESS = Bytes.fromHexString('0xc4fbE68522ba81a28879763C3eE33e08b13c499E');
