export function generateLink(req, token) {
  return new Promise((resolve, recject) => {
    try {
      const protocol = req.get("x-forwarded-proto") || req.protocol;
      const links = `${protocol}://${req.get(
        "host"
      )}/v1/login/verify?otl_token=${token}`;
      resolve(links);
    } catch (error) {
      recject(error);
    }
  });
}
