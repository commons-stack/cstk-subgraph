import { BigInt } from '@graphprotocol/graph-ts';

import { createMemberSnapshot, createTokenSnapshot, getCSTK, getMember, tokenToDecimal, YEAR } from '../helpers/misc';
import { ZERO_ADDRESS, ZERO_BD } from '../helpers/contants';
import { Transfer } from '../types/CSTK/CSTK';
import { Mint } from '../types/Minter/Minter';

export function handleMint(event: Mint): void {
  const member = getMember(event.params.recipient);

  if (member.startDate && member.expireDate) {
    member.expireDate = member.expireDate + YEAR;
  } else {
    member.startDate = event.block.timestamp.toI32();
    member.expireDate = event.block.timestamp.toI32() + YEAR;
  }
}

export function handleTransfer(event: Transfer): void {
  const timestamp = event.block.timestamp.toI32();

  let isMint = event.params.from == ZERO_ADDRESS;
  let isBurn = event.params.to == ZERO_ADDRESS;

  let memberFrom = getMember(event.params.from);
  let memberFromBalance = memberFrom == null ? ZERO_BD : memberFrom.balance;

  let memberTo = getMember(event.params.to);
  let memberToBalance = memberTo == null ? ZERO_BD : memberTo.balance;

  let cstk = getCSTK();

  if (isMint) {
    memberTo.balance = memberTo.balance.plus(tokenToDecimal(event.params.value));
    memberTo.save();
    cstk.totalSupply = cstk.totalSupply.plus(tokenToDecimal(event.params.value));
  } else if (isBurn) {
    memberFrom.balance = memberFrom.balance.minus(tokenToDecimal(event.params.value));
    memberFrom.save();
    cstk.totalSupply = cstk.totalSupply.minus(tokenToDecimal(event.params.value));
  } else {
    memberTo.balance = memberTo.balance.plus(tokenToDecimal(event.params.value));
    memberTo.save();

    memberFrom.balance = memberFrom.balance.minus(tokenToDecimal(event.params.value));
    memberFrom.save();
  }

  if (memberTo !== null && memberTo.balance.notEqual(ZERO_BD) && memberToBalance.equals(ZERO_BD)) {
    cstk.numMembers = cstk.numMembers.plus(BigInt.fromI32(1));
  }

  if (memberFrom !== null && memberFrom.balance.equals(ZERO_BD) && memberFromBalance.notEqual(ZERO_BD)) {
    cstk.numMembers = cstk.numMembers.minus(BigInt.fromI32(1));
  }

  createTokenSnapshot(cstk, timestamp);
  createMemberSnapshot(memberFrom, timestamp);
  createMemberSnapshot(memberTo, timestamp);

  cstk.save();
}
