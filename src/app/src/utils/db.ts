import { create, drop, fill } from "@/sql/sql";
import pgPromise from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";

export async function renewDB(connection:  pgPromise.IDatabase<{}, IClient>) {
    await connection.none(drop);
    await connection.none(create);
    await connection.none(fill);
}