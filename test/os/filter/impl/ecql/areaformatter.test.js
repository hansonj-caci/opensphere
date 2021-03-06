goog.require('ol.Feature');
goog.require('ol.geom.Polygon');
goog.require('os.mock');
goog.require('os.filter.impl.ecql.AreaFormatter');

describe('os.filter.impl.ecql.AreaFormatter', function() {
  it('should format geometries', function() {
    var f = new ol.Feature(ol.geom.Polygon.fromExtent([0, 1, 2, 3]));
    var formatter = new os.filter.impl.ecql.AreaFormatter();
    expect(formatter.format(f)).toBe('(INTERSECTS(geometry,POLYGON((0 1,0 3,2 3,2 1,0 1))))');
  });

  it('should format geometries with other column names', function() {
    var f = new ol.Feature(ol.geom.Polygon.fromExtent([0, 1, 2, 3]));
    var formatter = new os.filter.impl.ecql.AreaFormatter('other');
    expect(formatter.format(f)).toBe('(INTERSECTS(other,POLYGON((0 1,0 3,2 3,2 1,0 1))))');
  });

  it('should wrap multiple geometries properly', function() {
    var formatter = new os.filter.impl.ecql.AreaFormatter();
    var f = new ol.Feature(ol.geom.Polygon.fromExtent([0, 1, 2, 3]));
    var result = formatter.format(f);
    var f2 = new ol.Feature(ol.geom.Polygon.fromExtent([4, 5, 6, 7]));
    result += formatter.format(f2);

    expect(formatter.wrapMultiple(result)).toBe(
      '(' +
      '(INTERSECTS(geometry,POLYGON((0 1,0 3,2 3,2 1,0 1))))' +
      ' OR ' +
      '(INTERSECTS(geometry,POLYGON((4 5,4 7,6 7,6 5,4 5))))' +
      ')');
  });
});
