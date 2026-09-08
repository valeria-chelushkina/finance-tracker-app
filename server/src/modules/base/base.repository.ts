import { PgTable, PgColumn } from "drizzle-orm/pg-core";
import {
  eq,
  and,
  type InferSelectModel,
  type InferInsertModel,
} from "drizzle-orm";
import { db, DbClient } from "@server/database/databaseClient.js";
import { AppError } from "@server/errors/AppErrors.js";

export abstract class BaseRepository<
  TTable extends PgTable & { id: PgColumn<any>; userId?: PgColumn<any> },
  TSelect = InferSelectModel<TTable>,
  TCreate extends Record<string, any> = InferInsertModel<TTable>,
  TInsert extends Record<string, any> = Partial<InferInsertModel<TTable>>,
> {
  protected readonly dbClient: DbClient;
  protected readonly table: TTable;

  constructor(table: TTable, dbClient: DbClient = db) {
    this.table = table;
    this.dbClient = dbClient;
  }

  async create(payload: TCreate): Promise<TSelect> {
    const [newEntry] = await this.dbClient
      .insert(this.table as PgTable)
      .values(payload)
      .returning();
    return newEntry as TSelect;
  }

  async findById(id: string | number): Promise<TSelect | null> {
    const [result] = await this.dbClient
      .select()
      .from(this.table as PgTable)
      .where(eq(this.table.id, id))
      .limit(1);
    return (result as TSelect) || null;
  }

  async findByIdAndUserId(
    id: string | number,
    userId: number,
  ): Promise<TSelect | null> {
    const [result] = await this.dbClient
      .select()
      .from(this.table as PgTable)
      .where(and(eq(this.table.id, id), eq(this.table.userId!, userId)))
      .limit(1);
    return (result as TSelect) || null;
  }

  async findByUserId(userId: number): Promise<TSelect[]> {
    const result = await this.dbClient
      .select()
      .from(this.table as PgTable)
      .where(eq(this.table.userId!, userId));
    return result as TSelect[];
  }

  async update(
    id: string | number,
    userId: number,
    updatedFields: TInsert,
  ): Promise<TSelect | null> {
    if (!updatedFields) {
      throw new AppError("No fields provided for update.", 400);
    }
    const updatedEntry = await this.dbClient
      .update(this.table)
      .set(updatedFields)
      .where(and(eq(this.table.id, id), eq(this.table.userId!, userId)))
      .returning();
    return (updatedEntry as TSelect[])[0] || null;
  }

  async delete(id: string | number, userId: number): Promise<boolean> {
    const deletedEntry = await this.dbClient
      .delete(this.table)
      .where(and(eq(this.table.id, id), eq(this.table.userId!, userId)))
      .returning({ id: this.table.id });
    return deletedEntry.length > 0;
  }
}
