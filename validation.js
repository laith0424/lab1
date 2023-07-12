const joi = require("@hapi/joi");
const validatealbum = (data) => {
    const schema = joi.object({
        title: joi.string().required(),
        artist: joi.string().required(),
        year: joi.number().required()
    });
    return schema.validate(data);
};
module.exports = {validatealbum};