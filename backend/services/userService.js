//wassim
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
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return user; 
}

export async function insertUser({ email, password, role, fn, ls }) {
  const { data: user, error: userError } = await supabase
    .from('users')
    .insert({
      email,
      password,
      role
    })
    .select()
    .single();

  if (userError) {
    throw new Error(userError.message);
  }

  const { error: travellerError } = await supabase
    .from('travellers')
    .insert({
      traveller_id: user.user_id, 
      traveller_fn: fn,
      traveller_ls: ls
    });

  if (travellerError) {
    throw new Error(travellerError.message);
  }

  return user;
}

