const knex = requireKnex();
const { promises: fs } = require("fs");

const getNumFiles = async (dir) => {
  const files = await fs.readdir(dir);
  return files.length;
};

module.exports = (app) => {
  app.get("/health", async (request, res) => {
    try {
      console.log('CALLING_HEALTH-files');
      let numberOfFilesInMigrationPath = await getNumFiles(
        knex.migrate.config.migrationSource.migrationsPaths[0]
      );
      let numberOfMigrations = await knex("migrations")
        .count({ count: "*" })
        .first();
      numberOfMigrations = parseInt(numberOfMigrations.count);

      if (process.env.DEBUG === "true") {
        console.log(
          "numberOfMigrations",
          numberOfMigrations,
          numberOfFilesInMigrationPath
        );
      }

      if (numberOfMigrations === numberOfFilesInMigrationPath) {
        return res.code(200).send({
          status: "Files service is healthy",
          npm_package_version: process.env.npm_package_version,
          ip: request.ip,
          userAgent: request.headers["user-agent"],
          region: process.env.AWS_REGION || "na",
        });
      } else {
        if (process.env.DEBUG === "true") {
          console.log("Files is not alive");
        }

        return res.code(400).send({
          status: "Files is not alive",
        });
      }
    } catch (error) {
      console.log("ERR_LOG_IN_HEALTH", JSON.stringify(error));
      if (process.env.DEBUG === "true") {
        console.log(error);
      }
    }
  });

  app.get("/liveness", async (req, res) => {
    try {
      console.log('CALLING_LIVENESS-files');
      return res.code(200).send({ status: "Files Service is alive" });
    } catch (error) {
      console.log("ERR_LOG_IN_liveness", JSON.stringify(error));
    }
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
