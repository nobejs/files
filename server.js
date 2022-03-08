const Config = require("./config")();
const httpServer = requireHttpServer();

const server = httpServer({
  rewriteUrl: (req) => {
    if (process.env.URL_PREFIX !== "") {
      let newUrl = req.url.replace(process.env.URL_PREFIX, "");
      return newUrl;
    } else {
      return req.url;
    }
  },
});

server.register(
  require("fastify-multipart", {
    // attachFieldsToBody: true,
    // addToBody: true,
    // limits: {
    //   fieldNameSize: 100, // Max field name size in bytes
    //   fieldSize: 100, // Max field value size in bytes
    //   fields: 10, // Max number of non-file fields
    //   fileSize: 1000000, // For multipart forms, the max file size in bytes
    //   files: 1, // Max number of file fields
    //   headerPairs: 2000, // Max number of header key=>value pairs
    // },
  })
);

server.listen(process.env.PORT || 3000, "0.0.0.0", (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});
