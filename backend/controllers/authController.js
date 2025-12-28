//wassim
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  "../services/userService.js";
import  {getUser} from "../services/userService.js";

import { supabase } from "../config/supabasedb.js";
import { insertUser } from "../services/userService.js";




// Authentication routes
export async function signUp(req, res) {
  try {
const { userType, email, password, confirmPassword } = req.body;
    // Validate userType
    if (!['traveller', 'agency', 'guide'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type. Must be "traveller", "agency", or "guide".'
      });
    }
    

    // Common validation
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and confirmPassword are required.'
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirmPassword do not match.'
      });
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email).maybeSingle();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered.'
      });
    }

    // Hash password
  const hashedPassword = await bcrypt.hash(password, 10); 

    let result;


    // Handle Traveller Signup
    if (userType === 'traveller') {
      const { firstName, lastName } = req.body;


      if (!firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'First name and last name are required for traveller signup.'
        });
      }

      // Create user account
      let role = "Traveller";
      let user = await insertUser({email: email,password: hashedPassword,role: role , fn : firstName , ls : lastName});

      result = {
        success: true,
        message: 'Traveller account created successfully.',
        data: {
          userId: user.user_id,
          email: user.email,
          role: user.role,
          first_name : firstName,
          last_name : lastName
        }
      };


  } 
  else if (userType === 'agency') {
      const { agencyName, location, phoneNumber  } = req.body;

      if (!agencyName || !phoneNumber || !location) {
        return res.status(400).json({
          success: false,
          message: 'Agency/Guide name, phone number, and location are required for agency signup.'
        });
      }

      // Create manager user account
      const { data: managerUser, error: managerError } = await supabase
        .from('users')
        .insert({
          email: email,
          password: hashedPassword,
          role: 'AgencyEmployee'
        })
        .select()
        .single();

      if (managerError) throw managerError;

      // Create agency
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .insert({
          agency_name: agencyName,
          phone_number: phoneNumber,
          main_office_location: location,
          manager_id: managerUser.user_id
        })
        .select()
        .single();

      if (agencyError) throw agencyError;

      // Create agency employee record for the manager
      const { error: employeeError } = await supabase
        .from('agency_employees')
        .insert({
          employee_id: managerUser.user_id,
          agency_id: agency.agency_id
        });

      if (employeeError) throw employeeError;

      result = {
        success: true,
        message: 'Agency and manager account created successfully.',
        data: {
          userId: managerUser.user_id,
          email: managerUser.email,
          role: managerUser.role,
          agencyId: agency.agency_id,
          agencyName: agency.agency_name,
          isManager: true
        }
      };
    }else if (userType === 'guide') {
      const { guideName, phoneNumber, location } = req.body;

      if (!guideName || !phoneNumber || !location) {
        return res.status(400).json({
          success: false,
          message: 'Guide name, phone number, and location are required for guide signup.'
        });
      }

      // Create user account
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email: email,
          password: hashedPassword,
          role: 'Guide'
        })
        .select()
        .single();

      if (userError) throw userError;

      // Create guide profile
      const { error: guideError } = await supabase
        .from('guides')
        .insert({
          guide_id: user.user_id,
          guide_name: guideName,
          phone_number: phoneNumber,
          main_location: location
        });

      if (guideError) throw guideError;

      result = {
        success: true,
        message: 'Guide account created successfully.',
        data: {
          userId: user.user_id,
          email: user.email,
          role: user.role,
          guideName,
          location
        }
      };
    } 

    // Handle Guide Signup
    

  return res.status(200).json(result);

    
  } catch (error) {
    console.error('SignUp Error:', error);

    
    
    // Handle specific Supabase/PostgreSQL errors
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An error occurred during signup. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
  

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {

  const user = await getUser(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password); // hashed password in DB
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // we will generate a token for security
    const token = jwt.sign(
      { id: user.id, email: user.email},
      process.env.JWT_SECRET, 
      { expiresIn: "10d" }
    );

    //  creating a new cookie called token
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
  });
    // sending the response to the fronend
    const responsePayload = { id: user.user_id, email: user.email, role: user.role };

    // Enrich agency employees with their agency linkage so the frontend can load agency pages.
    if (String(user.role).toLowerCase().includes('agency')) {
      try {
        const { data: employeeRow, error: employeeError } = await supabase
          .from('agency_employees')
          .select('agency_id')
          .eq('employee_id', user.user_id)
          .maybeSingle();

        if (!employeeError && employeeRow?.agency_id) {
          responsePayload.agencyId = employeeRow.agency_id;

          const { data: agencyRow, error: agencyError } = await supabase
            .from('agencies')
            .select('agency_id, agency_name, manager_id')
            .eq('agency_id', employeeRow.agency_id)
            .maybeSingle();

          if (!agencyError && agencyRow) {
            responsePayload.agencyName = agencyRow.agency_name;
            responsePayload.isManager = String(agencyRow.manager_id) === String(user.user_id);
          }
        }
      } catch (enrichError) {
        console.warn('Login enrich agency failed:', enrichError?.message || enrichError);
      }
    }

    res.json(responsePayload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

}

export function logout(req, res) {

  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
  //must redirect to the login from the frontEnd.
}

export async function googleAuth(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        error: "Email is required"
      });
    }

    const { data, error } = await supabase
      .from("users")
      .select("user_id, role")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      
      return res.status(500).json({
        error: error.message
      });
    }

    if (!data) {
    
      return res.status(404).json({
        error: "User not found"
      });
    }

    return res.status(200).json({
      user_id: data.user_id,
      role: data.role
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}

