import _ from 'underscore';
export function capitalize(word) {
  if (typeof word !== 'string') return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}
export function capitalizeSentence(sen) {
  if (typeof sen !== 'string') return sen;
  return sen.split(' ').map(capitalize).join(' ');
}
export var byteLevels = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'Exabytes', 'Zettabytes', 'Yottabyte'];
export var numberLevels = ['', 'k', 'm', ' billion', ' trillion', ' quadrillion', ' quintillion'];
export function bytesToLargerUnit(bytes) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (bytes >= 1024 && level < byteLevels.length) {
    return bytesToLargerUnit(bytes / 1024, level + 1);
  } else {
    return Math.round(bytes * 100) / 100 + ' ' + byteLevels[level];
  }
}
export function bytesToLargerUnitNoUnits(bytes) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (bytes >= 1024 && level < byteLevels.length) {
    return bytesToLargerUnitNoUnits(bytes / 1024, level + 1);
  } else {
    return Math.round(bytes * 100) / 100; // only render the appropriate value
  }
}

export function bytesToLargerUnitOnly(bytes) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (bytes >= 1024 && level < byteLevels.length) {
    return bytesToLargerUnitOnly(bytes / 1024, level + 1);
  } else {
    return byteLevels[level]; // only render the appropriate unit
  }
}

export function roundLargeNumber(num) {
  var decimalPlaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (num >= 1000 && level < numberLevels.length) {
    return roundLargeNumber(num / 1000, decimalPlaces, level + 1);
  } else {
    var multiplier = Math.pow(10, decimalPlaces);
    return Math.round(num * multiplier) / multiplier + numberLevels[level];
  }
}
export function roundDecimal(num) {
  var decimalsVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  if (isNaN(parseInt(num))) throw Error('Not a Number - ', num);
  var multiplier = Math.pow(10, decimalsVisible);
  return Math.round(num * multiplier) / multiplier;
}
export function decorateNumberWithCommas(num) {
  if (!num || typeof num !== 'number' || num < 1000) return num;
  // Put full number into tooltip w. commas.
  var chunked = _.chunk((num + '').split('').reverse(), 3);
  return _.map(chunked, function (c) {
    return c.reverse().join('');
  }).reverse().join(',');
}

/** Only use where filename is expected. */
export function hrefToFilename(href) {
  var linkTitle = href.split('/');
  return linkTitle = linkTitle.pop();
}
export function escapeRegExp(string) {
  // escapes regex characters from strings
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // handle escapable characters in regexp
}