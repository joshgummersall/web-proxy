import Parser from "simples/lib/parsers/ws.js";
import chalk from "chalk";
import http from "http";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({
  target: {
    host: process.env.PROXY_TARGET_HOST,
    port: process.env.PROXY_TARGET_PORT,
  },
});

proxy.on("open", (socket) => {
  socket.on("data", (data) =>
    console.log(
      chalk.bgRed("target -> client"),
      data?.toString?.("utf8").trim()
    )
  );
});

proxy.on("proxyReqWs", (_proxyReq, _req, socket) => {
  const parser = new Parser(0, null);

  parser.on("frame", (frame) =>
    console.log(
      chalk.black.bgGreen("client -> target"),
      frame?.data?.toString?.("utf8").trim()
    )
  );

  socket.pipe(parser);
});

const server = new http.Server(proxy.web.bind(proxy)).on(
  "upgrade",
  proxy.ws.bind(proxy)
);

server.listen(process.env.PORT);
