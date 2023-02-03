import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid';

const isItemExists = (allItems: any[], itemId: string) => {
  const item = allItems.find((item) => item.id === itemId);
  if (!item) {
    throw new NotFoundException(`Item with :id ${itemId} not found`);
  }
};

const isItemIdUUID = (itemId: string) => {
  if (!uuid.validate(itemId)) {
    throw new BadRequestException(
      `Recieved from request Id ${itemId} is not uuid`,
    );
  }
};

export { isItemExists, isItemIdUUID };
