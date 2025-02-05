import helmet from "helmet";

const middHeader = (req, res, next) => {
  const protocol = req.get("x-forwarded-proto") || req.protocol;
  const domain = `${protocol}://${req.get("host")}`;

  res.setHeader(
    "Permissions-Policy",
    `geolocation=(self "${domain}"), microphone=(), camera=(), fullscreen=*`
  );

  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", `"${domain}"`],
      },
    },
    xPoweredBy: false,
  })(req, res, next);
};

export default middHeader;
