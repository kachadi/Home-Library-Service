import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
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

  if (!item && RESOURCES_NAMES.includes(itemBelongsTo)) {
    throw new NotFoundException(ERR_MSG);
  } else if (isFavs && !item) {
    throw new UnprocessableEntityException(ERR_MSG);
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
  console.log(otherCollections);

  otherCollections.find((collection) => {
    const item = collection.find((item) => item[key] === value);
    console.log(item);

    item[key] = null;
  });
};

export {
  isItemExists,
  isItemIdUUID,
  isItemUUIDAndExists,
  nullifyItemFromOtherCollections,
};
