import { CardTypes, CashbackTypes } from "@server/types/dbEnums.js";

export type MonobankAccount = {
  id: string;
  sendId: string;
  balance: number;
  creditLimit: number;
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
  balance: number;
  goal: number;
};

export type MonobankClientInfo = {
  name: string;
  accounts: MonobankAccount[];
  jars: MonobankJar[];
};

export type MonobankStatementParameters = {
  account: string;
  from: string;
  to?: string;
};

export type MonobankTransaction = {
  id: string;
  time: number;
  description: string;
  mcc: number;
  amount: number;
  operationAmount: number;
  currencyCode: number;
  commissionRate: number;
  cashbackAmount: number;
  balance: number;
  comment?: string;
};
