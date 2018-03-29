import pino from "pino";

const logger = pino({
  name: "Api",
  level: "debug"
});

export default logger;
