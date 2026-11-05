import { env } from "./config/env";
import app from "./app";

app.listen(env.port, () => {
  console.log(`ERS API running on port ${env.port} [${env.nodeEnv}]`);
});
