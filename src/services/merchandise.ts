import Merchandise from '../types/Merchandise';
import UserMerchandiseAssociation from '../types/UserMerchandiseAssociation';
import { JsonDb } from '../utils/jsonDB';

export default class MerchandiseService {
  private merchandiseDb: JsonDb<Merchandise>;
  private userMerchandiseDb: JsonDb<UserMerchandiseAssociation>;

  constructor() {
    this.merchandiseDb = new JsonDb<Merchandise>('merchandises.json');
    this.userMerchandiseDb = new JsonDb<UserMerchandiseAssociation>(
      'user-merchandises-association.json'
    );
  }

  async getAllMerchandise(): Promise<Merchandise[]> {
    try {
      return await this.merchandiseDb.find();
    } catch (error) {
      console.log(error);
      throw new Error('Failed to retrieve all merchandise');
    }
  }

  async getMerchandiseById(id: string): Promise<Merchandise | undefined> {
    try {
      return await this.merchandiseDb.findOne({ id: parseInt(id) });
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to find merchandise with ID: ${id}`);
    }
  }

  async createMerchandise(
    merchandiseData: Partial<Merchandise>,
    req: any
  ): Promise<Merchandise> {
    try {
      const newMerchandise = await this.merchandiseDb.create(merchandiseData);
      await this.userMerchandiseDb.create({
        userId: req.user.id,
        productId: newMerchandise.id,
      });
      return newMerchandise;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to create merchandise');
    }
  }

  async updateMerchandise(
    id: number,
    updates: Partial<Merchandise>
  ): Promise<Merchandise | undefined> {
    try {
      return await this.merchandiseDb.update({ id }, updates);
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to update merchandise with ID: ${id}`);
    }
  }

  async deleteMerchandise(id: string): Promise<boolean> {
    try {
      const success = await this.merchandiseDb.delete({ id: parseInt(id) });
      if (success) {
        await this.userMerchandiseDb.delete({ productId: parseInt(id) });
      }
      return success;
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to delete merchandise with ID: ${id}`);
    }
  }
}
