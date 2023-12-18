import fs from 'fs-extra';
import path from 'path';

export class JsonDb<T> {
  private filePath: string;

  constructor(fileName: string) {
    this.filePath = path.join(__dirname, '../data', fileName);
  }

  async find(query?: Partial<T>): Promise<T[]> {
    const items = await this.readData();
    if (!query) return items;
    return items.filter((item: any) =>
      Object.keys(query).every(
        (key: string) => item[key as keyof T] === query[key as keyof T]
      )
    );
  }

  async findOne(query: Partial<T>): Promise<T | undefined> {
    const items = await this.readData();
    return items.find((item: any) =>
      Object.keys(query).every(
        (key: string) => item[key as keyof T] === query[key as keyof T]
      )
    );
  }

  async create(newItem: any): Promise<T> {
    const items = await this.readData();
    const lastItem: any = items[items.length - 1];
    const newId = lastItem ? lastItem.id + 1 : 1;
    const newItemWithId = { ...newItem, id: newId };
    items.push(newItemWithId);
    await this.writeData(items);
    return newItemWithId;
  }

  async update(
    query: Partial<T>,
    updatedItem: Partial<T>
  ): Promise<T | undefined> {
    const items = await this.readData();
    const index = items.findIndex((item: any) =>
      Object.keys(query).every(
        (key: string) => item[key as keyof T] === query[key as keyof T]
      )
    );
    if (index === -1) return undefined;
    items[index] = { ...items[index], ...updatedItem };
    await this.writeData(items);
    return items[index] as T;
  }

  async delete(query: Partial<T>): Promise<boolean> {
    const items = await this.readData();
    const initialLength = items.length;
    const filteredItems = items.filter((item: any) => {
      return !Object.keys(query).every(
        (key: string) => item[key as keyof T] === query[key as keyof T]
      );
    });
    if (items.length === filteredItems.length) return false;
    await this.writeData(filteredItems);
    return true;
  }

  private async readData(): Promise<T[]> {
    try {
      return await fs.readJson(this.filePath);
    } catch (error) {
      console.log(error);
      throw new Error('Error reading the data file');
    }
  }

  private async writeData(data: T[]): Promise<void> {
    try {
      await fs.writeJson(this.filePath, data);
    } catch (error) {
      throw new Error('Error writing to the data file');
    }
  }
}
