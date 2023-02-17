import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';

const RESOURCES_NAMES = ['Album', 'Artist', 'Track', 'User'];

const isItemExists = (
  allItems: any[],
  itemId: string,
  itemBelongsTo: string,
  isFavs = false,
) => {
  const ERR_MSG = `${itemBelongsTo} with :id ${itemId} is not found in database`;
  const item = allItems.find((item) => item.id === itemId);

  if (isFavs && !item) {
    throw new UnprocessableEntityException(ERR_MSG);
  } else if (!item && RESOURCES_NAMES.includes(itemBelongsTo)) {
    throw new NotFoundException(ERR_MSG);
  } else if (!item) {
    throw new BadRequestException(ERR_MSG);
  }
};

const isItemExists1 = async (
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

const isItemUUIDAndExists = (
  allItems: any[],
  itemId: string,
  itemBelongsTo: string,
) => {
  isItemIdUUID(itemId);
  isItemExists(allItems, itemId, itemBelongsTo);
};

const nullifyItemFromOtherCollections = (
  otherCollections: any[],
  key: string,
  value: string,
) => {
  otherCollections.find((collection) => {
    const item = collection.find((item) => item[key] === value);
    if (!item) return;
    item[key] = null;
  });
};

const removeItemFromFavs = (
  collection: string[],
  id: string,
  itemBelongsTo: string,
  isInFavs = false,
) => {
  const ERR_MSG = `${itemBelongsTo} with :id ${id} is not found in favourites`;
  const itemIndex = collection.findIndex((item) => item === id);
  if (itemIndex === -1 && isInFavs) {
    throw new NotFoundException(ERR_MSG);
  } else if (itemIndex === -1) {
    return;
  }
  collection.splice(itemIndex, 1);
};

const successResponse = (item: string, id: string) => {
  return `${item} with :id ${id} successfully added to favourites😊`;
};

export {
  isItemExists,
  isItemIdUUID,
  isItemUUIDAndExists,
  nullifyItemFromOtherCollections,
  removeItemFromFavs,
  successResponse,
  isItemExists1,
};
