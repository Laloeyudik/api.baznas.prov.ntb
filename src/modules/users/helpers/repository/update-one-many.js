import prisma from "../../../../configs/db.js";

/**
 * @scoop {User}
 * @param {string, string, object} collection, id, select
 * @return {object or null} Jika ada return data, jika tidak return null
 *
 * */

export default function update(
  collection,
  where = {},
  data = {} || [],
  options = {},
  type = "upsert"
) {
  const collec = prisma[collection];

  if (type === "one") {
    return collec.update({
      where: { ...where },
      data: { ...data },
      ...options,
    });
  } else if (type === "many") {
    return collec.updateMany({
      where: { ...where },
      data: { ...data },
      ...options,
    });
  } else if (type === "manyReturn") {
    return collec.updateManyAndReturn({
      where: { ...where },
      data: { ...data },
      ...options,
    });
  } else {
    return collec.upsert({
      where: { ...where },
      data: { ...data },
      ...options,
    });
  }
}
