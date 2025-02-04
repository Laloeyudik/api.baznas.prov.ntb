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
  filter = {},
  options = {},
  type = "many",
  cache = "isChached",
  isCache = true,
  duration = 3600
) {
  
  const collec = prisma[collection];
  const cacheKey = isCache === true ? `${collection}:${type}:${cache}`: false;

  const cachedData = await cached.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  let result;
  if (type === "unique") {
    result = await collec.findUnique({
      where: filter,
      ...options,
    });
  } else if (type === "first") {
    result = await collec.findFirst({
      where: filter,
      ...options,
    });
  } else {
    result = await collec.findMany({
      where: filter,
      ...options,
    });
  }

  if (result && isCache === true) {
    await cached.setex(cacheKey, duration, JSON.stringify(result));
  }

  return result;
}
