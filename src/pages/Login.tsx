import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";

const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const [login] = useLoginMutation()
  console.log(login, '16');
  

  const loginHandler = async () => {
    
    try {
      
      const provider = new GoogleAuthProvider()

      const {user} = await signInWithPopup(auth, provider)
      console.log(user, 'user');

      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        role: "user",
        dob: date,
        _id: user.uid,
      })

      console.log(res, 'res');      

      if("data" in res){
        toast.success(res.data.message)
      }else {
        const error = res.error as FetchBaseQueryError
        const resMessage = (error.data as MessageResponse)
        toast.error(resMessage.message)
      }
      

    } catch (error) {
      toast.error("Sign In Failed")
    }
  }

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>
        <div>
          <label htmlFor="">Gender</label>
          <select
            name=""
            id=""
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Date of Birth</label>
          <input type="date" name="" id="" value={date}  onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
            <p>Already Signed In Once</p>
            <button onClick={loginHandler}>
                <FcGoogle /> <span>Sign in with Google</span>
            </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
