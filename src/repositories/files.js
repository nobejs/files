const baseRepo = requireUtil("baseRepo");
const table = "files";

const create = async (payload) => {
  return await baseRepo.create(table, payload);
};

const first = async (payload) => {
  return await baseRepo.first(table, payload, true);
};

module.exports = {
  create,
  first,
};
