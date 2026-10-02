//wassim
import { supabase } from '../config/supabasedb.js';
import bcrypt from 'bcryptjs';


// ADD AGENCY EMPLOYEE
export async function addAgencyEmployee(req, res) {
  const {
    email,
    password,
    agency_id,
    full_name,
    phone,
    location,
    experience,
    languages,
    role,
    specialization,
    status // get status from form
  } = req.body;

  if (!email || !password || !agency_id) {
    return res.status(400).json({
      error: "email, password, and agency_id are required"
    });
  }

  try {
    const saltRounds = 10;
    const hashedpass = await bcrypt.hash(password, saltRounds);


    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedpass,
        role: "AgencyEmployee"
      })
      .select()
      .single();

    if (userError) throw userError;

    const employee_id = newUser.user_id;

    const languagesStr = Array.isArray(languages)
      ? JSON.stringify(languages)
      : (languages || null);

    const specializationStr = Array.isArray(specialization)
      ? JSON.stringify(specialization)
      : (specialization || null);

    const { data: employeeData, error: employeeError } = await supabase
      .from("agency_employees")
      .insert({
        employee_id,
        agency_id,
        full_name: full_name || null,
        phone: phone || null,
        location: location || null,
        experience: experience || null,
        languages: languagesStr,
        role: role || null,
        specialization: specializationStr,
        status: status || 'active'
      })
      .select()
      .single();

    if (employeeError) throw employeeError;

    res.status(201).json({
      message: "Agency employee added successfully",
      employee: employeeData,
      user: { user_id: newUser.user_id, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// REMOVE AGENCY EMPLOYEE
export async function removeAgencyEmployee(req, res) {
  const { employee_id } = req.params;

  if (!employee_id) {
    return res.status(400).json({ error: "employee_id is required" });
  }

  try {
    // Check if employee is a manager
    const { data: managedAgencies, error: managerCheckError } = await supabase
      .from('agencies')
      .select('agency_id')
      .eq('manager_id', employee_id);

    if (managerCheckError) throw managerCheckError;

    if (managedAgencies && managedAgencies.length > 0) {
      return res.status(400).json({
        error: "Cannot remove this employee because they are a manager of an agency"
      });
    }

    const { data: deletedEmployee, error: employeeError } = await supabase
      .from('agency_employees')
      .delete()
      .eq('employee_id', employee_id)
      .select()
      .single();

    if (employeeError) throw employeeError;

    // Delete from users table
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
      user: { user_id: deletedUser.user_id, email: deletedUser.email, role: deletedUser.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}


// GET AGENCY EMPLOYEES
export async function getAgencyEmployees(req, res) {
  const { agency_id } = req.params;

  if (!agency_id) {
    return res.status(400).json({ error: "agency_id is required" });
  }

  try {
    const { data: employees, error } = await supabase
      .from("agency_employees")
      .select(`
        employee_id,
        full_name,
        phone,
        location,
        experience,
        languages,
        role,
        specialization,
        status,
        users:employee_id (
          email,
          role
        )
      `)
      .eq("agency_id", agency_id);

    if (error) throw error;


    const employeesWithParsed = employees.map(emp => {
      let parsedLanguages = emp.languages;
      if (typeof emp.languages === 'string' && emp.languages.trim()) {
        try {
          parsedLanguages = JSON.parse(emp.languages);
        } catch {
          parsedLanguages = emp.languages;
        }
      }

      let parsedSpecialization = emp.specialization;
      if (typeof emp.specialization === 'string' && emp.specialization.trim()) {
        try {
          parsedSpecialization = JSON.parse(emp.specialization);
        } catch {
          parsedSpecialization = emp.specialization;
        }
      }

      return {
        ...emp,
        languages: parsedLanguages,
        specialization: parsedSpecialization,
        status: emp.status || 'active'
      };
    });

    res.status(200).json({ employees: employeesWithParsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// EDIT AGENCY EMPLOYEE
export async function editAgencyEmployee(req, res) {
  const { employee_id } = req.params;

  const {
    full_name,
    phone,
    location,
    experience,
    languages,
    role,
    specialization,
    status
  } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: "employee_id is required" });
  }

  try {
    const employeeUpdates = {};

    if (full_name !== undefined) employeeUpdates.full_name = full_name;
    if (phone !== undefined) employeeUpdates.phone = phone;
    if (location !== undefined) employeeUpdates.location = location;
    if (experience !== undefined) employeeUpdates.experience = experience;

    if (languages !== undefined) {
      employeeUpdates.languages = Array.isArray(languages)
        ? JSON.stringify(languages)
        : languages;
    }

    if (role !== undefined) employeeUpdates.role = role;

    if (specialization !== undefined) {
      employeeUpdates.specialization = Array.isArray(specialization)
        ? JSON.stringify(specialization)
        : specialization;
    }

    if (status !== undefined) employeeUpdates.status = status;

    if (Object.keys(employeeUpdates).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const { data: employeeData, error: employeeError } = await supabase
      .from("agency_employees")
      .update(employeeUpdates)
      .eq("employee_id", employee_id)
      .select(`
        employee_id,
        full_name,
        phone,
        location,
        experience,
        languages,
        role,
        specialization,
        status,
        users:employee_id (
          email,
          role
        )
      `)
      .single();

    if (employeeError) throw employeeError;

    let parsedLanguages = employeeData.languages;
    if (typeof employeeData.languages === 'string' && employeeData.languages.trim()) {
      try {
        parsedLanguages = JSON.parse(employeeData.languages);
      } catch {
        parsedLanguages = employeeData.languages;
      }
    }

    let parsedSpecialization = employeeData.specialization;
    if (typeof employeeData.specialization === 'string' && employeeData.specialization.trim()) {
      try {
        parsedSpecialization = JSON.parse(employeeData.specialization);
      } catch {
        parsedSpecialization = employeeData.specialization;
      }
    }

    const parsedEmployee = {
      ...employeeData,
      languages: parsedLanguages,
      specialization: parsedSpecialization
    };

    res.status(200).json({
      message: "Agency employee updated successfully",
      employee: parsedEmployee
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// TOGGLE EMPLOYEE STATUS
export async function toggleEmployeeStatus(req, res) {
  const { employee_id } = req.params;

  if (!employee_id) {
    return res.status(400).json({ error: "employee_id is required" });
  }

  try {
    // Get current employee status
    const { data: currentEmployee, error: fetchError } = await supabase
      .from("agency_employees")
      .select("status")
      .eq("employee_id", employee_id)
      .single();

    if (fetchError) throw fetchError;

    // Determine new status 
    const currentStatus = currentEmployee.status || 'active';
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    // Update the status
    const { data: updatedEmployee, error: updateError } = await supabase
      .from("agency_employees")
      .update({ status: newStatus })
      .eq("employee_id", employee_id)
      .select(`
        employee_id,
        full_name,
        phone,
        location,
        experience,
        languages,
        role,
        specialization,
        status,
        users:employee_id (
          email,
          role
        )
      `)
      .single();

    if (updateError) throw updateError;

    let parsedLanguages = updatedEmployee.languages;
    if (typeof updatedEmployee.languages === 'string' && updatedEmployee.languages.trim()) {
      try {
        parsedLanguages = JSON.parse(updatedEmployee.languages);
      } catch {
        parsedLanguages = updatedEmployee.languages;
      }
    }

    let parsedSpecialization = updatedEmployee.specialization;
    if (typeof updatedEmployee.specialization === 'string' && updatedEmployee.specialization.trim()) {
      try {
        parsedSpecialization = JSON.parse(updatedEmployee.specialization);
      } catch {
        parsedSpecialization = updatedEmployee.specialization;
      }
    }

    const parsedEmployee = {
      ...updatedEmployee,
      languages: parsedLanguages,
      specialization: parsedSpecialization
    };

    res.status(200).json({
      message: `Employee status changed to ${newStatus}`,
      employee: parsedEmployee
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
