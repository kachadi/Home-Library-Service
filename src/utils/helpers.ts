import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';

const RESOURCES_NAMES = ['Album', 'Artist', 'Track', 'User'];

const isItemExists = async (
  allItems: Repository<any>,
  itemId: string,
  itemBelongsTo: string,
  isFavs = false,
) => {
  const ERR_MSG = `${itemBelongsTo} with :id ${itemId} is not found in database`;
  const item = await allItems.findOne({ where: { id: itemId } });

  if (isFavs && !item) {
    throw new UnprocessableEntityException(ERR_MSG);
  } else if (!item && RESOURCES_NAMES.includes(itemBelongsTo)) {
    throw new NotFoundException(ERR_MSG);
  } else if (!item) {
    throw new BadRequestException(ERR_MSG);
  }
};

const isItemIdUUID = (itemId: string) => {
  if (!uuid.validate(itemId)) {
    throw new BadRequestException(
      `Recieved from request Id ${itemId} is not uuid`,
    );
  }
};

const isItemUUIDAndExists = async (
  allItems: Repository<any>,
  itemId: string,
  itemBelongsTo: string,
) => {
  isItemIdUUID(itemId);
  await isItemExists(allItems, itemId, itemBelongsTo);
};

const successResponse = (item: string, id: string) => {
  return `${item} with :id ${id} successfully added to favourites😊`;
};

export { isItemIdUUID, successResponse, isItemExists, isItemUUIDAndExists };
