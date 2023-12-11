const adminModel = require('../models/adminModel')
const sellerModel = require('../models/sellerModel')

const bcrypt = require('bcrypt')
const {responseReturn} = require('../utils/response')
const jwt = require('jsonwebtoken')
const {createToken} = require('../utils/tokenCreate')
class authControllers {
 admin_login = async (req , res) => {
    const {email , password} = req.body
    

    try{
     const admin = await adminModel.findOne({email}).select('+password');

     if(admin){
        const match = await bcrypt.compare(password, admin.password)
        if(match){
             const token = await createToken({
               id: admin.id,
               role: admin.role
             }) ;

             res.cookie('accessToken', token,{
               expires : new Date(Date.now() + 5*24*60*60*100)
             });
             responseReturn(res,200,{token,message:'Login Success'})
        } else{
         responseReturn(res, 404 , {error: 'Wrong credentials'})
        }
     }else{
       responseReturn(res , 404 , {error: 'Email not found'})
     }
     
    }catch(error){
           responseReturn(res, 500 , {error: error.message})
    }
 };
  
  
 seller_register = async(req , res) => {
    
    const {email , name , password , favoriteBike} = req.body
    
    try{
      const getUser = await sellerModel.findOne({email})
      if(getUser){
        responseReturn(res , 404 , {error: 'Email already exits'})
      }else{
        const seller = await sellerModel.create({
          name,
          email,
          favoriteBike,
          password : await bcrypt.hash(password, 10),
          method:'menualy',
          shopInfo:{}
        })
         
        const token = await createToken({id: seller.id , role: seller.role})
        res.cookie('accessToken' , token, {
          expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 100 )
        })

        responseReturn(res , 201 , { token, message:'Register Success'})
      }
    }catch(error){
         responseReturn(res , 500 , {error: 'Internal server error'})
    }

 }

  getUser = async(req,res) => {
    const {id , role} = req;
    try{
      if(role === 'admin'){
        const user = await adminModel.findById(id)
        responseReturn(res, 200, {userInfo: user})
      }else{
        console.log('seller info')
      }
    }catch(error){
          console.log(error.message)
    }
  }

}

module.exports = new authControllers()