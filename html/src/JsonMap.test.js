import JsonMap from './JsonMap';
import assert from 'assert';

describe('JsonMap()', function () {
  it('get', function () {
    const map = new JsonMap();
    assert.equal(map.contains({hi:'hi'}), false);
    assert.equal(map.get({hi:'hi'}), undefined);
    map.put({hi:'hi'}, "value");
    assert.equal(map.contains({hi:'hi'}), true);
    assert.equal(map.contains({hi:'hi2'}), false);
    assert.equal(map.get({hi:'hi'}), "value");
    map.put({hi:'hi'}, "value2");
    assert.equal(map.get({hi:'hi'}), "value2");
  });
});