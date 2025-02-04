import helmet from "helmet";

const middHeader = helmet({
  contentSecurityPolicy: {
    directives: {
      "script-src": ["'strict-dynamic'"],
    },
  },
  xPoweredBy: false,
});
export default middHeader;
