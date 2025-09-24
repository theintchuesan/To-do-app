import User from "../model/user.model.js";
import {email, z} from "zod" //library to use validation like email
import bcrypt from "bcryptjs"; //library for hashing password
import {generateTokenAndSaveInCookie} from "../jwt/token.js" //for user authentication to update,create,delete,logout,etc.,.

const userSchema=z.object({
    email:z.email({message:"Invalid message"}),
    userName: z.string().max(20).min(3),
    password:z.string().min({message:"password must be at least 8 charaters"})
});

export const register = async (req,res) =>{
    
    try{
        const {email,userName,password}=req.body;

        if(!email || !userName || !password){
            return res.status(400).json({message:"All field are required"})
        }
        const validation= userSchema.safeParse({email,userName,password});
        if(!validation.success){
            const errorMessage= validation.error.errors.map((err)=>err.message)
            return res.status(400).json({errors:errorMessage})
        }

       const user=await User.findOne({email});
       if(user){
        return res.status(400).json({message: "User already registered"});
       }
       const hashPassword=bcrypt.hash(password,10)
       const newUser=new User({email,userName,password:hashPassword});
       newUser.save();

       if(newUser){
        const token=await generateTokenAndSaveInCookie(newUser._id,res);
        res.status(201).json({message: "User registered successfully", newUser,token});
       }
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Error registeration"});
    }
};

export const login =async (req,res) => {
    try{
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user=await User.findOne({email}).select("+password")
        if(!user || await bcrypt.compare(password,user.password)){
            return res.status(400).json({message:"Invalid email and password"});
        }
        const token=await generateTokenAndSaveInCookie(user._id,res);
        res.status(200).json({message:"Login sucessully",user,token});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Error Login"})
    }
};

export const logout = (req,res) => {
    try{
        res.clearCookie("jwt",{
            path:"/",
        })
        res.status(200).json({message:"User logout successfully"})
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Error logging out"})
    }
};