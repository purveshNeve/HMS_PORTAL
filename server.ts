import { createServer } from "http";
import next from "next";
import { parseReqUrl } from "next/dist/lib/url";
import { initializeGoalCommentsServer } from "./src/lib/goalComments/goalCommentsServer";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parseReqUrl(req.url ?? "/");
    if (!parsedUrl) {
      res.statusCode = 400;
      res.end("Bad Request");
      return;
    }
    handle(req, res, parsedUrl);
  });

  initializeGoalCommentsServer(server);

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
