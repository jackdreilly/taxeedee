

export default class JsonMap {
  map = {};

  keyify(key) {
    return JSON.stringify(key);
  }

  contains(key) {
    return this.get(key) !== undefined;
  }

  put(key, value) {
    this.map[this.keyify(key)] = value;
  }

  get(key) {
    return this.map[this.keyify(key)];
  }
}