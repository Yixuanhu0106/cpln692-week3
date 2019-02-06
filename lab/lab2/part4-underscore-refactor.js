(function(){

  var map = L.map('map', {
    center: [39.9522, -75.1639],
    zoom: 14
  });
  var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);

  /* =====================

  # Lab 2, Part 4 — (Optional, stretch goal)

  ## Introduction

    You've already seen this file organized and refactored. In this lab, you will
    try to refactor this code to be cleaner and clearer - you should use the
    utilities and functions provided by underscore.js. Eliminate loops where possible.

  ===================== */

  // Mock user input
  // Filter out according to these zip codes:
  var acceptedZipcodes = [19106, 19107, 19124, 19111, 19118];
  // Filter according to enrollment that is greater than this variable:
  var minEnrollment = 300;


  // clean data
  _.each(schools, function(i) {
    // If we have '19104 - 1234', splitting and taking the first (0th) element
    // as an integer should yield a zip in the format above
    if (_.isString(i.ZIPCODE)) {
      split = i.ZIPCODE.split(' ');
      normalized_zip = parseInt(split[0]);
      i.ZIPCODE = normalized_zip;
    }

    // Check out the use of typeof here — this was not a contrived example.
    // Someone actually messed up the data entry
      if (_.isNumber(i.GRADE_LEVEL)) {  // if number
        i.HAS_KINDERGARTEN = i.GRADE_LEVEL < 1;
        i.HAS_ELEMENTARY = 1 < i.GRADE_LEVEL < 6;
        i.HAS_MIDDLE_SCHOOL = 5 < i.GRADE_LEVEL < 9;
        i.HAS_HIGH_SCHOOL = 8 < i.GRADE_LEVEL < 13;
      } else {  // otherwise (in case of string)
        i.HAS_KINDERGARTEN = i.GRADE_LEVEL.toUpperCase().indexOf('K') >= 0;
        i.HAS_ELEMENTARY = i.GRADE_LEVEL.toUpperCase().indexOf('ELEM') >= 0;
        i.HAS_MIDDLE_SCHOOL = i.GRADE_LEVEL.toUpperCase().indexOf('MID') >= 0;
        i.HAS_HIGH_SCHOOL = i.GRADE_LEVEL.toUpperCase().indexOf('HIGH') >= 0;
      }
    })

    // filter data
    var filtered_data = [];
    var filtered_out = [];
    _.each(schools, function(i) {
      isOpen = i.ACTIVE.toUpperCase() == 'OPEN';
      isPublic = (i.TYPE.toUpperCase() !== 'CHARTER' ||
                  i.TYPE.toUpperCase() !== 'PRIVATE');
      isSchool = (i.HAS_KINDERGARTEN ||
                  i.HAS_ELEMENTARY ||
                  i.HAS_MIDDLE_SCHOOL ||
                  i.HAS_HIGH_SCHOOL);
      meetsMinimumEnrollment = i.ENROLLMENT > minEnrollment;
      meetsZipCondition = _.contains(acceptedZipcodes, i.ZIPCODE);
      filter_condition = (isOpen &&
                          isSchool &&
                          meetsMinimumEnrollment &&
                          !meetsZipCondition);

      if (filter_condition) {
        filtered_data.push(i);
      } else {
        filtered_out.push(i);
      }
    })
    console.log('Included:', filtered_data.length);
    console.log('Excluded:', filtered_out.length);

    // main loop
    var color;
    _.each(filtered_data, function(i) {
      isOpen = i.ACTIVE.toUpperCase() == 'OPEN';
      isPublic = (i.TYPE.toUpperCase() !== 'CHARTER' ||
                  i.TYPE.toUpperCase() !== 'PRIVATE');
      meetsMinimumEnrollment = i.ENROLLMENT > minEnrollment;

      // Constructing the styling options for our map
      if (i.HAS_HIGH_SCHOOL){
        color = '#0000FF'; // blue for high schools
      } else if (i.HAS_MIDDLE_SCHOOL) {
        color = '#00FF00'; // green for middle schools
      } else {
        color = '##FF0000'; // grey for others
      }
      // The style options
      var pathOpts = {'radius': i.ENROLLMENT / 30,
                      'fillColor': color};
      L.circleMarker([i.Y, i.X], pathOpts)
        .bindPopup("School Name: " + i.FACILNAME_LABEL)
        .addTo(map);
    })

  })();
