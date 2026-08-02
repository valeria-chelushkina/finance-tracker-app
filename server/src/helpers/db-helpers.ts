import { integer, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import * as data from "../config/currencies.json" with { type: "json" };

export function loadCurrenciesFile(){
    try{
        console.log(Object.keys(data));
    }
    catch(err)
    {
        console.error("Couldn't load currencies file: ", err);
    }
}

export function helpMe(): any {}
