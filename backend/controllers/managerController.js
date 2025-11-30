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


// Remove an agency employee by employee_id
export async function removeAgencyEmployee(req, res) {
  const { employee_id } = req.params;

  if (!employee_id) {
    return res.status(400).json({ error: "employee_id is required" });
  }

  try {
    // Delete from agency_employees table first
    const { data: deletedEmployee, error: employeeError } = await supabase
      .from('agency_employees')
      .delete()
      .eq('employee_id', employee_id)
      .select()
      .single();

    if (employeeError) throw employeeError;

    // Optionally delete from users table as well
    const { data: deletedUser, error: userError } = await supabase
      .from('users')
      .delete()
      .eq('user_id', employee_id)
      .select()
      .single();

    if (userError) throw userError;

    res.status(200).json({
      message: "Agency employee removed successfully",
      employee: deletedEmployee,
      user: deletedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Get all employees of a specific agency by agency_id
export async function getAgencyEmployees(req, res) {
  const { agency_id } = req.params;

  if (!agency_id) {
    return res.status(400).json({ error: "agency_id is required" });
  }

  try {
    const { data: employees, error } = await supabase
      .from('agency_employees')
      .select(`
        employee_id,
        users:employee_id (
          email,
          role
        )
      `)
      .eq('agency_id', agency_id);

    if (error) throw error;

    res.status(200).json({ employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

