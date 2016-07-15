const GoogleDirectionParser = require('./../lib/google_direction_parser');
const GpxWriter = require('./../lib/gpx_writer');
var _ = require('lodash');

var convert = function (url, speed, pauses, loops, outputPath) {
    var segmentPoints = GoogleDirectionParser.parse(url);
    var points = [];
    loops = loops || 1;
    console.log("Creating %s segment loops", loops);
    if (pauses) {
        console.log("Each segment stop will pause");
    }

    for (var loop = 0; loop < loops; loop++) {
        for (var i = 0; i < segmentPoints.length - 1; i++) {
            var betweenPoints = segmentPoints[i].pointsBetween(segmentPoints[i + 1], speed);
            points = points.concat(betweenPoints);
            if (pauses) {
                points = points.concat(pointsNearby(segmentPoints[i + 1], 20));
            }
        }
    }
    points = points.concat(pointsNearby(_.last(points), 1000));
    new GpxWriter(points).writeTo(outputPath);
};

var pointsNearby = function (point, count) {
    return _.map(new Array(count), function () {
        return point.pointNearby();
    });
};

module.exports = {
    convert: convert
};