export class BaseRepository {
  constructor(model) {
    this.model = model;
  }
  findMany(args = {}) { return this.model.findMany(args); }
  findUnique(args) { return this.model.findUnique(args); }
  findFirst(args) { return this.model.findFirst(args); }
  create(data) { return this.model.create({ data }); }
  update(where, data) { return this.model.update({ where, data }); }
  delete(where) { return this.model.delete({ where }); }
  count(args = {}) { return this.model.count(args); }
}
