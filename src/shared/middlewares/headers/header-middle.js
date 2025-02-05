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
export default middHeader;
