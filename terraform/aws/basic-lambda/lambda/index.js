// Using async allows you to use return for response
// Sync functions must use the callback 
exports.handler = async (event, context, callback) => {
    const res = new Promise ((resolve, reject) => {
        resolve(process.env.foo); // bar
    });

    return res;
};