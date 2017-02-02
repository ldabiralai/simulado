function withCallback(fn, callback) {
  console.warn("Callbacks are deprecated, we're moving towards a promise-based API.");
  try {
    return fn().end(callback);
  } catch (e) {
    callback(e);
  }
}

function withoutCallback(fn) {
  return new Promise(function (resolve, reject) {
    try {
      fn().end(function (err, res) {
        if (err) reject(err);
        else resolve(res);
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = function(fn, callback) {
  return callback ? withCallback(fn, callback) : withoutCallback(fn);
};
