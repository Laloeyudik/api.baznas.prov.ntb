export function checkExpiredTime(expiredAt) {
  return new Promise((resolve, reject) => {
    try {
      const expired = new Date(expiredAt);
      const isNow = new Date();

      if (isNow > expired) {
        resolve(true);
      }
      resolve(false);
    } catch (error) {
      reject(error);
    }
  });
}
