import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { CSTK } from '../types/CSTK/CSTK';
import { Token, Member, TokenSnapshot, MemberSnapshot } from '../types/schema';
import { CSTK_ADDRESS, ZERO, ZERO_BD } from './contants';

export const DAY = 24 * 60 * 60;
export const YEAR = 365 * DAY;

export function tokenToDecimal(amount: BigInt): BigDecimal {
  return amount.toBigDecimal();
}

export function getCSTK(): Token {
  let cstk = Token.load(CSTK_ADDRESS);

  if (cstk == null) {
    cstk = new Token(CSTK_ADDRESS);
    cstk.numMembers = ZERO;
    cstk.totalSupply = ZERO_BD;

    const token = CSTK.bind(Address.fromBytes(CSTK_ADDRESS));
    let nameCall = token.try_name();
    let symbolCall = token.try_symbol();

    cstk.name = nameCall.reverted ? '' : nameCall.value;
    cstk.symbol = symbolCall.reverted ? '' : symbolCall.value;
  }

  return cstk;
}

export function getMember(memberAddress: Address): Member {
  let member = Member.load(memberAddress);

  if (member == null) {
    member = new Member(memberAddress);
    member.balance = ZERO_BD;
  }

  return member;
}

export function createTokenSnapshot(token: Token, timestamp: i32): void {
  let dayTimestamp = timestamp - (timestamp % DAY); // Todays Timestamp

  let tokenId = token.id;

  let snapshotId = tokenId.concatI32(dayTimestamp);
  let snapshot = TokenSnapshot.load(snapshotId);

  if (!snapshot) {
    snapshot = new TokenSnapshot(snapshotId);
  }

  snapshot.token = token.id;
  snapshot.timestamp = dayTimestamp;
  snapshot.numMembers = token.numMembers;
  snapshot.totalSupply = token.totalSupply;

  snapshot.save();
}

export function createMemberSnapshot(member: Member, timestamp: i32): void {
  let dayTimestamp = timestamp - (timestamp % DAY); // Todays Timestamp

  let memberId = member.id;

  let snapshotId = memberId.concatI32(dayTimestamp);
  let snapshot = MemberSnapshot.load(snapshotId);

  if (!snapshot) {
    snapshot = new MemberSnapshot(snapshotId);
  }

  snapshot.member = member.id;
  snapshot.timestamp = dayTimestamp;
  snapshot.balance = member.balance;

  snapshot.save();
}
