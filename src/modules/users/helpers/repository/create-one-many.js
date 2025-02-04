import prisma from "../../../../configs/db.js";
import { cached } from "../../../../configs/redis.js";

/**
 * @scoop {user}
 * @param {collection, filter, options, type}
 * @returns {object} data query
 *
 */

export default async function find(
  collection,
  data = {},
  options = {},
  type = "one"
) {
  const collec = prisma[collection];

  if (type === "many") {
    return await collec.createMany({
      data: { ...data },
      ...options,
    });
  } else if (type === "returnMany") {
    return await collec.createManyAndReturn({
      data: { ...data },
      ...options,
    });
  } else {
    return await collec.create({
      data: { ...data },
      ...options,
    });
  }
}
