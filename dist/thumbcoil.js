/**
 * thumbcoil
 * @version 1.1.0
 * @copyright 2016 Brightcove, Inc.
 * @license Apache-2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.thumbcoil = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _libCombinators = require('./lib/combinators');

var _libDataTypes = require('./lib/data-types');

var audCodec = (0, _libCombinators.start)('access_unit_delimiter', (0, _libCombinators.list)([(0, _libCombinators.data)('primary_pic_type', (0, _libDataTypes.u)(3)), (0, _libCombinators.verify)('access_unit_delimiter')]));

exports['default'] = audCodec;
module.exports = exports['default'];
},{"./lib/combinators":4,"./lib/data-types":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libCombinators = require('./lib/combinators');

var _libDataTypes = require('./lib/data-types');

var _libConditionals = require('./lib/conditionals');

var _scalingList = require('./scaling-list');

var _scalingList2 = _interopRequireDefault(_scalingList);

var v = null;

var hdrParameters = (0, _libCombinators.list)([(0, _libCombinators.data)('cpb_cnt_minus1', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('bit_rate_scale', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('cpb_size_scale', (0, _libDataTypes.u)(4)), (0, _libConditionals.each)(function (index, output) {
  return index <= output.cpb_cnt_minus1;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('bit_rate_value_minus1[]', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('cpb_size_value_minus1[]', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('cbr_flag[]', (0, _libDataTypes.u)(1))])), (0, _libCombinators.data)('initial_cpb_removal_delay_length_minus1', (0, _libDataTypes.u)(5)), (0, _libCombinators.data)('cpb_removal_delay_length_minus1', (0, _libDataTypes.u)(5)), (0, _libCombinators.data)('dpb_output_delay_length_minus1', (0, _libDataTypes.u)(5)), (0, _libCombinators.data)('time_offset_length', (0, _libDataTypes.u)(5))]);

exports['default'] = hdrParameters;
module.exports = exports['default'];
},{"./lib/combinators":4,"./lib/conditionals":5,"./lib/data-types":6,"./scaling-list":11}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _accessUnitDelimiter = require('./access-unit-delimiter');

var _accessUnitDelimiter2 = _interopRequireDefault(_accessUnitDelimiter);

var _seqParameterSet = require('./seq-parameter-set');

var _seqParameterSet2 = _interopRequireDefault(_seqParameterSet);

var _picParameterSet = require('./pic-parameter-set');

var _picParameterSet2 = _interopRequireDefault(_picParameterSet);

var _sliceLayerWithoutPartitioning = require('./slice-layer-without-partitioning');

var _sliceLayerWithoutPartitioning2 = _interopRequireDefault(_sliceLayerWithoutPartitioning);

var _libDiscardEmulationPrevention = require('./lib/discard-emulation-prevention');

var _libDiscardEmulationPrevention2 = _interopRequireDefault(_libDiscardEmulationPrevention);

var h264Codecs = {
  accessUnitDelimiter: _accessUnitDelimiter2['default'],
  seqParameterSet: _seqParameterSet2['default'],
  picParameterSet: _picParameterSet2['default'],
  sliceLayerWithoutPartitioning: _sliceLayerWithoutPartitioning2['default'],
  discardEmulationPrevention: _libDiscardEmulationPrevention2['default']
};

exports['default'] = h264Codecs;
module.exports = exports['default'];
},{"./access-unit-delimiter":1,"./lib/discard-emulation-prevention":7,"./pic-parameter-set":10,"./seq-parameter-set":12,"./slice-layer-without-partitioning":14}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _expGolombString = require('./exp-golomb-string');

var _rbspUtils = require('./rbsp-utils');

/**
 * General ExpGolomb-Encoded-Structure Parse Functions
 */
var start = function start(name, parseFn) {
  return {
    decode: function decode(input, options) {
      var rawBitString = (0, _rbspUtils.typedArrayToBitString)(input);
      var bitString = (0, _rbspUtils.removeRBSPTrailingBits)(rawBitString);
      var expGolombDecoder = new _expGolombString.ExpGolombDecoder(bitString);
      var output = {};

      options = options || {};

      return parseFn.decode(expGolombDecoder, output, options);
    },
    encode: function encode(input, options) {
      var expGolombEncoder = new _expGolombString.ExpGolombEncoder();

      options = options || {};

      parseFn.encode(expGolombEncoder, input, options);

      var output = expGolombEncoder.bitReservoir;
      var bitString = (0, _rbspUtils.appendRBSPTrailingBits)(output);
      var data = (0, _rbspUtils.bitStringToTypedArray)(bitString);

      return data;
    }
  };
};

exports.start = start;
var list = function list(parseFns) {
  return {
    decode: function decode(expGolomb, output, options, index) {
      parseFns.forEach(function (fn) {
        output = fn.decode(expGolomb, output, options, index) || output;
      });

      return output;
    },
    encode: function encode(expGolomb, input, options, index) {
      parseFns.forEach(function (fn) {
        fn.encode(expGolomb, input, options, index);
      });
    }
  };
};

exports.list = list;
var data = function data(name, dataType) {
  var nameSplit = name.split(/\[(\d*)\]/);
  var property = nameSplit[0];
  var indexOverride = undefined;
  var nameArray = undefined;

  // The `nameSplit` array can either be 1 or 3 long
  if (nameSplit && nameSplit[0] !== '') {
    if (nameSplit.length > 1) {
      nameArray = true;
      indexOverride = parseFloat(nameSplit[1]);

      if (isNaN(indexOverride)) {
        indexOverride = undefined;
      }
    }
  } else {
    throw new Error('ExpGolombError: Invalid name "' + name + '".');
  }

  return {
    name: name,
    decode: function decode(expGolomb, output, options, index) {
      var value = undefined;

      if (typeof indexOverride === 'number') {
        index = indexOverride;
      }

      value = dataType.read(expGolomb, output, options, index);

      if (!nameArray) {
        output[property] = value;
      } else {
        if (!Array.isArray(output[property])) {
          output[property] = [];
        }

        if (index !== undefined) {
          output[property][index] = value;
        } else {
          output[property].push(value);
        }
      }

      return output;
    },
    encode: function encode(expGolomb, input, options, index) {
      var value = undefined;

      if (typeof indexOverride === 'number') {
        index = indexOverride;
      }

      if (!nameArray) {
        value = input[property];
      } else if (Array.isArray(output[property])) {
        if (index !== undefined) {
          value = input[property][index];
        } else {
          value = input[property].shift();
        }
      }

      if (typeof value !== 'number') {
        return;
      }

      value = dataType.write(expGolomb, input, options, index, value);
    }
  };
};

exports.data = data;
var debug = function debug(prefix) {
  return {
    decode: function decode(expGolomb, output, options, index) {
      console.log(prefix, expGolomb.bitReservoir, output, options, index);
    },
    encode: function encode(expGolomb, input, options, index) {
      console.log(prefix, expGolomb.bitReservoir, input, options, index);
    }
  };
};

exports.debug = debug;
var verify = function verify(name) {
  return {
    decode: function decode(expGolomb, output, options, index) {
      var len = expGolomb.bitReservoir.length;
      if (len !== 0) {
        console.trace('ERROR: ' + name + ' was not completely parsed. There were (' + len + ') bits remaining!');
        console.log(expGolomb.originalBitReservoir);
      }
    },
    encode: function encode(expGolomb, input, options, index) {}
  };
};

exports.verify = verify;
var pickOptions = function pickOptions(property, value) {
  return {
    decode: function decode(expGolomb, output, options, index) {
      if (typeof options[property] !== undefined) {
        //     options[property][value];
      }
    },
    encode: function encode(expGolomb, input, options, index) {
      if (typeof options[property] !== undefined) {
        //   options.values options[property][value];
      }
    }
  };
};
exports.pickOptions = pickOptions;
},{"./exp-golomb-string":8,"./rbsp-utils":9}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var when = function when(conditionFn, parseFn) {
  return {
    decode: function decode(expGolomb, output, options, index) {
      if (conditionFn(output, options, index)) {
        return parseFn.decode(expGolomb, output, options, index);
      }

      return output;
    },
    encode: function encode(expGolomb, input, options, index) {
      if (conditionFn(input, options, index)) {
        parseFn.encode(expGolomb, input, options, index);
      }
    }
  };
};

exports.when = when;
var each = function each(conditionFn, parseFn) {
  return {
    decode: function decode(expGolomb, output, options) {
      var index = 0;

      while (conditionFn(index, output, options)) {
        parseFn.decode(expGolomb, output, options, index);
        index++;
      }

      return output;
    },
    encode: function encode(expGolomb, input, options) {
      var index = 0;

      while (conditionFn(index, input, options)) {
        parseFn.encode(expGolomb, input, options, index);
        index++;
      }
    }
  };
};

exports.each = each;
var inArray = function inArray(name, array) {
  var nameSplit = name.split(/\[(\d*)\]/);
  var property = nameSplit[0];
  var indexOverride = undefined;
  var nameArray = undefined;

  // The `nameSplit` array can either be 1 or 3 long
  if (nameSplit && nameSplit[0] !== '') {
    if (nameSplit.length > 1) {
      nameArray = true;
      indexOverride = parseFloat(nameSplit[1]);

      if (isNaN(indexOverride)) {
        indexOverride = undefined;
      }
    }
  } else {
    throw new Error('ExpGolombError: Invalid name "' + name + '".');
  }

  return function (obj, options, index) {
    if (nameArray) {
      return obj[property] && array.indexOf(obj[property][index]) !== -1 || options[property] && array.indexOf(options[property][index]) !== -1;
    } else {
      return array.indexOf(obj[property]) !== -1 || array.indexOf(options[property]) !== -1;
    }
  };
};

exports.inArray = inArray;
var equals = function equals(name, value) {
  var nameSplit = name.split(/\[(\d*)\]/);
  var property = nameSplit[0];
  var indexOverride = undefined;
  var nameArray = undefined;

  // The `nameSplit` array can either be 1 or 3 long
  if (nameSplit && nameSplit[0] !== '') {
    if (nameSplit.length > 1) {
      nameArray = true;
      indexOverride = parseFloat(nameSplit[1]);

      if (isNaN(indexOverride)) {
        indexOverride = undefined;
      }
    }
  } else {
    throw new Error('ExpGolombError: Invalid name "' + name + '".');
  }

  return function (obj, options, index) {
    if (nameArray) {
      return obj[property] && obj[property][index] === value || options[property] && options[property][index] === value;
    } else {
      return obj[property] === value || options[property] === value;
    }
  };
};

exports.equals = equals;
var not = function not(fn) {
  return function (obj, options, index) {
    return !fn(obj, options, index);
  };
};

exports.not = not;
var some = function some(conditionFns) {
  return function (obj, options, index) {
    return conditionFns.some(function (fn) {
      return fn(obj, options, index);
    });
  };
};

exports.some = some;
var every = function every(conditionFns) {
  return function (obj, options, index) {
    return conditionFns.every(function (fn) {
      return fn(obj, options, index);
    });
  };
};

exports.every = every;
var whenMoreData = function whenMoreData(parseFn) {
  return {
    decode: function decode(expGolomb, output, options, index) {
      if (expGolomb.bitReservoir.length) {
        return parseFn.decode(expGolomb, output, options, index);
      }
      return output;
    },
    encode: function encode(expGolomb, input, options, index) {
      parseFn.encode(expGolomb, input, options, index);
    }
  };
};
exports.whenMoreData = whenMoreData;
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var getNumBits = function getNumBits(numBits, expGolomb, data, options, index) {
  if (typeof numBits === 'function') {
    return numBits(expGolomb, data, options, index);
  }
  return numBits;
};

var dataTypes = {
  u: function u(numBits) {
    return {
      read: function read(expGolomb, output, options, index) {
        var bitsToRead = getNumBits(numBits, expGolomb, output, options, index);

        return expGolomb.readBits(bitsToRead);
      },
      write: function write(expGolomb, input, options, index, value) {
        var bitsToWrite = getNumBits(numBits, expGolomb, input, options, index);

        expGolomb.writeBits(value, bitsToWrite);
      }
    };
  },
  f: function f(numBits) {
    return {
      read: function read(expGolomb, output, options, index) {
        var bitsToRead = getNumBits(numBits, expGolomb, output, options, index);

        return expGolomb.readBits(bitsToRead);
      },
      write: function write(expGolomb, input, options, index, value) {
        var bitsToWrite = getNumBits(numBits, expGolomb, input, options, index);

        expGolomb.writeBits(value, bitsToWrite);
      }
    };
  },
  ue: function ue() {
    return {
      read: function read(expGolomb, output, options, index) {
        return expGolomb.readUnsignedExpGolomb();
      },
      write: function write(expGolomb, input, options, index, value) {
        expGolomb.writeUnsignedExpGolomb(value);
      }
    };
  },
  se: function se() {
    return {
      read: function read(expGolomb, output, options, index) {
        return expGolomb.readExpGolomb();
      },
      write: function write(expGolomb, input, options, index, value) {
        expGolomb.writeExpGolomb(value);
      }
    };
  },
  b: function b() {
    return {
      read: function read(expGolomb, output, options, index) {
        return expGolomb.readUnsignedByte();
      },
      write: function write(expGolomb, input, options, index, value) {
        expGolomb.writeUnsignedByte(value);
      }
    };
  },
  val: function val(_val) {
    return {
      read: function read(expGolomb, output, options, index) {
        if (typeof _val === 'function') {
          return _val(expGolomb, output, options, index);
        }
        return _val;
      },
      write: function write(expGolomb, input, options, index, value) {
        if (typeof _val === 'function') {
          _val(ExpGolomb, output, options, index);
        }
      }
    };
  }
};

exports['default'] = dataTypes;
module.exports = exports['default'];
},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var discardEmulationPreventionBytes = function discardEmulationPreventionBytes(data) {
  var length = data.length;
  var emulationPreventionBytesPositions = [];
  var i = 1;
  var newLength = undefined;
  var newData = undefined;

  // Find all `Emulation Prevention Bytes`
  while (i < length - 2) {
    if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0x03) {
      emulationPreventionBytesPositions.push(i + 2);
      i += 2;
    } else {
      i++;
    }
  }

  // If no Emulation Prevention Bytes were found just return the original
  // array
  if (emulationPreventionBytesPositions.length === 0) {
    return data;
  }

  // Create a new array to hold the NAL unit data
  newLength = length - emulationPreventionBytesPositions.length;
  newData = new Uint8Array(newLength);
  var sourceIndex = 0;

  for (i = 0; i < newLength; sourceIndex++, i++) {
    if (sourceIndex === emulationPreventionBytesPositions[0]) {
      // Skip this byte
      sourceIndex++;
      // Remove this position index
      emulationPreventionBytesPositions.shift();
    }
    newData[i] = data[sourceIndex];
  }

  return newData;
};

exports['default'] = discardEmulationPreventionBytes;
module.exports = exports['default'];
},{}],8:[function(require,module,exports){
/**
 * Tools for encoding and decoding ExpGolomb data from a bit-string
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var ExpGolombDecoder = function ExpGolombDecoder(bitString) {
  this.bitReservoir = bitString;
  this.originalBitReservoir = bitString;
};

exports.ExpGolombDecoder = ExpGolombDecoder;
ExpGolombDecoder.prototype.countLeadingZeros = function () {
  var i = 0;

  for (var _i = 0; _i < this.bitReservoir.length; _i++) {
    if (this.bitReservoir[_i] === '1') {
      return _i;
    }
  }

  return -1;
};

ExpGolombDecoder.prototype.readUnsignedExpGolomb = function () {
  var zeros = this.countLeadingZeros();
  var bitCount = zeros * 2 + 1;

  var val = parseInt(this.bitReservoir.slice(zeros, bitCount), 2);

  val -= 1;

  this.bitReservoir = this.bitReservoir.slice(bitCount);

  return val;
};

ExpGolombDecoder.prototype.readExpGolomb = function () {
  var val = this.readUnsignedExpGolomb();

  if (val !== 0) {
    if (val & 0x1) {
      val = (val + 1) / 2;
    } else {
      val = -(val / 2);
    }
  }

  return val;
};

ExpGolombDecoder.prototype.readBits = function (bitCount) {
  var val = parseInt(this.bitReservoir.slice(0, bitCount), 2);

  this.bitReservoir = this.bitReservoir.slice(bitCount);

  return val;
};

ExpGolombDecoder.prototype.readUnsignedByte = function () {
  return this.writeBits(8);
};

var ExpGolombEncoder = function ExpGolombEncoder(bitString) {
  this.bitReservoir = bitString || '';
};

exports.ExpGolombEncoder = ExpGolombEncoder;
ExpGolombEncoder.prototype.writeUnsignedExpGolomb = function (value) {
  var tempStr = '';
  var bitValue = (value + 1).toString(2);
  var numBits = bitValue.length - 1;

  for (var i = 0; i < numBits; i++) {
    tempStr += '0';
  }

  this.bitReservoir += tempStr + bitValue;
};

ExpGolombEncoder.prototype.writeExpGolomb = function (value) {
  if (value <= 0) {
    value = -value * 2;
  } else {
    value = value * 2 - 1;
  }

  this.writeUnsignedExpGolomb(value);
};

ExpGolombEncoder.prototype.writeBits = function (bitWidth, value) {
  var tempStr = '';
  var bitValue = (value & (1 << bitWidth) - 1).toString(2);
  var numBits = bitWidth - bitValue.length;

  for (var i = 0; i < numBits; i++) {
    tempStr += '0';
  }

  this.bitReservoir += tempStr + bitValue;
};

ExpGolombEncoder.prototype.writeUnsignedByte = function (value) {
  this.writeBits(8, value);
};
},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var typedArrayToBitString = function typedArrayToBitString(data) {
  var array = [];
  var bytesPerElement = data.BYTES_PER_ELEMENT || 1;
  var prefixZeros = '';

  for (var i = 0; i < data.length; i++) {
    array.push(data[i]);
  }

  for (var i = 0; i < bytesPerElement; i++) {
    prefixZeros += '00000000';
  }

  return array.map(function (n) {
    return (prefixZeros + n.toString(2)).slice(-bytesPerElement * 8);
  }).join('');
};

exports.typedArrayToBitString = typedArrayToBitString;
var bitStringToTypedArray = function bitStringToTypedArray(bitString) {
  var bitsNeeded = 8 - bitString.length % 8;

  // Pad with zeros to make length a multiple of 8
  for (var i = 0; bitsNeeded !== 8 && i < bitsNeeded; i++) {
    bitString += '0';
  }

  var outputArray = bitString.match(/(.{8})/g);
  var numberArray = outputArray.map(function (n) {
    return parseInt(n, 2);
  });

  return new Uint8Array(numberArray);
};

exports.bitStringToTypedArray = bitStringToTypedArray;
var removeRBSPTrailingBits = function removeRBSPTrailingBits(bits) {
  return bits.split(/10*$/)[0];
};

exports.removeRBSPTrailingBits = removeRBSPTrailingBits;
var appendRBSPTrailingBits = function appendRBSPTrailingBits(bits) {
  var bitString = bits + '10000000';

  return bitString.slice(0, -(bitString.length % 8));
};
exports.appendRBSPTrailingBits = appendRBSPTrailingBits;
},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libCombinators = require('./lib/combinators');

var _libConditionals = require('./lib/conditionals');

var _libDataTypes = require('./lib/data-types');

var _scalingList = require('./scaling-list');

var _scalingList2 = _interopRequireDefault(_scalingList);

var v = null;

var ppsCodec = (0, _libCombinators.start)('pic_parameter_set', (0, _libCombinators.list)([(0, _libCombinators.data)('pic_parameter_set_id', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('seq_parameter_set_id', (0, _libDataTypes.ue)(v)),
//    pickOptions('sps', 'seq_parameter_set_id'),
(0, _libCombinators.data)('entropy_coding_mode_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('bottom_field_pic_order_in_frame_present_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('num_slice_groups_minus1', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('num_slice_groups_minus1', 0)), (0, _libCombinators.list)([(0, _libCombinators.data)('slice_group_map_type', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.equals)('slice_group_map_type', 0), (0, _libConditionals.each)(function (index, output) {
  return index <= output.num_slice_groups_minus1;
}, (0, _libCombinators.data)('run_length_minus1[]', (0, _libDataTypes.ue)(v)))), (0, _libConditionals.when)((0, _libConditionals.equals)('slice_group_map_type', 2), (0, _libConditionals.each)(function (index, output) {
  return index <= output.num_slice_groups_minus1;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('top_left[]', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('bottom_right[]', (0, _libDataTypes.ue)(v))]))), (0, _libConditionals.when)((0, _libConditionals.inArray)('slice_group_map_type', [3, 4, 5]), (0, _libCombinators.list)([(0, _libCombinators.data)('slice_group_change_direction_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('slice_group_change_rate_minus1', (0, _libDataTypes.ue)(v))])), (0, _libConditionals.when)((0, _libConditionals.equals)('slice_group_map_type', 6), (0, _libCombinators.list)([(0, _libCombinators.data)('pic_size_in_map_units_minus1', (0, _libDataTypes.ue)(v)), (0, _libConditionals.each)(function (index, output) {
  return index <= output.pic_size_in_map_units_minus1;
}, (0, _libCombinators.data)('slice_group_id[]', (0, _libDataTypes.ue)(v)))]))])), (0, _libCombinators.data)('num_ref_idx_l0_default_active_minus1', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('num_ref_idx_l1_default_active_minus1', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('weighted_pred_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('weighted_bipred_idc', (0, _libDataTypes.u)(2)), (0, _libCombinators.data)('pic_init_qp_minus26', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('pic_init_qs_minus26', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_qp_index_offset', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('deblocking_filter_control_present_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constrained_intra_pred_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('redundant_pic_cnt_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.whenMoreData)((0, _libCombinators.list)([(0, _libCombinators.data)('transform_8x8_mode_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('pic_scaling_matrix_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_scaling_matrix_present_flag', 1), (0, _libConditionals.each)(function (index, output) {
  return index < 6 + (output.chroma_format_Idc !== 3 ? 2 : 6) * output.transform_8x8_mode_flag;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('pic_scaling_list_present_flag[]', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_scaling_list_present_flag[]', 1), _scalingList2['default'])]))), (0, _libCombinators.data)('second_chroma_qp_index_offset', (0, _libDataTypes.se)(v))])), (0, _libCombinators.verify)('pic_parameter_set')]));

exports['default'] = ppsCodec;
module.exports = exports['default'];
},{"./lib/combinators":4,"./lib/conditionals":5,"./lib/data-types":6,"./scaling-list":11}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var scalingList = {
  decode: function decode(expGolomb, output, options, index) {
    var lastScale = 8;
    var nextScale = 8;
    var deltaScale = undefined;
    var count = 16;
    var scalingArr = [];

    if (!Array.isArray(output.scalingList)) {
      output.scalingList = [];
    }

    if (index >= 6) {
      count = 64;
    }

    for (var j = 0; j < count; j++) {
      if (nextScale !== 0) {
        deltaScale = expGolomb.readExpGolomb();
        nextScale = (lastScale + deltaScale + 256) % 256;
      }

      scalingArr[j] = nextScale === 0 ? lastScale : nextScale;
      lastScale = scalingArr[j];
    }

    output.scalingList[index] = scalingArr;

    return output;
  },
  encode: function encode(expGolomb, input, options, index) {
    var lastScale = 8;
    var nextScale = 8;
    var deltaScale = undefined;
    var count = 16;
    var output = '';

    if (!Array.isArray(input.scalingList)) {
      return '';
    }

    if (index >= 6) {
      count = 64;
    }

    var scalingArr = output.scalingList[index];

    for (var j = 0; j < count; j++) {
      if (scalingArr[j] === lastScale) {
        output += expGolomb.writeExpGolomb(-lastScale);
        break;
      }
      nextScale = scalingArr[j] - lastScale;
      output += expGolomb.writeExpGolomb(nextScale);
      lastScale = scalingArr[j];
    }
    return output;
  }
};

exports['default'] = scalingList;
module.exports = exports['default'];
},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libCombinators = require('./lib/combinators');

var _libConditionals = require('./lib/conditionals');

var _libDataTypes = require('./lib/data-types');

var _scalingList = require('./scaling-list');

var _scalingList2 = _interopRequireDefault(_scalingList);

var _vuiParameters = require('./vui-parameters');

var _vuiParameters2 = _interopRequireDefault(_vuiParameters);

var v = null;

var PROFILES_WITH_OPTIONAL_SPS_DATA = [44, 83, 86, 100, 110, 118, 122, 128, 134, 138, 139, 244];

var getChromaFormatIdcValue = {
  read: function read(expGolomb, output, options, index) {
    return output.chroma_format_idc || options.chroma_format_idc;
  },
  write: function write() {}
};

/**
  * NOW we are ready to build an SPS parser!
  */
var spsCodec = (0, _libCombinators.start)('seq_parameter_set', (0, _libCombinators.list)([
// defaults
(0, _libCombinators.data)('chroma_format_idc', (0, _libDataTypes.val)(1)), (0, _libCombinators.data)('video_format', (0, _libDataTypes.val)(5)), (0, _libCombinators.data)('color_primaries', (0, _libDataTypes.val)(2)), (0, _libCombinators.data)('transfer_characteristics', (0, _libDataTypes.val)(2)), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(1.0)), (0, _libCombinators.data)('profile_idc', (0, _libDataTypes.u)(8)), (0, _libCombinators.data)('constraint_set0_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set1_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set2_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set3_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set4_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set5_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set6_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set7_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('level_idc', (0, _libDataTypes.u)(8)), (0, _libCombinators.data)('seq_parameter_set_id', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.inArray)('profile_idc', PROFILES_WITH_OPTIONAL_SPS_DATA), (0, _libCombinators.list)([(0, _libCombinators.data)('chroma_format_idc', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.equals)('chroma_format_idc', 3), (0, _libCombinators.data)('separate_colour_plane_flag', (0, _libDataTypes.u)(1))), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('chroma_format_idc', 3)), (0, _libCombinators.data)('separate_colour_plane_flag', (0, _libDataTypes.val)(0))), (0, _libCombinators.data)('bit_depth_luma_minus8', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('bit_depth_chroma_minus8', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('qpprime_y_zero_transform_bypass_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('seq_scaling_matrix_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('seq_scaling_matrix_present_flag', 1), (0, _libConditionals.each)(function (index, output) {
  return index < (output.chroma_format_idc !== 3 ? 8 : 12);
}, (0, _libCombinators.list)([(0, _libCombinators.data)('seq_scaling_list_present_flag[]', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('seq_scaling_list_present_flag[]', 1), _scalingList2['default'])])))])), (0, _libCombinators.data)('log2_max_frame_num_minus4', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('pic_order_cnt_type', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_order_cnt_type', 0), (0, _libCombinators.data)('log2_max_pic_order_cnt_lsb_minus4', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_order_cnt_type', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('delta_pic_order_always_zero_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('offset_for_non_ref_pic', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('offset_for_top_to_bottom_field', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('num_ref_frames_in_pic_order_cnt_cycle', (0, _libDataTypes.ue)(v)), (0, _libConditionals.each)(function (index, output) {
  return index < output.num_ref_frames_in_pic_order_cnt_cycle;
}, (0, _libCombinators.data)('offset_for_ref_frame[]', (0, _libDataTypes.se)(v)))])), (0, _libCombinators.data)('max_num_ref_frames', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('gaps_in_frame_num_value_allowed_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('pic_width_in_mbs_minus1', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('pic_height_in_map_units_minus1', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('frame_mbs_only_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('frame_mbs_only_flag', 0), (0, _libCombinators.data)('mb_adaptive_frame_field_flag', (0, _libDataTypes.u)(1))), (0, _libCombinators.data)('direct_8x8_inference_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('frame_cropping_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('frame_cropping_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('frame_crop_left_offset', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('frame_crop_right_offset', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('frame_crop_top_offset', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('frame_crop_bottom_offset', (0, _libDataTypes.ue)(v))])), (0, _libCombinators.data)('vui_parameters_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('vui_parameters_present_flag', 1), _vuiParameters2['default']),
// The following field is a derived value that is used for parsing
// slice headers
(0, _libConditionals.when)((0, _libConditionals.equals)('separate_colour_plane_flag', 1), (0, _libCombinators.data)('ChromaArrayType', (0, _libDataTypes.val)(0))), (0, _libConditionals.when)((0, _libConditionals.equals)('separate_colour_plane_flag', 0), (0, _libCombinators.data)('ChromaArrayType', getChromaFormatIdcValue)), (0, _libCombinators.verify)('seq_parameter_set')]));

exports['default'] = spsCodec;
module.exports = exports['default'];
},{"./lib/combinators":4,"./lib/conditionals":5,"./lib/data-types":6,"./scaling-list":11,"./vui-parameters":15}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _libCombinators = require('./lib/combinators');

var _libConditionals = require('./lib/conditionals');

var _libDataTypes = require('./lib/data-types');

var v = null;

var sliceType = {
  P: [0, 5],
  B: [1, 6],
  I: [2, 7],
  SP: [3, 8],
  SI: [4, 9]
};

/**
 * Functions for calculating the number of bits to read for certain
 * properties based on the values in other properties (usually specified
 * in the SPS)
 */
var frameNumBits = function frameNumBits(expGolomb, data, options, index) {
  return options.log2_max_frame_num_minus4 + 4;
};

var picOrderCntBits = function picOrderCntBits(expGolomb, data, options, index) {
  return options.log2_max_pic_order_cnt_lsb_minus4 + 4;
};

var sliceGroupChangeCycleBits = function sliceGroupChangeCycleBits(expGolomb, data, options, index) {
  var picHeightInMapUnits = options.pic_height_in_map_units_minus1 + 1;
  var picWidthInMbs = options.pic_width_in_mbs_minus1 + 1;
  var sliceGroupChangeRate = options.slice_group_change_rate_minus1 + 1;
  var picSizeInMapUnits = picWidthInMbs * picHeightInMapUnits;

  return Math.ceil(Math.log(picSizeInMapUnits / sliceGroupChangeRate + 1) / Math.LN2);
};

var useWeightedPredictionTable = (0, _libConditionals.some)([(0, _libConditionals.every)([(0, _libConditionals.equals)('weighted_pred_flag', 1), (0, _libConditionals.some)([(0, _libConditionals.inArray)('slice_type', sliceType.P), (0, _libConditionals.inArray)('slice_type', sliceType.SP)])]), (0, _libConditionals.every)([(0, _libConditionals.equals)('weighted_bipred_idc', 1), (0, _libConditionals.inArray)('slice_type', sliceType.B)])]);

var refPicListModification = (0, _libCombinators.list)([(0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.not)((0, _libConditionals.inArray)('slice_type', sliceType.I)), (0, _libConditionals.not)((0, _libConditionals.inArray)('slice_type', sliceType.SI))]), (0, _libCombinators.list)([(0, _libCombinators.data)('ref_pic_list_modification_flag_l0', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('ref_pic_list_modification_flag_l0', 1), (0, _libConditionals.each)(function (index, output) {
  return index === 0 || output.modification_of_pic_nums_idc_l0[index - 1] !== 3;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('modification_of_pic_nums_idc_l0[]', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.inArray)('modification_of_pic_nums_idc_l0[]', [0, 1]), (0, _libCombinators.data)('abs_diff_pic_num_minus1_l0[]', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.equals)('modification_of_pic_nums_idc_l0[]', 2), (0, _libCombinators.data)('long_term_pic_num_l0[]', (0, _libDataTypes.ue)(v)))])))])), (0, _libConditionals.when)((0, _libConditionals.inArray)('slice_type', sliceType.B), (0, _libCombinators.list)([(0, _libCombinators.data)('ref_pic_list_modification_flag_l1', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('ref_pic_list_modification_flag_l1', 1), (0, _libConditionals.each)(function (index, output) {
  return index === 0 || output.modification_of_pic_nums_idc_l1[index - 1] !== 3;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('modification_of_pic_nums_idc_l1[]', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.inArray)('modification_of_pic_nums_idc_l1[]', [0, 1]), (0, _libCombinators.data)('abs_diff_pic_num_minus1_l1[]', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.equals)('modification_of_pic_nums_idc_l1[]', 2), (0, _libCombinators.data)('long_term_pic_num_l1[]', (0, _libDataTypes.ue)(v)))])))]))]);

var refPicListMvcModification = {
  encode: function encode() {
    throw new Error('ref_pic_list_mvc_modification: NOT IMPLEMENTED!');
  },
  decode: function decode() {
    throw new Error('ref_pic_list_mvc_modification: NOT IMPLEMENTED!');
  }
};

var predWeightTable = (0, _libCombinators.list)([(0, _libCombinators.data)('luma_log2_weight_denom', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('ChromaArrayType', 0)), (0, _libCombinators.data)('chroma_log2_weight_denom', (0, _libDataTypes.ue)(v))), (0, _libConditionals.each)(function (index, output) {
  return index <= output.num_ref_idx_l0_active_minus1;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('luma_weight_l0_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('luma_weight_l0_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('luma_weight_l0[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('luma_offset_l0[]', (0, _libDataTypes.se)(v)), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('ChromaArrayType', 0)), (0, _libCombinators.list)([(0, _libCombinators.data)('chroma_weight_l0_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('chroma_weight_l0_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('chroma_weight_l0_Cr[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_offset_l0_Cr[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_weight_l0_Cb[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_offset_l0_Cb[]', (0, _libDataTypes.se)(v))]))]))]))])), (0, _libConditionals.when)((0, _libConditionals.inArray)('slice_type', sliceType.B), (0, _libConditionals.each)(function (index, output) {
  return index <= output.num_ref_idx_l1_active_minus1;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('luma_weight_l1_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('luma_weight_l1_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('luma_weight_l1[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('luma_offset_l1[]', (0, _libDataTypes.se)(v)), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('ChromaArrayType', 0)), (0, _libCombinators.list)([(0, _libCombinators.data)('chroma_weight_l1_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('chroma_weight_l1_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('chroma_weight_l1_Cr[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_offset_l1_Cr[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_weight_l1_Cb[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_offset_l1_Cb[]', (0, _libDataTypes.se)(v))]))]))]))])))]);

var decRefPicMarking = (0, _libCombinators.list)([(0, _libConditionals.when)((0, _libConditionals.equals)('nal_unit_type', 5), (0, _libCombinators.list)([(0, _libCombinators.data)('no_output_of_prior_pics_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('long_term_reference_flag', (0, _libDataTypes.u)(1))])), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('nal_unit_type', 5)), (0, _libCombinators.list)([(0, _libCombinators.data)('adaptive_ref_pic_marking_mode_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('adaptive_ref_pic_marking_mode_flag', 1), (0, _libConditionals.each)(function (index, output) {
  return index === 0 || output.memory_management_control_operation[index - 1] !== 0;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('memory_management_control_operation[]', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.inArray)('memory_management_control_operation[]', [1, 3]), (0, _libCombinators.data)('difference_of_pic_nums_minus1[]', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.inArray)('memory_management_control_operation[]', [2]), (0, _libCombinators.data)('long_term_pic_num[]', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.inArray)('memory_management_control_operation[]', [3, 6]), (0, _libCombinators.data)('long_term_frame_idx[]', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.inArray)('memory_management_control_operation[]', [4]), (0, _libCombinators.data)('max_long_term_frame_idx_plus1[]', (0, _libDataTypes.ue)(v)))])))]))]);

var sliceHeader = (0, _libCombinators.list)([(0, _libCombinators.data)('first_mb_in_slice', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('slice_type', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('pic_parameter_set_id', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.equals)('separate_colour_plane_flag', 1), (0, _libCombinators.data)('colour_plane_id', (0, _libDataTypes.u)(2))), (0, _libCombinators.data)('frame_num', (0, _libDataTypes.u)(frameNumBits)), (0, _libConditionals.when)((0, _libConditionals.equals)('frame_mbs_only_flag', 0), (0, _libCombinators.list)([(0, _libCombinators.data)('field_pic_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('field_pic_flag', 1), (0, _libCombinators.data)('bottom_field_flag', (0, _libDataTypes.u)(1)))])), (0, _libConditionals.when)((0, _libConditionals.equals)('idrPicFlag', 1), (0, _libCombinators.data)('idr_pic_id', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_order_cnt_type', 0), (0, _libCombinators.list)([(0, _libCombinators.data)('pic_order_cnt_lsb', (0, _libDataTypes.u)(picOrderCntBits)), (0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.equals)('bottom_field_pic_order_in_frame_present_flag', 1), (0, _libConditionals.not)((0, _libConditionals.equals)('field_pic_flag', 1))]), (0, _libCombinators.data)('delta_pic_order_cnt_bottom', (0, _libDataTypes.se)(v)))])), (0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.equals)('pic_order_cnt_type', 1), (0, _libConditionals.not)((0, _libConditionals.equals)('delta_pic_order_always_zero_flag', 1))]), (0, _libCombinators.list)([(0, _libCombinators.data)('delta_pic_order_cnt[0]', (0, _libDataTypes.se)(v)), (0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.equals)('bottom_field_pic_order_in_frame_present_flag', 1), (0, _libConditionals.not)((0, _libConditionals.equals)('field_pic_flag', 1))]), (0, _libCombinators.data)('delta_pic_order_cnt[1]', (0, _libDataTypes.se)(v)))])), (0, _libConditionals.when)((0, _libConditionals.equals)('redundant_pic_cnt_present_flag', 1), (0, _libCombinators.data)('redundant_pic_cnt', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.inArray)('slice_type', sliceType.B), (0, _libCombinators.data)('direct_spatial_mv_pred_flag', (0, _libDataTypes.u)(1))), (0, _libConditionals.when)((0, _libConditionals.some)([(0, _libConditionals.inArray)('slice_type', sliceType.P), (0, _libConditionals.inArray)('slice_type', sliceType.SP), (0, _libConditionals.inArray)('slice_type', sliceType.B)]), (0, _libCombinators.list)([(0, _libCombinators.data)('num_ref_idx_active_override_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('num_ref_idx_active_override_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('num_ref_idx_l0_active_minus1', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.inArray)('slice_type', sliceType.B), (0, _libCombinators.data)('num_ref_idx_l1_active_minus1', (0, _libDataTypes.ue)(v)))]))])), (0, _libConditionals.when)((0, _libConditionals.some)([(0, _libConditionals.equals)('nal_unit_type', 20), (0, _libConditionals.equals)('nal_unit_type', 21)]), refPicListMvcModification), (0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.not)((0, _libConditionals.equals)('nal_unit_type', 20)), (0, _libConditionals.not)((0, _libConditionals.equals)('nal_unit_type', 21))]), refPicListModification), (0, _libConditionals.when)(useWeightedPredictionTable, predWeightTable), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('nal_ref_idc', 0)), decRefPicMarking), (0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.equals)('entropy_coding_mode_flag', 1), (0, _libConditionals.not)((0, _libConditionals.inArray)('slice_type', sliceType.I)), (0, _libConditionals.not)((0, _libConditionals.inArray)('slice_type', sliceType.SI))]), (0, _libCombinators.data)('cabac_init_idc', (0, _libDataTypes.ue)(v))), (0, _libCombinators.data)('slice_qp_delta', (0, _libDataTypes.se)(v)), (0, _libConditionals.when)((0, _libConditionals.inArray)('slice_type', sliceType.SP), (0, _libCombinators.data)('sp_for_switch_flag', (0, _libDataTypes.u)(1))), (0, _libConditionals.when)((0, _libConditionals.some)([(0, _libConditionals.inArray)('slice_type', sliceType.SP), (0, _libConditionals.inArray)('slice_type', sliceType.SI)]), (0, _libCombinators.data)('slice_qs_delta', (0, _libDataTypes.se)(v))), (0, _libConditionals.when)((0, _libConditionals.equals)('deblocking_filter_control_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('disable_deblocking_filter_idc', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('disable_deblocking_filter_idc', 1)), (0, _libCombinators.list)([(0, _libCombinators.data)('slice_alpha_c0_offset_div2', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('slice_beta_offset_div2', (0, _libDataTypes.se)(v))]))])), (0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.not)((0, _libConditionals.equals)('num_slice_groups_minus1', 0)), (0, _libConditionals.some)([(0, _libConditionals.equals)('slice_group_map_type', 3), (0, _libConditionals.equals)('slice_group_map_type', 4), (0, _libConditionals.equals)('slice_group_map_type', 5)])]), (0, _libCombinators.data)('slice_group_change_cycle', (0, _libDataTypes.u)(sliceGroupChangeCycleBits)))]);

exports['default'] = sliceHeader;
module.exports = exports['default'];
},{"./lib/combinators":4,"./lib/conditionals":5,"./lib/data-types":6}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sliceHeader = require('./slice-header');

var _sliceHeader2 = _interopRequireDefault(_sliceHeader);

var _libCombinators = require('./lib/combinators');

var sliceLayerWithoutPartitioningCodec = (0, _libCombinators.start)('slice_layer_without_partitioning', (0, _libCombinators.list)([_sliceHeader2['default']
// TODO: slice_data
]));

exports['default'] = sliceLayerWithoutPartitioningCodec;
module.exports = exports['default'];
},{"./lib/combinators":4,"./slice-header":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libCombinators = require('./lib/combinators');

var _libConditionals = require('./lib/conditionals');

var _libDataTypes = require('./lib/data-types');

var _hdrParameters = require('./hdr-parameters');

var _hdrParameters2 = _interopRequireDefault(_hdrParameters);

var v = null;

var sampleRatioCalc = (0, _libCombinators.list)([
/*
  1:1
 7680x4320 16:9 frame without horizontal overscan
 3840x2160 16:9 frame without horizontal overscan
 1280x720 16:9 frame without horizontal overscan
 1920x1080 16:9 frame without horizontal overscan (cropped from 1920x1088)
 640x480 4:3 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 1), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(1))),
/*
  12:11
 720x576 4:3 frame with horizontal overscan
 352x288 4:3 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 2), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(12 / 11))),
/*
  10:11
 720x480 4:3 frame with horizontal overscan
 352x240 4:3 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 3), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(10 / 11))),
/*
  16:11
 720x576 16:9 frame with horizontal overscan
 528x576 4:3 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 4), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(16 / 11))),
/*
  40:33
 720x480 16:9 frame with horizontal overscan
 528x480 4:3 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 5), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(40 / 33))),
/*
  24:11
 352x576 4:3 frame without horizontal overscan
 480x576 16:9 frame with horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 6), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(24 / 11))),
/*
  20:11
 352x480 4:3 frame without horizontal overscan
 480x480 16:9 frame with horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 7), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(20 / 11))),
/*
  32:11
 352x576 16:9 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 8), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(32 / 11))),
/*
  80:33
 352x480 16:9 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 9), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(80 / 33))),
/*
  18:11
 480x576 4:3 frame with horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 10), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(18 / 11))),
/*
  15:11
 480x480 4:3 frame with horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 11), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(15 / 11))),
/*
  64:33
 528x576 16:9 frame with horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 12), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(64 / 33))),
/*
  160:99
 528x480 16:9 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 13), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(160 / 99))),
/*
  4:3
 1440x1080 16:9 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 14), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(4 / 3))),
/*
  3:2
 1280x1080 16:9 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 15), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(3 / 2))),
/*
  2:1
 960x1080 16:9 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 16), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(2 / 1))),
/* Extended_SAR */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 255), (0, _libCombinators.list)([(0, _libCombinators.data)('sar_width', (0, _libDataTypes.u)(16)), (0, _libCombinators.data)('sar_height', (0, _libDataTypes.u)(16)), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(function (expGolomb, output, options) {
  return output.sar_width / output.sar_height;
}))]))]);

var vuiParamters = (0, _libCombinators.list)([(0, _libCombinators.data)('aspect_ratio_info_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_info_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('aspect_ratio_idc', (0, _libDataTypes.u)(8)), sampleRatioCalc])), (0, _libCombinators.data)('overscan_info_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('overscan_info_present_flag', 1), (0, _libCombinators.data)('overscan_appropriate_flag', (0, _libDataTypes.u)(1))), (0, _libCombinators.data)('video_signal_type_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('video_signal_type_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('video_format', (0, _libDataTypes.u)(3)), (0, _libCombinators.data)('video_full_range_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('colour_description_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('colour_description_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('colour_primaries', (0, _libDataTypes.u)(8)), (0, _libCombinators.data)('transfer_characteristics', (0, _libDataTypes.u)(8)), (0, _libCombinators.data)('matrix_coefficients', (0, _libDataTypes.u)(8))]))])), (0, _libCombinators.data)('chroma_loc_info_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('chroma_loc_info_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('chroma_sample_loc_type_top_field', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('chroma_sample_loc_type_bottom_field', (0, _libDataTypes.ue)(v))])), (0, _libCombinators.data)('timing_info_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('timing_info_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('num_units_in_tick', (0, _libDataTypes.u)(32)), (0, _libCombinators.data)('time_scale', (0, _libDataTypes.u)(32)), (0, _libCombinators.data)('fixed_frame_rate_flag', (0, _libDataTypes.u)(1))])), (0, _libCombinators.data)('nal_hrd_parameters_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('nal_hrd_parameters_present_flag', 1), _hdrParameters2['default']), (0, _libCombinators.data)('vcl_hrd_parameters_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('vcl_hrd_parameters_present_flag', 1), _hdrParameters2['default']), (0, _libConditionals.when)((0, _libConditionals.some)([(0, _libConditionals.equals)('nal_hrd_parameters_present_flag', 1), (0, _libConditionals.equals)('vcl_hrd_parameters_present_flag', 1)]), (0, _libCombinators.data)('low_delay_hrd_flag', (0, _libDataTypes.u)(1))), (0, _libCombinators.data)('pic_struct_present_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('bitstream_restriction_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('bitstream_restriction_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('motion_vectors_over_pic_boundaries_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('max_bytes_per_pic_denom', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('max_bits_per_mb_denom', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('log2_max_mv_length_horizontal', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('log2_max_mv_length_vertical', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('max_num_reorder_frames', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('max_dec_frame_buffering', (0, _libDataTypes.ue)(v))]))]);

exports['default'] = vuiParamters;
module.exports = exports['default'];
},{"./hdr-parameters":2,"./lib/combinators":4,"./lib/conditionals":5,"./lib/data-types":6}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var dataToHex = function dataToHex(value, indent) {
  // print out raw bytes as hexademical
  var bytes = Array.prototype.slice.call(new Uint8Array(value.buffer, value.byteOffset, value.byteLength)).map(function (byte) {
    return ('00' + byte.toString(16)).slice(-2);
  }).reduce(groupBy(8), []).map(function (a) {
    return a.join(' ');
  }).reduce(groupBy(2), []).map(function (a) {
    return a.join('  ');
  }).join('').match(/.{1,48}/g);

  if (!bytes) {
    return '<>';
  }

  if (bytes.length === 1) {
    return bytes.join('').slice(1);
  }

  return bytes.map(function (line) {
    return indent + line;
  }).join('\n');
};

var groupBy = function groupBy(count) {
  return function (p, c) {
    var last = p.pop();

    if (!last) {
      last = [];
    } else if (last.length === count) {
      p.push(last);
      last = [];
    }
    last.push(c);
    p.push(last);
    return p;
  };
};

exports['default'] = dataToHex;
module.exports = exports['default'];
},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _bitStreamsH264 = require('../../bit-streams/h264');

var lastSPS = undefined;
var lastPPS = undefined;
var lastOptions = undefined;

var mergePS = function mergePS(a, b) {
  var newObj = {};

  if (a) {
    Object.keys(a).forEach(function (key) {
      newObj[key] = a[key];
    });
  }

  if (b) {
    Object.keys(b).forEach(function (key) {
      newObj[key] = b[key];
    });
  }

  return newObj;
};

exports.mergePS = mergePS;
var nalParseAVCC = function nalParseAVCC(avcStream) {
  var avcView = new DataView(avcStream.buffer, avcStream.byteOffset, avcStream.byteLength),
      result = [],
      nalData,
      i,
      length;

  for (i = 0; i + 4 < avcStream.length; i += length) {
    length = avcView.getUint32(i);
    i += 4;

    // bail if this doesn't appear to be an H264 stream
    if (length <= 0) {
      result.push({
        type: 'MALFORMED-DATA'
      });
      continue;
    }
    if (length > avcStream.length) {
      result.push({
        type: 'UNKNOWN MDAT DATA'
      });
      return;
    }

    var nalUnit = avcStream.subarray(i, i + length);

    result.push(nalParse(nalUnit));
  }

  return result;
};

exports.nalParseAVCC = nalParseAVCC;
var nalParseAnnexB = function nalParseAnnexB(buffer) {
  var syncPoint = 0;
  var i = undefined;
  var result = [];

  // Rec. ITU-T H.264, Annex B
  // scan for NAL unit boundaries

  // a match looks like this:
  // 0 0 1 .. NAL .. 0 0 1
  // ^ sync point        ^ i
  // or this:
  // 0 0 1 .. NAL .. 0 0 0
  // ^ sync point        ^ i

  // advance the sync point to a NAL start, if necessary
  for (; syncPoint < buffer.byteLength - 3; syncPoint++) {
    if (buffer[syncPoint] === 0 && buffer[syncPoint + 1] === 0 && buffer[syncPoint + 2] === 1) {
      // the sync point is properly aligned
      i = syncPoint + 5;
      break;
    }
  }

  while (i < buffer.byteLength) {
    if (syncPoint === undefined) {
      debugger;
    }
    // look at the current byte to determine if we've hit the end of
    // a NAL unit boundary
    switch (buffer[i]) {
      case 0:
        // skip past non-sync sequences
        if (buffer[i - 1] !== 0) {
          i += 2;
          break;
        } else if (buffer[i - 2] !== 0) {
          i++;
          break;
        }

        // deliver the NAL unit if it isn't empty
        if (syncPoint + 3 !== i - 2) {
          result.push(nalParse(buffer.subarray(syncPoint + 3, i - 2)));
        }

        // drop trailing zeroes
        do {
          i++;
        } while (buffer[i] !== 1 && i < buffer.length);
        syncPoint = i - 2;
        i += 3;
        break;
      case 1:
        // skip past non-sync sequences
        if (buffer[i - 1] !== 0 || buffer[i - 2] !== 0) {
          i += 3;
          break;
        }

        // deliver the NAL unit
        result.push(nalParse(buffer.subarray(syncPoint + 3, i - 2)));
        syncPoint = i - 2;
        i += 3;
        break;
      default:
        // the current byte isn't a one or zero, so it cannot be part
        // of a sync sequence
        i += 3;
        break;
    }
  }
  // filter out the NAL units that were delivered
  buffer = buffer.subarray(syncPoint);
  i -= syncPoint;
  syncPoint = 0;

  // deliver the last buffered NAL unit
  if (buffer && buffer.byteLength > 3) {
    result.push(nalParse(buffer.subarray(syncPoint + 3)));
  }

  return result;
};

exports.nalParseAnnexB = nalParseAnnexB;
var nalParse = function nalParse(nalUnit) {
  var nalData = undefined;

  if (nalUnit.length > 1) {
    nalData = (0, _bitStreamsH264.discardEmulationPrevention)(nalUnit.subarray(1));
  } else {
    nalData = nalUnit;
  }

  var nalUnitType = nalUnit[0] & 0x1F;
  var nalRefIdc = (nalUnit[0] & 0x60) >>> 5;

  if (lastOptions) {
    lastOptions.nal_unit_type = nalUnitType;
    lastOptions.nal_ref_idc = nalRefIdc;
  }
  var nalObject = undefined;
  var newOptions = undefined;

  switch (nalUnitType) {
    case 0x01:
      nalObject = _bitStreamsH264.sliceLayerWithoutPartitioning.decode(nalData, lastOptions);
      nalObject.type = 'slice_layer_without_partitioning_rbsp';
      nalObject.nal_ref_idc = nalRefIdc;
      nalObject.size = nalData.length;
      return nalObject;
    case 0x02:
      return {
        type: 'slice_data_partition_a_layer_rbsp',
        size: nalData.length
      };
      break;
    case 0x03:
      return {
        type: 'slice_data_partition_b_layer_rbsp',
        size: nalData.length
      };
    case 0x04:
      return {
        type: 'slice_data_partition_c_layer_rbsp',
        size: nalData.length
      };
    case 0x05:
      newOptions = mergePS(lastOptions, { idrPicFlag: 1 });
      nalObject = _bitStreamsH264.sliceLayerWithoutPartitioning.decode(nalData, newOptions);
      nalObject.type = 'slice_layer_without_partitioning_rbsp_idr';
      nalObject.nal_ref_idc = nalRefIdc;
      nalObject.size = nalData.length;
      return nalObject;
    case 0x06:
      return {
        type: 'sei_rbsp',
        size: nalData.length
      };
    case 0x07:
      lastSPS = _bitStreamsH264.seqParameterSet.decode(nalData);
      lastOptions = mergePS(lastPPS, lastSPS);
      lastSPS.type = 'seq_parameter_set_rbsp';
      lastSPS.size = nalData.length;
      return lastSPS;
    case 0x08:
      lastPPS = _bitStreamsH264.picParameterSet.decode(nalData);
      lastOptions = mergePS(lastPPS, lastSPS);
      lastPPS.type = 'pic_parameter_set_rbsp';
      lastPPS.size = nalData.length;
      return lastPPS;
    case 0x09:
      nalObject = _bitStreamsH264.accessUnitDelimiter.decode(nalData);
      nalObject.type = 'access_unit_delimiter_rbsp';
      nalObject.size = nalData.length;
      return nalObject;
    case 0x0A:
      return {
        type: 'end_of_seq_rbsp',
        size: nalData.length
      };
    case 0x0B:
      return {
        type: 'end_of_stream_rbsp',
        size: nalData.length
      };
    case 0x0C:
      return {
        type: 'filler_data_rbsp',
        size: nalData.length
      };
    case 0x0D:
      return {
        type: 'seq_parameter_set_extension_rbsp',
        size: nalData.length
      };
    case 0x0E:
      return {
        type: 'prefix_nal_unit_rbsp',
        size: nalData.length
      };
    case 0x0F:
      return {
        type: 'subset_seq_parameter_set_rbsp',
        size: nalData.length
      };
    case 0x10:
      return {
        type: 'depth_parameter_set_rbsp',
        size: nalData.length
      };
    case 0x13:
      return {
        type: 'slice_layer_without_partitioning_rbsp_aux',
        size: nalData.length
      };
    case 0x14:
    case 0x15:
      return {
        type: 'slice_layer_extension_rbsp',
        size: nalData.length
      };
    default:
      return {
        type: 'INVALID NAL-UNIT-TYPE - ' + nalUnitType,
        size: nalData.length
      };
  }
};
},{"../../bit-streams/h264":3}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commonNalParse = require('./common/nal-parse');

var _commonDataToHexJs = require('./common/data-to-hex.js');

var _commonDataToHexJs2 = _interopRequireDefault(_commonDataToHexJs);

var tagTypes = {
  0x08: 'audio',
  0x09: 'video',
  0x12: 'metadata'
},
    hex = function hex(val) {
  return '0x' + ('00' + val.toString(16)).slice(-2).toUpperCase();
},
    hexStringList = function hexStringList(data) {
  var arr = [],
      i;

  while (data.byteLength > 0) {
    i = 0;
    arr.push(hex(data[i++]));
    data = data.subarray(i);
  }
  return arr.join(' ');
},
    parseAVCTag = function parseAVCTag(tag, obj) {
  var avcPacketTypes = ['AVC Sequence Header', 'AVC NALU', 'AVC End-of-Sequence'],
      compositionTime = tag[1] & parseInt('01111111', 2) << 16 | tag[2] << 8 | tag[3];

  obj = obj || {};

  obj.avcPacketType = avcPacketTypes[tag[0]];
  obj.CompositionTime = tag[1] & parseInt('10000000', 2) ? -compositionTime : compositionTime;

  if (tag[0] === 1) {
    obj.nals = (0, _commonNalParse.nalParseAVCC)(tag.subarray(4));
    obj.nalUnitTypeRaw = hexStringList(tag.subarray(4, 100));
  } else {
    obj.data = hexStringList(tag.subarray(4));
  }

  return obj;
},
    parseVideoTag = function parseVideoTag(tag, obj) {
  var frameTypes = ['Unknown', 'Keyframe (for AVC, a seekable frame)', 'Inter frame (for AVC, a nonseekable frame)', 'Disposable inter frame (H.263 only)', 'Generated keyframe (reserved for server use only)', 'Video info/command frame'],
      codecID = tag[0] & parseInt('00001111', 2);

  obj = obj || {};

  obj.frameType = frameTypes[(tag[0] & parseInt('11110000', 2)) >>> 4];
  obj.codecID = codecID;

  if (codecID === 7) {
    return parseAVCTag(tag.subarray(1), obj);
  }
  return obj;
},
    parseAACTag = function parseAACTag(tag, obj) {
  var packetTypes = ['AAC Sequence Header', 'AAC Raw'];

  obj = obj || {};

  obj.aacPacketType = packetTypes[tag[0]];
  obj.data = hexStringList(tag.subarray(1));

  return obj;
},
    parseAudioTag = function parseAudioTag(tag, obj) {
  var formatTable = ['Linear PCM, platform endian', 'ADPCM', 'MP3', 'Linear PCM, little endian', 'Nellymoser 16-kHz mono', 'Nellymoser 8-kHz mono', 'Nellymoser', 'G.711 A-law logarithmic PCM', 'G.711 mu-law logarithmic PCM', 'reserved', 'AAC', 'Speex', 'MP3 8-Khz', 'Device-specific sound'],
      samplingRateTable = ['5.5-kHz', '11-kHz', '22-kHz', '44-kHz'],
      soundFormat = (tag[0] & parseInt('11110000', 2)) >>> 4;

  obj = obj || {};

  obj.soundFormat = formatTable[soundFormat];
  obj.soundRate = samplingRateTable[(tag[0] & parseInt('00001100', 2)) >>> 2];
  obj.soundSize = (tag[0] & parseInt('00000010', 2)) >>> 1 ? '16-bit' : '8-bit';
  obj.soundType = tag[0] & parseInt('00000001', 2) ? 'Stereo' : 'Mono';

  if (soundFormat === 10) {
    return parseAACTag(tag.subarray(1), obj);
  }
  return obj;
},
    parseGenericTag = function parseGenericTag(tag) {
  return {
    tagType: tagTypes[tag[0]],
    dataSize: tag[1] << 16 | tag[2] << 8 | tag[3],
    timestamp: tag[7] << 24 | tag[4] << 16 | tag[5] << 8 | tag[6],
    streamID: tag[8] << 16 | tag[9] << 8 | tag[10]
  };
},
    inspectFlvTag = function inspectFlvTag(tag) {
  var header = parseGenericTag(tag);
  switch (tag[0]) {
    case 0x08:
      parseAudioTag(tag.subarray(11), header);
      break;
    case 0x09:
      parseVideoTag(tag.subarray(11), header);
      break;
    case 0x12:
  }
  return header;
},
    inspectFlv = function inspectFlv(bytes) {
  var i = 9,
      // header
  dataSize,
      parsedResults = [],
      tag;

  // traverse the tags
  i += 4; // skip previous tag size
  while (i < bytes.byteLength) {
    dataSize = bytes[i + 1] << 16;
    dataSize |= bytes[i + 2] << 8;
    dataSize |= bytes[i + 3];
    dataSize += 11;

    tag = bytes.subarray(i, i + dataSize);
    parsedResults.push(inspectFlvTag(tag));
    i += dataSize + 4;
  }
  return parsedResults;
};

exports['default'] = {
  inspect: inspectFlv
};
module.exports = exports['default'];
// domify: domifyFlv
},{"./common/data-to-hex.js":16,"./common/nal-parse":17}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mp4 = require('./mp4');

var _mp42 = _interopRequireDefault(_mp4);

var _ts = require('./ts');

var _ts2 = _interopRequireDefault(_ts);

var _flv = require('./flv');

var _flv2 = _interopRequireDefault(_flv);

exports['default'] = {
  mp4Inspector: _mp42['default'],
  tsInspector: _ts2['default'],
  flvInspector: _flv2['default']
};
module.exports = exports['default'];
},{"./flv":18,"./mp4":20,"./ts":21}],20:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bitStreamsH264 = require('../bit-streams/h264');

var _commonNalParse = require('./common/nal-parse');

var _commonDataToHexJs = require('./common/data-to-hex.js');

var _commonDataToHexJs2 = _interopRequireDefault(_commonDataToHexJs);

/**
 * Returns the string representation of an ASCII encoded four byte buffer.
 * @param buffer {Uint8Array} a four-byte buffer to translate
 * @return {string} the corresponding string
 */
var parseType = function parseType(buffer) {
  var result = '';
  result += String.fromCharCode(buffer[0]);
  result += String.fromCharCode(buffer[1]);
  result += String.fromCharCode(buffer[2]);
  result += String.fromCharCode(buffer[3]);
  return result;
};

var parseMp4Date = function parseMp4Date(seconds) {
  return new Date(seconds * 1000 - 2082844800000);
};

var parseSampleFlags = function parseSampleFlags(flags) {
  return {
    isLeading: (flags[0] & 0x0c) >>> 2,
    dependsOn: flags[0] & 0x03,
    isDependedOn: (flags[1] & 0xc0) >>> 6,
    hasRedundancy: (flags[1] & 0x30) >>> 4,
    paddingValue: (flags[1] & 0x0e) >>> 1,
    isNonSyncSample: flags[1] & 0x01,
    degradationPriority: flags[2] << 8 | flags[3]
  };
};

var lastSPS = undefined;
var lastPPS = undefined;
var lastOptions = undefined;

// registry of handlers for individual mp4 box types
var parse = {
  // codingname, not a first-class box type. stsd entries share the
  // same format as real boxes so the parsing infrastructure can be
  // shared
  avc1: function avc1(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    return {
      dataReferenceIndex: view.getUint16(6),
      width: view.getUint16(24),
      height: view.getUint16(26),
      horizresolution: view.getUint16(28) + view.getUint16(30) / 16,
      vertresolution: view.getUint16(32) + view.getUint16(34) / 16,
      frameCount: view.getUint16(40),
      depth: view.getUint16(74),
      config: inspectMp4(data.subarray(78, data.byteLength))
    };
  },
  avcC: function avcC(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        result = {
      configurationVersion: data[0],
      avcProfileIndication: data[1],
      profileCompatibility: data[2],
      avcLevelIndication: data[3],
      lengthSizeMinusOne: data[4] & 0x03,
      sps: [],
      pps: []
    },
        numOfSequenceParameterSets = data[5] & 0x1f,
        numOfPictureParameterSets,
        nalSize,
        offset,
        i;

    // iterate past any SPSs
    offset = 6;
    for (i = 0; i < numOfSequenceParameterSets; i++) {
      nalSize = view.getUint16(offset);
      offset += 2;
      var nalData = (0, _bitStreamsH264.discardEmulationPrevention)(new Uint8Array(data.subarray(offset + 1, offset + nalSize)));
      lastSPS = _bitStreamsH264.seqParameterSet.decode(nalData);
      lastOptions = (0, _commonNalParse.mergePS)(lastPPS, lastSPS);
      result.sps.push(lastSPS);
      offset += nalSize;
    }
    // iterate past any PPSs
    numOfPictureParameterSets = data[offset];
    offset++;
    for (i = 0; i < numOfPictureParameterSets; i++) {
      nalSize = view.getUint16(offset);
      offset += 2;
      var nalData = (0, _bitStreamsH264.discardEmulationPrevention)(new Uint8Array(data.subarray(offset + 1, offset + nalSize)));
      lastPPS = _bitStreamsH264.picParameterSet.decode(nalData);
      lastOptions = (0, _commonNalParse.mergePS)(lastPPS, lastSPS);
      result.pps.push(lastPPS);
      offset += nalSize;
    }
    return result;
  },
  btrt: function btrt(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    return {
      bufferSizeDB: view.getUint32(0),
      maxBitrate: view.getUint32(4),
      avgBitrate: view.getUint32(8)
    };
  },
  esds: function esds(data) {
    return {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      esId: data[6] << 8 | data[7],
      streamPriority: data[8] & 0x1f,
      decoderConfig: {
        objectProfileIndication: data[11],
        streamType: data[12] >>> 2 & 0x3f,
        bufferSize: data[13] << 16 | data[14] << 8 | data[15],
        maxBitrate: data[16] << 24 | data[17] << 16 | data[18] << 8 | data[19],
        avgBitrate: data[20] << 24 | data[21] << 16 | data[22] << 8 | data[23],
        decoderConfigDescriptor: {
          tag: data[24],
          length: data[25],
          audioObjectType: data[26] >>> 3 & 0x1f,
          samplingFrequencyIndex: (data[26] & 0x07) << 1 | data[27] >>> 7 & 0x01,
          channelConfiguration: data[27] >>> 3 & 0x0f
        }
      }
    };
  },
  ftyp: function ftyp(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        result = {
      majorBrand: parseType(data.subarray(0, 4)),
      minorVersion: view.getUint32(4),
      compatibleBrands: []
    },
        i = 8;
    while (i < data.byteLength) {
      result.compatibleBrands.push(parseType(data.subarray(i, i + 4)));
      i += 4;
    }
    return result;
  },
  dinf: function dinf(data) {
    return {
      boxes: inspectMp4(data)
    };
  },
  dref: function dref(data) {
    return {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      dataReferences: inspectMp4(data.subarray(8))
    };
  },
  hdlr: function hdlr(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        result = {
      version: view.getUint8(0),
      flags: new Uint8Array(data.subarray(1, 4)),
      handlerType: parseType(data.subarray(8, 12)),
      name: ''
    },
        i = 8;

    // parse out the name field
    for (i = 24; i < data.byteLength; i++) {
      if (data[i] === 0x00) {
        // the name field is null-terminated
        i++;
        break;
      }
      result.name += String.fromCharCode(data[i]);
    }
    // decode UTF-8 to javascript's internal representation
    // see http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html
    result.name = decodeURIComponent(global.escape(result.name));

    return result;
  },
  mdat: function mdat(data) {
    return {
      byteLength: data.byteLength,
      nals: (0, _commonNalParse.nalParseAVCC)(data)
    };
  },
  mdhd: function mdhd(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        i = 4,
        language,
        result = {
      version: view.getUint8(0),
      flags: new Uint8Array(data.subarray(1, 4)),
      language: ''
    };
    if (result.version === 1) {
      i += 4;
      result.creationTime = parseMp4Date(view.getUint32(i)); // truncating top 4 bytes
      i += 8;
      result.modificationTime = parseMp4Date(view.getUint32(i)); // truncating top 4 bytes
      i += 4;
      result.timescale = view.getUint32(i);
      i += 8;
      result.duration = view.getUint32(i); // truncating top 4 bytes
    } else {
        result.creationTime = parseMp4Date(view.getUint32(i));
        i += 4;
        result.modificationTime = parseMp4Date(view.getUint32(i));
        i += 4;
        result.timescale = view.getUint32(i);
        i += 4;
        result.duration = view.getUint32(i);
      }
    i += 4;
    // language is stored as an ISO-639-2/T code in an array of three 5-bit fields
    // each field is the packed difference between its ASCII value and 0x60
    language = view.getUint16(i);
    result.language += String.fromCharCode((language >> 10) + 0x60);
    result.language += String.fromCharCode(((language & 0x03c0) >> 5) + 0x60);
    result.language += String.fromCharCode((language & 0x1f) + 0x60);

    return result;
  },
  mdia: function mdia(data) {
    return {
      boxes: inspectMp4(data)
    };
  },
  mfhd: function mfhd(data) {
    return {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      sequenceNumber: data[4] << 24 | data[5] << 16 | data[6] << 8 | data[7]
    };
  },
  minf: function minf(data) {
    return {
      boxes: inspectMp4(data)
    };
  },
  // codingname, not a first-class box type. stsd entries share the
  // same format as real boxes so the parsing infrastructure can be
  // shared
  mp4a: function mp4a(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        result = {
      // 6 bytes reserved
      dataReferenceIndex: view.getUint16(6),
      // 4 + 4 bytes reserved
      channelcount: view.getUint16(16),
      samplesize: view.getUint16(18),
      // 2 bytes pre_defined
      // 2 bytes reserved
      samplerate: view.getUint16(24) + view.getUint16(26) / 65536
    };

    // if there are more bytes to process, assume this is an ISO/IEC
    // 14496-14 MP4AudioSampleEntry and parse the ESDBox
    if (data.byteLength > 28) {
      result.streamDescriptor = inspectMp4(data.subarray(28))[0];
    }
    return result;
  },
  moof: function moof(data) {
    return {
      boxes: inspectMp4(data)
    };
  },
  moov: function moov(data) {
    return {
      boxes: inspectMp4(data)
    };
  },
  mvex: function mvex(data) {
    return {
      boxes: inspectMp4(data)
    };
  },
  mvhd: function mvhd(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        i = 4,
        result = {
      version: view.getUint8(0),
      flags: new Uint8Array(data.subarray(1, 4))
    };

    if (result.version === 1) {
      i += 4;
      result.creationTime = parseMp4Date(view.getUint32(i)); // truncating top 4 bytes
      i += 8;
      result.modificationTime = parseMp4Date(view.getUint32(i)); // truncating top 4 bytes
      i += 4;
      result.timescale = view.getUint32(i);
      i += 8;
      result.duration = view.getUint32(i); // truncating top 4 bytes
    } else {
        result.creationTime = parseMp4Date(view.getUint32(i));
        i += 4;
        result.modificationTime = parseMp4Date(view.getUint32(i));
        i += 4;
        result.timescale = view.getUint32(i);
        i += 4;
        result.duration = view.getUint32(i);
      }
    i += 4;

    // convert fixed-point, base 16 back to a number
    result.rate = view.getUint16(i) + view.getUint16(i + 2) / 16;
    i += 4;
    result.volume = view.getUint8(i) + view.getUint8(i + 1) / 8;
    i += 2;
    i += 2;
    i += 2 * 4;
    result.matrix = new Uint32Array(data.subarray(i, i + 9 * 4));
    i += 9 * 4;
    i += 6 * 4;
    result.nextTrackId = view.getUint32(i);
    return result;
  },
  pdin: function pdin(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    return {
      version: view.getUint8(0),
      flags: new Uint8Array(data.subarray(1, 4)),
      rate: view.getUint32(4),
      initialDelay: view.getUint32(8)
    };
  },
  sdtp: function sdtp(data) {
    var result = {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      samples: []
    },
        i;

    for (i = 4; i < data.byteLength; i++) {
      result.samples.push({
        dependsOn: (data[i] & 0x30) >> 4,
        isDependedOn: (data[i] & 0x0c) >> 2,
        hasRedundancy: data[i] & 0x03
      });
    }
    return result;
  },
  sidx: function sidx(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        result = {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      references: [],
      referenceId: view.getUint32(4),
      timescale: view.getUint32(8),
      earliestPresentationTime: view.getUint32(12),
      firstOffset: view.getUint32(16)
    },
        referenceCount = view.getUint16(22),
        i;

    for (i = 24; referenceCount; i += 12, referenceCount--) {
      result.references.push({
        referenceType: (data[i] & 0x80) >>> 7,
        referencedSize: view.getUint32(i) & 0x7FFFFFFF,
        subsegmentDuration: view.getUint32(i + 4),
        startsWithSap: !!(data[i + 8] & 0x80),
        sapType: (data[i + 8] & 0x70) >>> 4,
        sapDeltaTime: view.getUint32(i + 8) & 0x0FFFFFFF
      });
    }

    return result;
  },
  smhd: function smhd(data) {
    return {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      balance: data[4] + data[5] / 256
    };
  },
  stbl: function stbl(data) {
    return {
      boxes: inspectMp4(data)
    };
  },
  stco: function stco(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        result = {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      chunkOffsets: []
    },
        entryCount = view.getUint32(4),
        i;
    for (i = 8; entryCount; i += 4, entryCount--) {
      result.chunkOffsets.push(view.getUint32(i));
    }
    return result;
  },
  stsc: function stsc(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        entryCount = view.getUint32(4),
        result = {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      sampleToChunks: []
    },
        i;
    for (i = 8; entryCount; i += 12, entryCount--) {
      result.sampleToChunks.push({
        firstChunk: view.getUint32(i),
        samplesPerChunk: view.getUint32(i + 4),
        sampleDescriptionIndex: view.getUint32(i + 8)
      });
    }
    return result;
  },
  stsd: function stsd(data) {
    return {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      sampleDescriptions: inspectMp4(data.subarray(8))
    };
  },
  stsz: function stsz(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        result = {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      sampleSize: view.getUint32(4),
      entries: []
    },
        i;
    for (i = 12; i < data.byteLength; i += 4) {
      result.entries.push(view.getUint32(i));
    }
    return result;
  },
  stts: function stts(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        result = {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      timeToSamples: []
    },
        entryCount = view.getUint32(4),
        i;

    for (i = 8; entryCount; i += 8, entryCount--) {
      result.timeToSamples.push({
        sampleCount: view.getUint32(i),
        sampleDelta: view.getUint32(i + 4)
      });
    }
    return result;
  },
  styp: function styp(data) {
    return parse.ftyp(data);
  },
  tfdt: function tfdt(data) {
    var result = {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      baseMediaDecodeTime: data[4] << 24 | data[5] << 16 | data[6] << 8 | data[7]
    };
    if (result.version === 1) {
      result.baseMediaDecodeTime *= Math.pow(2, 32);
      result.baseMediaDecodeTime += data[8] << 24 | data[9] << 16 | data[10] << 8 | data[11];
    }
    return result;
  },
  tfhd: function tfhd(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        result = {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      trackId: view.getUint32(4)
    },
        baseDataOffsetPresent = result.flags[2] & 0x01,
        sampleDescriptionIndexPresent = result.flags[2] & 0x02,
        defaultSampleDurationPresent = result.flags[2] & 0x08,
        defaultSampleSizePresent = result.flags[2] & 0x10,
        defaultSampleFlagsPresent = result.flags[2] & 0x20,
        i;

    i = 8;
    if (baseDataOffsetPresent) {
      i += 4; // truncate top 4 bytes
      result.baseDataOffset = view.getUint32(12);
      i += 4;
    }
    if (sampleDescriptionIndexPresent) {
      result.sampleDescriptionIndex = view.getUint32(i);
      i += 4;
    }
    if (defaultSampleDurationPresent) {
      result.defaultSampleDuration = view.getUint32(i);
      i += 4;
    }
    if (defaultSampleSizePresent) {
      result.defaultSampleSize = view.getUint32(i);
      i += 4;
    }
    if (defaultSampleFlagsPresent) {
      result.defaultSampleFlags = view.getUint32(i);
    }
    return result;
  },
  tkhd: function tkhd(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        i = 4,
        result = {
      version: view.getUint8(0),
      flags: new Uint8Array(data.subarray(1, 4))
    };
    if (result.version === 1) {
      i += 4;
      result.creationTime = parseMp4Date(view.getUint32(i)); // truncating top 4 bytes
      i += 8;
      result.modificationTime = parseMp4Date(view.getUint32(i)); // truncating top 4 bytes
      i += 4;
      result.trackId = view.getUint32(i);
      i += 4;
      i += 8;
      result.duration = view.getUint32(i); // truncating top 4 bytes
    } else {
        result.creationTime = parseMp4Date(view.getUint32(i));
        i += 4;
        result.modificationTime = parseMp4Date(view.getUint32(i));
        i += 4;
        result.trackId = view.getUint32(i);
        i += 4;
        i += 4;
        result.duration = view.getUint32(i);
      }
    i += 4;
    i += 2 * 4;
    result.layer = view.getUint16(i);
    i += 2;
    result.alternateGroup = view.getUint16(i);
    i += 2;
    // convert fixed-point, base 16 back to a number
    result.volume = view.getUint8(i) + view.getUint8(i + 1) / 8;
    i += 2;
    i += 2;
    result.matrix = new Uint32Array(data.subarray(i, i + 9 * 4));
    i += 9 * 4;
    result.width = view.getUint16(i) + view.getUint16(i + 2) / 16;
    i += 4;
    result.height = view.getUint16(i) + view.getUint16(i + 2) / 16;
    return result;
  },
  traf: function traf(data) {
    return {
      boxes: inspectMp4(data)
    };
  },
  trak: function trak(data) {
    return {
      boxes: inspectMp4(data)
    };
  },
  trex: function trex(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    return {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      trackId: view.getUint32(4),
      defaultSampleDescriptionIndex: view.getUint32(8),
      defaultSampleDuration: view.getUint32(12),
      defaultSampleSize: view.getUint32(16),
      sampleDependsOn: data[20] & 0x03,
      sampleIsDependedOn: (data[21] & 0xc0) >> 6,
      sampleHasRedundancy: (data[21] & 0x30) >> 4,
      samplePaddingValue: (data[21] & 0x0e) >> 1,
      sampleIsDifferenceSample: !!(data[21] & 0x01),
      sampleDegradationPriority: view.getUint16(22)
    };
  },
  trun: function trun(data) {
    var result = {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      samples: []
    },
        view = new DataView(data.buffer, data.byteOffset, data.byteLength),
        dataOffsetPresent = result.flags[2] & 0x01,
        firstSampleFlagsPresent = result.flags[2] & 0x04,
        sampleDurationPresent = result.flags[1] & 0x01,
        sampleSizePresent = result.flags[1] & 0x02,
        sampleFlagsPresent = result.flags[1] & 0x04,
        sampleCompositionTimeOffsetPresent = result.flags[1] & 0x08,
        sampleCount = view.getUint32(4),
        offset = 8,
        sample;

    if (dataOffsetPresent) {
      result.dataOffset = view.getUint32(offset);
      offset += 4;
    }

    if (firstSampleFlagsPresent && sampleCount) {
      sample = {
        flags: parseSampleFlags(data.subarray(offset, offset + 4))
      };
      offset += 4;
      if (sampleDurationPresent) {
        sample.duration = view.getUint32(offset);
        offset += 4;
      }
      if (sampleSizePresent) {
        sample.size = view.getUint32(offset);
        offset += 4;
      }
      if (sampleCompositionTimeOffsetPresent) {
        sample.compositionTimeOffset = view.getUint32(offset);
        offset += 4;
      }
      result.samples.push(sample);
      sampleCount--;
    }

    while (sampleCount--) {
      sample = {};
      if (sampleDurationPresent) {
        sample.duration = view.getUint32(offset);
        offset += 4;
      }
      if (sampleSizePresent) {
        sample.size = view.getUint32(offset);
        offset += 4;
      }
      if (sampleFlagsPresent) {
        sample.flags = parseSampleFlags(data.subarray(offset, offset + 4));
        offset += 4;
      }
      if (sampleCompositionTimeOffsetPresent) {
        sample.compositionTimeOffset = view.getUint32(offset);
        offset += 4;
      }
      result.samples.push(sample);
    }
    return result;
  },
  'url ': function url(data) {
    return {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4))
    };
  },
  vmhd: function vmhd(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    return {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      graphicsmode: view.getUint16(4),
      opcolor: new Uint16Array([view.getUint16(6), view.getUint16(8), view.getUint16(10)])
    };
  }
};

/**
 * Return a javascript array of box objects parsed from an ISO base
 * media file.
 * @param data {Uint8Array} the binary data of the media to be inspected
 * @return {array} a javascript array of potentially nested box objects
 */
var inspectMp4 = function inspectMp4(data) {
  var i = 0,
      result = [],
      view,
      size,
      type,
      end,
      box,
      seenMOOV = false,
      pendingMDAT = null;

  // Convert data from Uint8Array to ArrayBuffer, to follow Dataview API
  var ab = new ArrayBuffer(data.length);
  var v = new Uint8Array(ab);
  for (var z = 0; z < data.length; ++z) {
    v[z] = data[z];
  }
  view = new DataView(ab);

  while (i < data.byteLength) {
    // parse box data
    size = view.getUint32(i);
    type = parseType(data.subarray(i + 4, i + 8));
    end = size > 1 ? i + size : data.byteLength;

    if (type === 'moov') {
      seenMOOV = true;
    }

    if (type === 'mdat' && !seenMOOV) {
      pendingMDAT = data.subarray(i + 8, end);
    } else {
      // parse type-specific data
      box = (parse[type] || function (data) {
        return {
          data: data
        };
      })(data.subarray(i + 8, end));
      box.size = size;
      box.type = type;
      // store this box and move to the next
      result.push(box);
    }

    if (pendingMDAT && seenMOOV) {
      box = parse['mdat'](pendingMDAT);
      box.size = pendingMDAT.byteLength;
      box.type = 'mdat';
      // store this box and move to the next
      result.push(box);
      pendingMDAT = null;
    }

    i = end;
  }
  return result;
};

/**
 * Returns a textual representation of the javascript represtentation
 * of an MP4 file. You can use it as an alternative to
 * JSON.stringify() to compare inspected MP4s.
 * @param inspectedMp4 {array} the parsed array of boxes in an MP4
 * file
 * @param depth {number} (optional) the number of ancestor boxes of
 * the elements of inspectedMp4. Assumed to be zero if unspecified.
 * @return {string} a text representation of the parsed MP4
 */
var textifyMp4 = function textifyMp4(inspectedMp4, depth) {
  var indent;
  depth = depth || 0;
  indent = new Array(depth * 2 + 1).join(' ');

  // iterate over all the boxes
  return inspectedMp4.map(function (box, index) {

    // list the box type first at the current indentation level
    return indent + box.type + '\n' +

    // the type is already included and handle child boxes separately
    Object.keys(box).filter(function (key) {
      return key !== 'type' && key !== 'boxes';

      // output all the box properties
    }).map(function (key) {
      var prefix = indent + '  ' + key + ': ',
          value = box[key];

      // print out raw bytes as hexademical
      if (value instanceof Uint8Array || value instanceof Uint32Array) {
        return prefix + (0, _commonDataToHexJs2['default'])(value, indent);
      }

      // stringify generic objects
      return prefix + JSON.stringify(value, null, 2).split('\n').map(function (line, index) {
        if (index === 0) {
          return line;
        }
        return indent + '  ' + line;
      }).join('\n');
    }).join('\n') + (

    // recursively textify the child boxes
    box.boxes ? '\n' + textifyMp4(box.boxes, depth + 1) : '');
  }).join('\n');
};

var domifyMp4 = function domifyMp4(inspectedMp4) {
  var topLevelObject = {
    type: 'mp4',
    boxes: inspectedMp4,
    size: inspectedMp4.reduce(function (sum, box) {
      return sum + box.size;
    }, 0)
  };

  var container = document.createElement('div');

  domifyBox(topLevelObject, container, 1);

  return container;
};

/*
<boxType size="100" flags>
  <properties>
    <name></name><value></value>
    <name></name><value></value>
  </properties>
  <boxes>
  </boxes>
</boxType>
*/

var domifyBox = function domifyBox(box, parentNode, depth) {
  var isObject = function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
  };
  var attributes = ['size', 'flags', 'type', 'version'];
  var specialProperties = ['boxes', 'nals', 'samples'];
  var objectProperties = Object.keys(box).filter(function (key) {
    return isObject(box[key]) || Array.isArray(box[key]) && isObject(box[key][0]);
  });
  var propertyExclusions = attributes.concat(specialProperties).concat(objectProperties);
  var subProperties = Object.keys(box).filter(function (key) {
    return propertyExclusions.indexOf(key) === -1;
  });

  var boxNode = document.createElement('mp4-box');
  var propertyNode = document.createElement('mp4-properties');
  var subBoxesNode = document.createElement('mp4-boxes');
  var boxTypeNode = document.createElement('mp4-box-type');

  if (box.type) {
    boxTypeNode.textContent = box.type;

    if (depth > 1) {
      boxTypeNode.classList.add('collapsed');
    }

    boxNode.appendChild(boxTypeNode);
  }

  attributes.forEach(function (key) {
    if (typeof box[key] !== 'undefined') {
      boxNode.setAttribute('data-' + key, box[key]);
    }
  });

  if (subProperties.length) {
    subProperties.forEach(function (key) {
      makeProperty(key, box[key], propertyNode);
    });
    boxNode.appendChild(propertyNode);
  }

  if (box.boxes && box.boxes.length) {
    box.boxes.forEach(function (subBox) {
      return domifyBox(subBox, subBoxesNode, depth + 1);
    });
    boxNode.appendChild(subBoxesNode);
  } else if (objectProperties.length) {
    objectProperties.forEach(function (key) {
      if (Array.isArray(box[key])) {
        domifyBox({
          type: key,
          boxes: box[key]
        }, subBoxesNode, depth + 1);
      } else {
        domifyBox(box[key], subBoxesNode, depth + 1);
      }
    });
    boxNode.appendChild(subBoxesNode);
  }

  parentNode.appendChild(boxNode);
};

var makeProperty = function makeProperty(name, value, parentNode) {
  var nameNode = document.createElement('mp4-name');
  var valueNode = document.createElement('mp4-value');
  var propertyNode = document.createElement('mp4-property');

  nameNode.setAttribute('data-name', name);
  nameNode.textContent = name;

  if (value instanceof Uint8Array || value instanceof Uint32Array) {
    var strValue = (0, _commonDataToHexJs2['default'])(value, '');
    var truncValue = strValue.slice(0, 1029); // 21 rows of 16 bytes

    if (truncValue.length < strValue.length) {
      truncValue += '<' + (value.byteLength - 336) + 'b remaining of ' + value.byteLength + 'b total>';
    }

    valueNode.setAttribute('data-value', truncValue.toUpperCase());
    valueNode.innerHTML = truncValue;
    valueNode.classList.add('pre-like');
  } else if (Array.isArray(value)) {
    var strValue = '[' + value.join(', ') + ']';
    valueNode.setAttribute('data-value', strValue);
    valueNode.textContent = strValue;
  } else {
    valueNode.setAttribute('data-value', value);
    valueNode.textContent = value;
  }

  propertyNode.appendChild(nameNode);
  propertyNode.appendChild(valueNode);

  parentNode.appendChild(propertyNode);
};

exports['default'] = {
  inspect: inspectMp4,
  textify: textifyMp4,
  domify: domifyMp4
};
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../bit-streams/h264":3,"./common/data-to-hex.js":16,"./common/nal-parse":17}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commonNalParse = require('./common/nal-parse');

var _commonDataToHexJs = require('./common/data-to-hex.js');

var _commonDataToHexJs2 = _interopRequireDefault(_commonDataToHexJs);

// constants
var MP2T_PACKET_LENGTH = 188; // in bytes
var SYNC_BYTE = 0x47;
var STREAM_TYPES = {
  h264: 0x1b,
  adts: 0x0f,
  metadata: 0x15
};

/**
 * Splits an incoming stream of binary data into MPEG-2 Transport
 * Stream packets.
 */
var parseTransportStream = function parseTransportStream(bytes) {
  var startIndex = 0,
      endIndex = MP2T_PACKET_LENGTH,
      lastSync = -1,
      packets = [];

  // While we have enough data for a packet
  while (endIndex < bytes.byteLength) {
    // Look for a pair of start and end sync bytes in the data..
    if (bytes[startIndex] === SYNC_BYTE && bytes[endIndex] === SYNC_BYTE) {
      if (lastSync !== -1) {
        packets.push({
          type: 'unknown-bytes',
          data: bytes.subarray(lastSync, startIndex)
        });
        lastSync = -1;
      }

      // We found a packet so emit it and jump one whole packet forward in
      // the stream
      packets.push({
        type: 'transportstream-packet',
        data: bytes.subarray(startIndex, endIndex)
      });
      startIndex += MP2T_PACKET_LENGTH;
      endIndex += MP2T_PACKET_LENGTH;
      continue;
    }
    // If we get here, we have somehow become de-synchronized and we need to step
    // forward one byte at a time until we find a pair of sync bytes that denote
    // a packet
    lastSync = startIndex;
    startIndex++;
    endIndex++;
  }

  if (startIndex + MP2T_PACKET_LENGTH === bytes.byteLength) {
    // We found a final packet so emit it and jump one whole packet forward in
    // the stream
    packets.push({
      type: 'transportstream-packet',
      data: bytes.subarray(startIndex, endIndex)
    });
    startIndex += MP2T_PACKET_LENGTH;
    endIndex += MP2T_PACKET_LENGTH;
  }

  // If there was some data left over at the end of the segment that couldn't
  // possibly be a whole packet, emit it for completeness
  if (startIndex < bytes.byteLength) {
    packets.push({
      type: 'unknown-bytes',
      data: bytes.subarray(startIndex)
    });
  }

  return parseTransportStreamPackets(packets);
};

/**
 * Accepts an MP2T TransportPacketStream and emits data events with parsed
 * forms of the individual transport stream packets.
 */
var parseTransportStreamPackets = function parseTransportStreamPackets(packets) {
  var packetsPendingPmt = [];
  var packetsPendingPmtPid = [];
  var programMapTable = null;
  var pmtPid = null;

  var processPmtOrPes = function processPmtOrPes(packet) {
    if (packet.pid === pmtPid) {
      packet.content.type = 'pmt';
      parsePsi(packet);
    } else if (programMapTable === null) {
      // When we have not seen a PMT yet, defer further processing of
      // PES packets until one has been parsed
      packetsPendingPmt.push(packet);
    } else {
      processPes(packet);
    }
  };

  var processPes = function processPes(packet) {
    packet.content.streamType = programMapTable[packet.pid];
    packet.content.type = 'pes';
  };

  var parsePsi = function parsePsi(packet) {
    var offset = 0;
    var psi = packet.content;
    var payload = psi.data;

    // PSI packets may be split into multiple sections and those
    // sections may be split into multiple packets. If a PSI
    // section starts in this packet, the payload_unit_start_indicator
    // will be true and the first byte of the payload will indicate
    // the offset from the current position to the start of the
    // section.
    if (packet.payloadUnitStartIndicator) {
      offset += payload[0] + 1;
    }

    psi.data = payload.subarray(offset);

    if (psi.type === 'pat') {
      parsePat(packet);
    } else {
      parsePmt(packet);
    }
  };

  var parsePat = function parsePat(packet) {
    var pat = packet.content;
    var payload = pat.data;

    pat.sectionNumber = payload[7]; // eslint-disable-line camelcase
    pat.lastSectionNumber = payload[8]; // eslint-disable-line camelcase

    // skip the PSI header and parse the first PMT entry
    pmtPid = (payload[10] & 0x1F) << 8 | payload[11];
    pat.pmtPid = pmtPid;

    // if there are any packets waiting for a PMT PID to be found, process them now
    while (packetsPendingPmtPid.length) {
      processPmtOrPes(packetsPendingPmtPid.shift());
    }
  };

  /**
   * Parse out the relevant fields of a Program Map Table (PMT).
   * @param payload {Uint8Array} the PMT-specific portion of an MP2T
   * packet. The first byte in this array should be the table_id
   * field.
   * @param pmt {object} the object that should be decorated with
   * fields parsed from the PMT.
   */
  var parsePmt = function parsePmt(packet) {
    var pmt = packet.content;
    var payload = pmt.data;

    var sectionLength, tableEnd, programInfoLength, offset;

    // PMTs can be sent ahead of the time when they should actually
    // take effect. We don't believe this should ever be the case
    // for HLS but we'll ignore "forward" PMT declarations if we see
    // them. Future PMT declarations have the current_next_indicator
    // set to zero.
    if (!(payload[5] & 0x01)) {
      return;
    }

    // overwrite any existing program map table
    programMapTable = {};

    // the mapping table ends at the end of the current section
    sectionLength = (payload[1] & 0x0f) << 8 | payload[2];
    tableEnd = 3 + sectionLength - 4;

    // to determine where the table is, we have to figure out how
    // long the program info descriptors are
    programInfoLength = (payload[10] & 0x0f) << 8 | payload[11];

    // advance the offset to the first entry in the mapping table
    offset = 12 + programInfoLength;
    while (offset < tableEnd) {
      // add an entry that maps the elementary_pid to the stream_type
      programMapTable[(payload[offset + 1] & 0x1F) << 8 | payload[offset + 2]] = payload[offset];

      // move to the next table entry
      // skip past the elementary stream descriptors, if present
      offset += ((payload[offset + 3] & 0x0F) << 8 | payload[offset + 4]) + 5;
    }

    // record the map on the packet as well
    pmt.programMapTable = programMapTable;

    // if there are any packets waiting for a PMT to be found, process them now
    while (packetsPendingPmt.length) {
      processPes(packetsPendingPmt.shift());
    }
  };

  /**
   * Deliver a new MP2T packet to the stream.
   */
  var parsePacket = function parsePacket(packet) {
    var offset = 4;
    var payload = packet.data;
    var content = {};

    packet.payloadUnitStartIndicator = !!(payload[1] & 0x40);

    // pid is a 13-bit field starting at the last bit of packet[1]
    packet.pid = payload[1] & 0x1f;
    packet.pid <<= 8;
    packet.pid |= payload[2];
    packet.content = content;

    // if an adaption field is present, its length is specified by the
    // fifth byte of the TS packet header. The adaptation field is
    // used to add stuffing to PES packets that don't fill a complete
    // TS packet, and to specify some forms of timing and control data
    // that we do not currently use.
    if ((payload[3] & 0x30) >>> 4 > 0x01) {
      offset += payload[offset] + 1;
    }

    content.data = payload.subarray(offset);

    // parse the rest of the packet based on the type
    if (packet.pid === 0) {
      content.type = 'pat';
      parsePsi(packet);
      return packet;
    }

    if (pmtPid === null) {
      packetsPendingPmtPid.push(packet);
      return packet;
    }

    return processPmtOrPes(packet);
  };

  packets.filter(function (packet) {
    return packet.type === 'transportstream-packet';
  }).forEach(function (packet) {
    if (packet.type === 'transportstream-packet') {
      parsePacket(packet);
    } else {
      packet.content = {};
    }
  });

  return packets;
};

/**
 * Reconsistutes program elementary stream (PES) packets from parsed
 * transport stream packets. That is, if you pipe an
 * mp2t.TransportParseStream into a mp2t.ElementaryStream, the output
 * events will be events which capture the bytes for individual PES
 * packets plus relevant metadata that has been extracted from the
 * container.
 */
var parsePesPackets = function parsePesPackets(packets) {
  var completeEs = [],

  // PES packet fragments
  video = {
    data: [],
    tsPacketIndices: [],
    size: 0
  },
      audio = {
    data: [],
    tsPacketIndices: [],
    size: 0
  },
      timedMetadata = {
    data: [],
    tsPacketIndices: [],
    size: 0
  },
      parsePes = function parsePes(payload, pes) {
    var ptsDtsFlags;

    // find out if this packets starts a new keyframe
    pes.dataAlignmentIndicator = (payload[6] & 0x04) !== 0;
    // PES packets may be annotated with a PTS value, or a PTS value
    // and a DTS value. Determine what combination of values is
    // available to work with.
    ptsDtsFlags = payload[7];

    // PTS and DTS are normally stored as a 33-bit number.  Javascript
    // performs all bitwise operations on 32-bit integers but javascript
    // supports a much greater range (52-bits) of integer using standard
    // mathematical operations.
    // We construct a 31-bit value using bitwise operators over the 31
    // most significant bits and then multiply by 4 (equal to a left-shift
    // of 2) before we add the final 2 least significant bits of the
    // timestamp (equal to an OR.)
    if (ptsDtsFlags & 0xC0) {
      // the PTS and DTS are not written out directly. For information
      // on how they are encoded, see
      // http://dvd.sourceforge.net/dvdinfo/pes-hdr.html
      pes.pts = (payload[9] & 0x0E) << 27 | (payload[10] & 0xFF) << 20 | (payload[11] & 0xFE) << 12 | (payload[12] & 0xFF) << 5 | (payload[13] & 0xFE) >>> 3;
      pes.pts *= 4; // Left shift by 2
      pes.pts += (payload[13] & 0x06) >>> 1; // OR by the two LSBs
      pes.dts = pes.pts;
      if (ptsDtsFlags & 0x40) {
        pes.dts = (payload[14] & 0x0E) << 27 | (payload[15] & 0xFF) << 20 | (payload[16] & 0xFE) << 12 | (payload[17] & 0xFF) << 5 | (payload[18] & 0xFE) >>> 3;
        pes.dts *= 4; // Left shift by 2
        pes.dts += (payload[18] & 0x06) >>> 1; // OR by the two LSBs
      }
    }

    // the data section starts immediately after the PES header.
    // pes_header_data_length specifies the number of header bytes
    // that follow the last byte of the field.
    pes.data = payload.subarray(9 + payload[8]);
  },
      flushStream = function flushStream(stream, type) {
    var packetData = new Uint8Array(stream.size),
        event = {
      type: type
    },
        i = 0,
        fragment;

    // do nothing if there is no buffered data
    if (!stream.data.length) {
      return;
    }
    event.pid = stream.pid;
    event.packetCount = stream.data.length;
    event.tsPacketIndices = stream.tsPacketIndices;
    // reassemble the packet
    while (stream.data.length) {
      fragment = stream.data.shift();

      packetData.set(fragment.data, i);
      i += fragment.data.byteLength;
    }

    // parse assembled packet's PES header
    parsePes(packetData, event);

    stream.size = 0;
    stream.tsPacketIndices = [];

    completeEs.push(event);
  };

  var packetTypes = {
    pat: function pat(packet, packetIndex) {
      var pat = packet.content;
      completeEs.push({
        pid: packet.pid,
        type: 'pat',
        packetCount: 1,
        sectionNumber: pat.sectionNumber,
        lastSectionNumber: pat.lastSectionNumber,
        tsPacketIndices: [packetIndex],
        pmtPid: pat.pmtPid,
        data: pat.data
      });
    },
    pes: function pes(packet, packetIndex) {
      var stream = undefined;
      var streamType = undefined;
      var pes = packet.content;

      switch (pes.streamType) {
        case STREAM_TYPES.h264:
          stream = video;
          streamType = 'video';
          break;
        case STREAM_TYPES.adts:
          stream = audio;
          streamType = 'audio';
          break;
        case STREAM_TYPES.metadata:
          stream = timedMetadata;
          streamType = 'timed-metadata';
          break;
        default:
          // ignore unknown stream types
          return;
      }

      // if a new packet is starting, we can flush the completed
      // packet
      if (packet.payloadUnitStartIndicator) {
        flushStream(stream, streamType);
      }

      stream.pid = packet.pid;
      stream.tsPacketIndices.push(packetIndex);
      // buffer this fragment until we are sure we've received the
      // complete payload
      stream.data.push(pes);
      stream.size += pes.data.byteLength;
    },
    pmt: function pmt(packet, packetIndex) {
      var pmt = packet.content;
      var programMapTable = pmt.programMapTable;
      var event = {
        pid: packet.pid,
        type: 'pmt',
        tracks: [],
        tsPacketIndices: [packetIndex],
        packetCount: 1,
        data: pmt.data
      };
      var k = undefined;
      var track = undefined;

      // translate streams to tracks
      for (k in programMapTable) {
        if (programMapTable.hasOwnProperty(k)) {
          track = {};

          track.id = +k;
          if (programMapTable[k] === STREAM_TYPES.h264) {
            track.codec = 'avc';
            track.type = 'video';
          } else if (programMapTable[k] === STREAM_TYPES.adts) {
            track.codec = 'adts';
            track.type = 'audio';
          }
          event.tracks.push(track);
        }
      }
      completeEs.push(event);
    }
  };

  var parsePacket = function parsePacket(packet, packetIndex) {
    switch (packet.content.type) {
      case 'pat':
      case 'pmt':
      case 'pes':
        packetTypes[packet.content.type](packet, packetIndex);
        break;
      default:
        break;
    }
  };

  packets.forEach(function (packet, packetIndex) {
    parsePacket(packet, packetIndex);
  });

  flushStream(video, 'video');
  flushStream(audio, 'audio');
  flushStream(timedMetadata, 'timed-metadata');

  return completeEs;
};

var inspectTs = function inspectTs(data) {
  var object = {};
  var tsPackets = parseTransportStream(data);
  var pesPackets = parsePesPackets(tsPackets);

  object.tsMap = tsPackets;
  object.esMap = pesPackets;

  return object;
};

var domifyTs = function domifyTs(object) {
  var tsPackets = object.tsMap;
  var pesPackets = object.esMap;
  var container = document.createElement('div');

  parsePESPackets(pesPackets, container, 1);

  return container;
};

var parsePESPackets = function parsePESPackets(pesPackets, parent, depth) {
  pesPackets.forEach(function (packet) {
    var packetEl = document.createElement('div');
    domifyBox(parseNals(packet), parent, depth + 1);
  });
};

var parseNals = function parseNals(packet) {
  if (packet.type === 'video') {
    packet.nals = (0, _commonNalParse.nalParseAnnexB)(packet.data);
  }
  return packet;
};

var domifyBox = function domifyBox(box, parentNode, depth) {
  var isObject = function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
  };
  var attributes = ['size', 'flags', 'type', 'version'];
  var specialProperties = ['boxes', 'nals', 'samples', 'packetCount'];
  var objectProperties = Object.keys(box).filter(function (key) {
    return isObject(box[key]) || Array.isArray(box[key]) && isObject(box[key][0]);
  });
  var propertyExclusions = attributes.concat(specialProperties).concat(objectProperties);
  var subProperties = Object.keys(box).filter(function (key) {
    return propertyExclusions.indexOf(key) === -1;
  });

  var boxNode = document.createElement('mp4-box');
  var propertyNode = document.createElement('mp4-properties');
  var subBoxesNode = document.createElement('mp4-boxes');
  var boxTypeNode = document.createElement('mp4-box-type');

  if (box.type) {
    boxTypeNode.textContent = box.type;

    if (depth > 1) {
      boxTypeNode.classList.add('collapsed');
    }

    boxNode.appendChild(boxTypeNode);
  }

  attributes.forEach(function (key) {
    if (typeof box[key] !== 'undefined') {
      boxNode.setAttribute('data-' + key, box[key]);
    }
  });

  if (subProperties.length) {
    subProperties.forEach(function (key) {
      makeProperty(key, box[key], propertyNode);
    });
    boxNode.appendChild(propertyNode);
  }

  if (box.boxes && box.boxes.length) {
    box.boxes.forEach(function (subBox) {
      return domifyBox(subBox, subBoxesNode, depth + 1);
    });
    boxNode.appendChild(subBoxesNode);
  } else if (objectProperties.length) {
    objectProperties.forEach(function (key) {
      if (Array.isArray(box[key])) {
        domifyBox({
          type: key,
          boxes: box[key]
        }, subBoxesNode, depth + 1);
      } else {
        domifyBox(box[key], subBoxesNode, depth + 1);
      }
    });
    boxNode.appendChild(subBoxesNode);
  }

  parentNode.appendChild(boxNode);
};

var makeProperty = function makeProperty(name, value, parentNode) {
  var nameNode = document.createElement('mp4-name');
  var valueNode = document.createElement('mp4-value');
  var propertyNode = document.createElement('mp4-property');

  nameNode.setAttribute('data-name', name);
  nameNode.textContent = name;

  if (value instanceof Uint8Array || value instanceof Uint32Array) {
    var strValue = (0, _commonDataToHexJs2['default'])(value, '');
    var truncValue = strValue.slice(0, 1029); // 21 rows of 16 bytes

    if (truncValue.length < strValue.length) {
      truncValue += '<' + (value.byteLength - 336) + 'b remaining of ' + value.byteLength + 'b total>';
    }

    valueNode.setAttribute('data-value', truncValue.toUpperCase());
    valueNode.innerHTML = truncValue;
    valueNode.classList.add('pre-like');
  } else if (Array.isArray(value)) {
    var strValue = '[' + value.join(', ') + ']';
    valueNode.setAttribute('data-value', strValue);
    valueNode.textContent = strValue;
  } else {
    valueNode.setAttribute('data-value', value);
    valueNode.textContent = value;
  }

  propertyNode.appendChild(nameNode);
  propertyNode.appendChild(valueNode);

  parentNode.appendChild(propertyNode);
};

exports['default'] = {
  inspect: inspectTs,
  domify: domifyTs
};
module.exports = exports['default'];
},{"./common/data-to-hex.js":16,"./common/nal-parse":17}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bitStreamsH264 = require('./bit-streams/h264');

var _bitStreamsH2642 = _interopRequireDefault(_bitStreamsH264);

var _inspectors = require('./inspectors');

var thumbCoil = {
  h264Codecs: _bitStreamsH2642['default'],
  mp4Inspector: _inspectors.mp4Inspector,
  tsInspector: _inspectors.tsInspector,
  flvInspector: _inspectors.flvInspector
};

// Include the version number.
thumbCoil.VERSION = '1.1.0';

exports['default'] = thumbCoil;
module.exports = exports['default'];
},{"./bit-streams/h264":3,"./inspectors":19}]},{},[22])(22)
});