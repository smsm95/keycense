import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../middleware/asyncHandler';
import MerchandiseService from '../services/merchandise';
import ErrorResponse from '../utils/errorResponse';
import standardResponse from '../utils/standardResponse';

const { INTERNAL_SERVER_ERROR, OK, NOT_FOUND } = StatusCodes;

export default class MerchandiseController {
  private merchandiseService: MerchandiseService;

  constructor() {
    this.merchandiseService = new MerchandiseService();
  }

  public getAllMerchandise = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const merchandise = await this.merchandiseService.getAllMerchandise();
        standardResponse(res, OK, merchandise);
      } catch (error: any) {
        console.error(error);
        new ErrorResponse(
          'Failed to retrieve all merchandise',
          INTERNAL_SERVER_ERROR
        ).send(res);
      }
    }
  );

  public getMerchandiseById = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const merchandise = await this.merchandiseService.getMerchandiseById(
          req.params.id
        );
        if (merchandise) {
          standardResponse(res, OK, merchandise);
        } else {
          throw new ErrorResponse('Merchandise not found', NOT_FOUND);
        }
      } catch (error: any) {
        console.error(error);
        new ErrorResponse(
          error.message,
          error.statusCode || INTERNAL_SERVER_ERROR
        ).send(res);
      }
    }
  );

  public createMerchandise = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const newMerchandise = await this.merchandiseService.createMerchandise(
          req.body,
          req
        );
        standardResponse(res, StatusCodes.CREATED, newMerchandise);
      } catch (error: any) {
        console.error(error);
        new ErrorResponse(
          'Failed to create merchandise',
          INTERNAL_SERVER_ERROR
        ).send(res);
      }
    }
  );

  public updateMerchandise = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id);
        const updates = req.body;
        const updatedMerchandise =
          await this.merchandiseService.updateMerchandise(id, updates);
        if (updatedMerchandise) {
          standardResponse(res, StatusCodes.OK, true, updatedMerchandise);
        } else {
          throw new ErrorResponse(
            'Merchandise not found',
            StatusCodes.NOT_FOUND
          ).send(res);
        }
      } catch (error: any) {
        console.error(error);
        new ErrorResponse(
          error.message,
          error.statusCode || INTERNAL_SERVER_ERROR
        ).send(res);
      }
    }
  );

  public deleteMerchandise = asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const success = await this.merchandiseService.deleteMerchandise(
          req.params.id
        );
        if (success) {
          standardResponse(res, StatusCodes.OK, {
            message: 'Merchandise deleted successfully',
          });
        } else {
          throw new ErrorResponse('Merchandise not found', NOT_FOUND);
        }
      } catch (error: any) {
        console.error(error);
        new ErrorResponse(
          error.message,
          error.statusCode || INTERNAL_SERVER_ERROR
        ).send(res);
      }
    }
  );
}
