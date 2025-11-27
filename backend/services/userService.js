import { supabase } from "../config/supabasedb.js";

export async function getAllUsers() {
  const { data, error } = await supabase.from('users').select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data; // this will be an array of users
}

export async function getUser(email) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return user; 
}

export async function insertUser({ email, password, role }){
  const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email: email,
          password: password,
          role: role
        }).select().single();
  if (userError) {
    throw new Error(userError.message);
  }

  return user;
}

