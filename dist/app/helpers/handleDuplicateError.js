"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
const handleDuplicateError = (err) => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 409, //conflict
        message: `Duplicate value entered for ${matchedArray === null || matchedArray === void 0 ? void 0 : matchedArray[1]}. Please use another value!`,
    };
};
exports.handleDuplicateError = handleDuplicateError;
