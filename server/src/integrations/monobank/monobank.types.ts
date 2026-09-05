import { CardTypes, CashbackTypes } from "@server/types/dbEnums.js";

export type MonobankAccount = {
  id: string;
  sendId: string;
  balance: bigint;
  creditLimit: bigint;
  type: CardTypes;
  currencyCode: number;
  cashbackType: CashbackTypes;
  maskedPan: string[];
  iban: string;
};

export type MonobankJar = {
  id: string;
  sendId: string;
  title: string;
  description: string;
  currencyCode: number;
  balance: bigint;
  goal: bigint;
};

export type MonobankClientInfo = {
  clientId: string;
  name: string;
  accounts: MonobankAccount[];
  jars: MonobankJar[];
};

export type MonobankTransactionParameters = {
  account: string;
  from: string;
  to: string;
};

export type MonobankTransaction = {
  id: string;
  time: bigint;
  description: string;
  mcc: number;
  amount: bigint;
  currencyCode: number;
  commissionRate: bigint;
  cashbackAmount: bigint;
  balance: bigint;
  comment: string;
};
