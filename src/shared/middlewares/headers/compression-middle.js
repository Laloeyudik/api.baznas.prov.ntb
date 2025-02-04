import compression from "compression";
const middCompression = compression({
  level: 9,
  threshold: 10,
  filter: async (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
});

export default middCompression;
