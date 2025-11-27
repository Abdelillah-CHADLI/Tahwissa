import { supabase } from "../config/supabasedb.js";

import bcrypt from "bcryptjs";

const userData1 = {
  userType: "traveller", 
  firstName: "Wassim",
  lastName: "Elor",
  // make sure it matches your code
  email: "yacine.dcer@ensia.edu.dz",
  password: "123456",
  confirmPassword: "123456"
};

// Mock response object
const res = {
  statusCode: 200,
  status: function (code) {
    this.statusCode = code;
    return this;
  },
  json: function (data) {
    console.log("Response:", this.statusCode, data);
    return data;
  }
};

export async function simpleAddUser(req , res){
const userType = req.userType;
const userData = { ...req };
  const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password: userData.password,
          role: "Traveller"
        })
        .select().maybeSingle();
    


      // Create traveller profile
      const { error: travellerError } = await supabase
        .from('travellers')
        .insert({
          traveller_id: user.user_id,
          traveller_fn: userData.firstName,
          traveller_ls: userData.lastName
        });
      let result = {
        success: true,
        message: 'Traveller account created successfully.',
        data: {
          userId: user.user_id,
          email: user.email,
          role: user.role,
          
        }
      };
      return res.status(201).json(result);
      

}

// Async wrapper to call the function
(async () => {
  await simpleAddUser(userData1, res);
})();
