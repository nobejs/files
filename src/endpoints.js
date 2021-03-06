module.exports = (app) => {
  app.get("/liveness", async (req, res) => {
    return res.code(200).send({ status: "Files Service is alive" });
  });

  app.get("/readiness", async (req, res) => {
    return res.code(200).send({ status: "I am ready" });
  });

  return [
    {
      endpoints: [
        ["post", "/upload", "Files/CanUpload"],
        ["get", "/show/:file_uuid", "Files/CanView"],
      ],
    },
  ];
};
