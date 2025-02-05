import helmet from "helmet";

const middHeader = helmet({
  contentSecurityPolicy: {
    directives: {
      "script-src": ["'strict-dynamic'"],
    },
  },
  xPoweredBy: false,
  permissionsPolicy: {
    features: {
      geolocation: ["self"],
      camera: [],
      microphone: [],
      fullscreen: ["*"],
    },
  },
});

const middPermissionsPolicy = (req, res, next) => {
  const protocol = req.get("x-forwarded-proto") || req.protocol;
  const domain = `${protocol}://${req.get("host")}`;
  res.setHeader(
    "Permissions-Policy",
    `geolocation=(self "${domain}"), microphone=()`
  );
  next();
};
export { middHeader, middPermissionsPolicy};
