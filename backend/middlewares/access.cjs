const jwt = require('jsonwebtoken');

async function db() {
  const { supabase } = await import('../config/supabasedb.js');
  return supabase;
}

function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Please sign in.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => roles.includes(req.user?.role)
    ? next()
    : res.status(403).json({ message: 'Access denied.' });
}

function requireSelf(field, source = 'body') {
  return (req, res, next) => {
    const claimed = req[source]?.[field];
    if (String(claimed) !== String(req.user?.id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
}

async function agencyForUser(userId) {
  const supabase = await db();
  const { data, error } = await supabase.from('agency_employees')
    .select('agency_id').eq('employee_id', userId).maybeSingle();
  if (error) throw error;
  return data?.agency_id || null;
}

async function ownsTour(user, tourId) {
  const supabase = await db();
  const { data, error } = await supabase.from('tours')
    .select('agency_id, guide_id').eq('tour_id', tourId).maybeSingle();
  if (error) throw error;
  if (!data) return false;
  if (user.role === 'Guide') return String(data.guide_id) === String(user.id);
  if (user.role === 'AgencyEmployee') {
    return String(data.agency_id) === String(await agencyForUser(user.id));
  }
  return false;
}

async function requireTourOwner(req, res, next) {
  try {
    if (!await ownsTour(req.user, req.params.tourId)) {
      return res.status(403).json({ message: 'This tour belongs to another provider.' });
    }
    next();
  } catch (error) { next(error); }
}

async function requireNewTourOwner(req, res, next) {
  try {
    if (req.user.role === 'Guide' && String(req.body.guide_id) === String(req.user.id) && !req.body.agency_id) return next();
    if (req.user.role === 'AgencyEmployee' && !req.body.guide_id &&
      String(req.body.agency_id) === String(await agencyForUser(req.user.id))) return next();
    return res.status(403).json({ message: 'Use your own provider account to publish a tour.' });
  } catch (error) { next(error); }
}

async function requireManager(req, res, next) {
  try {
    const supabase = await db();
    const { data, error } = await supabase.from('agencies')
      .select('agency_id').eq('manager_id', req.user.id).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(403).json({ message: 'Agency manager access required.' });
    req.managerAgencyId = data.agency_id;
    next();
  } catch (error) { next(error); }
}

async function requireManagedAgency(req, res, next) {
  try {
    const directAgencyId = req.body?.agency_id || req.params.agency_id;
    if (directAgencyId && String(directAgencyId) !== String(req.managerAgencyId)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const employeeId = req.params.employee_id;
    if (employeeId) {
      const supabase = await db();
      const { data, error } = await supabase.from('agency_employees')
        .select('agency_id').eq('employee_id', employeeId).maybeSingle();
      if (error) throw error;
      if (!data || String(data.agency_id) !== String(req.managerAgencyId)) {
        return res.status(403).json({ message: 'Access denied.' });
      }
    }
    next();
  } catch (error) { next(error); }
}

async function requireProfileOwner(req, res, next) {
  try {
    const id = req.params.id;
    const expectedType = req.user.role === 'AgencyEmployee' ? 'Agency' : 'Guide';
    if (req.body.TypeOfProfile && req.body.TypeOfProfile !== expectedType) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const owner = req.user.role === 'AgencyEmployee'
      ? await agencyForUser(req.user.id)
      : req.user.id;
    if (String(id) !== String(owner)) return res.status(403).json({ message: 'Access denied.' });
    next();
  } catch (error) { next(error); }
}

async function requireVerificationOwner(req, res, next) {
  try {
    const type = String(req.body.acc_type || '').toLowerCase();
    const owner = req.user.role === 'AgencyEmployee' ? await agencyForUser(req.user.id) : req.user.id;
    const expectedType = req.user.role === 'AgencyEmployee' ? 'agency' : 'guide';
    if (type !== expectedType || String(req.body.id) !== String(owner)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  } catch (error) { next(error); }
}

module.exports = { requireAuth, requireRole, requireSelf, requireTourOwner,
  requireNewTourOwner, requireManager, requireManagedAgency, requireProfileOwner,
  requireVerificationOwner, ownsTour, agencyForUser, db };
