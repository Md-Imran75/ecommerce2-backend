const customerModel = require('../../models/customerModel')
const { responseReturn } = require('../../utils/response')
const { createToken } = require('../../utils/tokenCreate')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2
const { IncomingForm } = require('formidable')
const mongoose = require('mongoose');

class customerAuthController {
    customer_register = async (req, res) => {
        const { name, email, password, favoriteBike, phone } = req.body

        try {
            const customer = await customerModel.findOne({ email })
            console.log(customer)
            if (customer) {
                responseReturn(res, 404, { error: 'Email already exits' })
            } else {
                const createCustomer = await customerModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    favoriteBike: favoriteBike.trim(),
                    phone: phone,
                    password: await bcrypt.hash(password, 10),
                    method: 'menualy'
                })

                const token = await createToken({
                    id: createCustomer.id,
                    name: createCustomer.name,
                    email: createCustomer.email,
                    favoriteBike: createCustomer.favoriteBike,
                    phone: createCustomer.phone,
                    method: createCustomer.method
                })
                res.cookie('customerToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })
                responseReturn(res, 201, { message: 'Sing up  success', token })
            }
        } catch (error) {
            responseReturn(res, 500, {
                message: 'internal server error'
            })
        }
    }

    customer_login = async (req, res) => {
        const { email, password } = req.body
        try {
            const customer = await customerModel.findOne({ email }).select('+password')
            if (customer) {
                const match = await bcrypt.compare(password, customer.password)
                if (match) {
                    const token = await createToken({
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        method: customer.method
                    })
                    res.cookie('customerToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    responseReturn(res, 201, { message: 'Login success', token })
                } else {
                    responseReturn(res, 404, { error: "Password wrong" })
                }
            } else {
                responseReturn(res, 404, { error: 'Email not found' })
            }
        } catch (error) {
            responseReturn(res, 500, {
                message: 'internal server error'
            })
        }
    }


    customer_change_password = async (req, res) => {
        const { email, oldPassword, newPassword } = req.body;

        try {
            const customer = await customerModel.findOne({ email }).select('+password');
            if (!customer) {
                responseReturn(res, 404, { error: 'Email not found' });
                return;
            }

            const match = await bcrypt.compare(oldPassword, customer.password);

            if (!match) {
                responseReturn(res, 401, { error: 'Old password is incorrect' });
                return;
            }

            await customerModel.findByIdAndUpdate(customer._id, {
                password: await bcrypt.hash(newPassword, 10),
            });

            responseReturn(res, 200, { message: 'Password changed successfully' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    forget_password = async (req, res) => {
        const { email, phone, newPassword } = req.body;

        try {
            const customerEmail = await customerModel.findOne({ email }).select('+password');
            if (!customerEmail) {
                responseReturn(res, 404, { error: 'Email not found' });
                return;
            }
            const customer = await customerModel.findOne({ phone }).select('+password');
            if (!customer) {
                responseReturn(res, 404, { error: 'Phone not found' });
                return;
            }

            await customerModel.findByIdAndUpdate(customer._id, {
                password: await bcrypt.hash(newPassword, 10),
            });

            responseReturn(res, 200, { message: 'Password changed successfully' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };



    customer_profile_image_upload = async (req, res) => {
        const { id } = req;
        console.log('id id ', req)
        const form = new IncomingForm({ multiples: true });

        form.parse(req, async (err, _fields, files) => {
            if (err) {
                return responseReturn(res, 500, { error: err.message });
            }

            try {
                const { image } = files;

                if (!image || !image.length) {
                    return responseReturn(res, 400, { error: 'No image file provided.' });
                }

                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true,
                });

                const result = await cloudinary.uploader.upload(image[0].filepath, { folder: 'customerProfile' });

                if (result) {
                    // Update the customer model in the database
                    const updatedCustomer = await customerModel.findByIdAndUpdate(
                        id,
                        { image: result.url },
                        { new: true } // Return the updated document
                    );

                    console.log('Updated UserInfo:', updatedCustomer);

                    // Log the updated userInfo
                    const userInfo = await customerModel.findById(id);
                    console.log('Updated UserInfo:', userInfo);

                    responseReturn(res, 201, { message: 'Image upload success', userInfo });
                } else {
                    responseReturn(res, 404, { error: 'Image upload failed' });
                }
            } catch (error) {
                console.log('database error', error)
                responseReturn(res, 500, { error: error.message });
            }
        });
    };





    customer_logout = async (_req, res) => {
        res.cookie('customerToken', "", {
            expires: new Date(Date.now())
        })
        responseReturn(res, 200, { message: 'Logout success' })
    }
}

module.exports = new customerAuthController()