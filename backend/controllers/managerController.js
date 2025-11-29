//wassim
import { supabase } from '../config/supabasedb.js';
import bcrypt from 'bcryptjs';

export async function addAgencyEmployee(req, res) {
  const { email, password, agency_id } = req.body;

  if (!email || !password || !agency_id) {
    return res.status(400).json({ error: "email, password, and agency_id are required" });
  }

  try {
    const saltRounds = 10;
    const hashedpass = await bcrypt.hash(password, saltRounds);
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        password:hashedpass,
        role: 'AgencyEmployee'
      })
      .select()
      .single();

    if (userError) throw userError;

    const employee_id = newUser.user_id; 

    
    const { data: employeeData, error: employeeError } = await supabase
      .from('agency_employees')
      .insert({
        employee_id,
        agency_id
      })
      .select()
      .single();

    if (employeeError) throw employeeError;

    res.status(201).json({
      message: "Agency employee added successfully",
      employee: employeeData,
      user: newUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
