const Joi = require("joi");

exports.RegisterValidation=Joi.object({
    username:Joi.string().email().required(),
    password:Joi.string().required(),
    name:Joi.string().required(),
    phoneNumber:Joi.string().required(),
    address:Joi.string(),
    age:Joi.number(),
    dob:Joi.string().custom((value, helpers) => {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/; 
        if (!regex.test(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'custom date format'),
    gender:Joi.string(),
    profile:Joi.allow(),
    specilization:Joi.string()
});

exports.EditValidation=Joi.object({
    name:Joi.string(),
    phoneNumber:Joi.string(),
    address:Joi.string(),
    age:Joi.number(),
    dob:Joi.string().custom((value, helpers) => {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/; 
        if (!regex.test(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'custom date format'),
    gender:Joi.string(),
    specilization:Joi.string()
});

exports.RegisterMedicineValidation=Joi.object({
    medicineName:Joi.string().required(),
    quantity:Joi.string().required()
});

exports.AppoinmentValidation=Joi.object({
    doctorId:Joi.string().required(),
    date:Joi.string().custom((value, helpers) => {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/; 
        if (!regex.test(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'custom date format').required(),
    status:Joi.string(),
    virtual:Joi.boolean()
});

exports.PrescriptionValidation=Joi.object({
    token:Joi.string().required(),
    problem:Joi.string(),
    medicines:Joi.object().pattern(Joi.string(),Joi.number())
});



