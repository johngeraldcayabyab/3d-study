const Topology = {
    POINT_LIST: 'point-list', //for each position, draw a point
    LINE_LIST: 'line-list', //for each 2 positions, draw a line
    LINE_STRIP: 'line-strip', //draw lines connecting the newest point to the previous point
    TRIANGLE_LIST: 'triangle-list', //for each 3 positions, draw a triangle (default)
    TRIANGLE_STRIP: 'triangle-strip' //for each new position, draw a triangle from it and the last 2 positions
};