const db = require('../db'); // Replace with the path to your db setup file

const postJob = async (req, res) => {
  const {
    company_name,
    job_title,
    job_category,
    company_description,
    job_description,
    requirement,
    salary,
    status,
    city,
    country,
    state,
    street,
    picture,
  } = req.body;

  const { user_id } = req.user;

  if (
    !company_name ||
    !job_title ||
    !job_category ||
    !company_description ||
    !job_description ||
    !requirement ||
    !salary ||
    !status ||
    !city ||
    !country ||
    !state ||
    !street ||
    !picture
  ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.query('START TRANSACTION');

    const EmployerQuery = `SELECT company_id FROM employers WHERE employer_id = ? AND company_name = ?`;
    const employerParams = [user_id, company_name];
    const [employerResult] = await connection.query(EmployerQuery, employerParams);

    let company_id;
    if (employerResult.length > 0) {
      company_id = employerResult[0].company_id;
    } else {
      
      const EmployerInsertQuery = `
        INSERT INTO employers (employer_id, company_name, company_description, company_image)
        VALUES (?, ?, ?, ?)`;
      const employerInsertParams = [user_id, company_name, company_description, picture];
      const [insertResult] = await connection.query(EmployerInsertQuery, employerInsertParams);
      company_id = insertResult.insertId;
    }

    const LocationQuery = `SELECT location_id FROM locations WHERE street_name = ? AND country = ? AND state = ? AND city = ?`;
    const locationParams = [street, country, state, city];
    const [locationResult] = await connection.query(LocationQuery, locationParams);

    let location_id;
    if (locationResult.length > 0) {
      location_id = locationResult[0].location_id;
    } else {
      
      const LocationInsertQuery = `
        INSERT INTO locations (street_name, country, state, city)
        VALUES (?, ?, ?, ?)`;
      const locationInsertParams = [street, country, state, city];
      const [locationInsertResult] = await connection.query(LocationInsertQuery, locationInsertParams);
      location_id = locationInsertResult.insertId;
    }

    
    const CategoryQuery = `SELECT category_id FROM Job_categories WHERE category_name = ?`;
    const categoryParams = [job_category];
    const [categoryResult] = await connection.query(CategoryQuery, categoryParams);

    let category_id;
    if (categoryResult.length > 0) {
      category_id = categoryResult[0].category_id;
    } 

    
    const JobQuery = `
      INSERT INTO job_listings (title, description, category_id, requirements, salary, location_id, posting_date, company_id, status)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`;
    const jobParams = [job_title, job_description, category_id, requirement, salary, location_id, company_id, status];
    await connection.query(JobQuery, jobParams);

    
    await connection.query('COMMIT');
    res.status(201).json({ message: 'Job posted successfully!' });
  } catch (error) {
    if (connection) {
      await connection.query('ROLLBACK');
    }
    console.error('Error posting job:', error);
    res.status(500).json({ error: 'Failed to post job.' });
  } finally {
    if (connection) {
      connection.release(); 
    }
  }
};

module.exports = { postJob };
