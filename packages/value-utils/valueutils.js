_ = _ || {};

_.toroidalValue = function(minVal, maxVal, value) {
	var result = value;
	if (value >= maxVal)
		result = value % maxVal;
	else if (value < minVal)
		result = maxVal + (value % maxVal);
	return result;
};

_.boundsValue = function(minVal, maxVal, value) {
	var result = value;
	if (value >= maxVal)
		result = maxVal - 1;
	else if (value < minVal) {
		result = minVal;
	}
	return result;
};

_.indexBounds = function(index, arr, toroidal) {
	minVal = 0;
	maxVal = arr.length;
	if (toroidal) {
		return _.toroidalValue(minVal, maxVal, index);
	} else {
		return _.boundsValue(minVal, maxVal, index);
	}
};

