module.exports.promiseToCallback = function (promise) {
    if (promise.then instanceof Function){
        return function (callback) {
            promise.then(
                (data) => callback(null, data),
                (error) => callback(error)
            );
        }
    }else{
        throw new TypeError('Expected a promise');
    }
};

module.exports.callbackToPromise = function (callbackFn) {
    return new Promise((resolve, reject) => {
        callbackFn(resolve, reject);
    });
};