import { PgTable, PgColumn } from "drizzle-orm/pg-core";
import { eq, type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { db, DbClient } from "@server/database/databaseClient.js";

export abstract class BaseRepository<
  TTable extends PgTable & { id: PgColumn<any>; userId?: PgColumn<any> },
  TSelect = InferSelectModel<TTable>,
  TInsert = InferInsertModel<TTable>,
> {
  protected readonly dbClient: DbClient;
  protected readonly table: TTable;

  constructor(table: TTable, dbClient: DbClient = db) {
    this.table = table;
    this.dbClient = dbClient;
  }

  async create(payload: Omit<TSelect, "id">): Promise<TSelect> {
    const [newEntry] = await this.dbClient
      .insert(this.table as PgTable)
      .values(payload as Omit<TSelect, "id">)
      .returning();
    return newEntry as TSelect;
  }

  async findById(id: number): Promise<TSelect | null> {
    const [result] = await this.dbClient
      .select()
      .from(this.table as PgTable)
      .where(eq(this.table.id, id))
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
    id: number,
    updatedFields: Partial<TInsert>,
  ): Promise<TSelect | null> {
    const updatedEntry = await this.dbClient
      .update(this.table)
      .set(updatedFields as any)
      .where(eq(this.table.id, id))
      .returning();
    return (updatedEntry as TSelect[])[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const deletedEntry = await this.dbClient
      .delete(this.table)
      .where(eq(this.table.id, id))
      .returning({ id: this.table.id });
    if (deletedEntry.length > 0) return true;
    return false;
  }
}
