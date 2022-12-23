// Using async allows you to use return for response
// Sync functions must use the callback 
exports.handler = async (event, context, callback) => {
    return process.env.foo; // bar
};