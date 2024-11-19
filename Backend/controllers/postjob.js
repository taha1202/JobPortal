const db = require("../db");

const postJob = (req, res) => {
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
  
  let category_id;
  console.log("Fields = ", company_name,job_title ,job_category,
    company_description ,job_description,requirement ,salary ,status,city ,country,state,
    street,picture);

  

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

   console.log("fields incomplete");
    return res.status(400).json({ error: "All fields are required." });
    
  }

  // Begin transaction
  db.beginTransaction((transactionError) => {
    if (transactionError) {
      return res.status(500).json({ error: "Failed to initiate transaction." });
    }

    // Insert into employers
    const EmployerQuery = `
       INSERT INTO employers (
            employer_id, company_name, company_description, company_image
          ) 
          VALUES (?, ?, ?, ?)
        `;
    const employerParams = [
      user_id,
      company_name,
      company_description,
      picture,
    ];

    db.query(EmployerQuery, employerParams, (err, rest) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({
            error: "Failed to post job due to invalid employer values.",
          });
        });
      }
      const company_id = rest.insertId;

      // Insert into locations
      const LocationQuery = `
       INSERT INTO locations (
             street_name, country, state, city 
          ) 
          VALUES (?, ?, ?, ?)
        `;
      const locationParams = [street, country, state, city];

      db.query(LocationQuery, locationParams, (err, results) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({
              error: "Failed to post job due to invalid location values.",
            });
          });
        }
        const location_id = results.insertId;

        const ChckCategory = `
          SELECT category_id FROM job_categories
          WHERE category_name = ?
        `;
        const CategoryQuery = `
          INSERT INTO job_categories(
                category_name 
             ) 
             VALUES (?)
        `;
        const categoryParams = [job_category];

        db.query(ChckCategory, categoryParams, (err, reslt) => {
          if (err) {
            console.error("Error checking category:", err);
            return;
          }

          if (reslt.length > 0) {
            console.log("Category already exists, skipping insert.");
            category_id = reslt[0].category_id;
            insertJobListing();
          } else {
            db.query(CategoryQuery, categoryParams, (err, reslt) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({
                    error: "Failed to post job due to invalid category values.",
                  });
                });
              }
              category_id = reslt.insertId;

              insertJobListing();
            });
          }

         
          function insertJobListing() {
            const JobQuery = `
              INSERT INTO job_listings (
                title, description, category_id, requirements, 
                salary, location_id, posting_date, company_id, status 
              ) 
              VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)
            `;
            const jobParams = [
              job_title,
              job_description,
              category_id,
              requirement,
              salary,
              location_id,
              company_id,
              status,
            ];

            db.query(JobQuery, jobParams, (err, result) => {
              if (err) {
                console.error("Error occurred:", err);
                return db.rollback(() => {
                  res.status(500).json({
                    error: "Failed to post job due to invalid listing values.",
                  });
                });
              }

              db.commit((commitError) => {
                if (commitError) {
                  return db.rollback(() => {
                    res
                      .status(500)
                      .json({ error: "Failed to commit transaction." });
                  });
                }

                res.status(201).json({
                  message: "Job posted successfully!",
                });
              });
            });
          }
        });
      });
    });
  });
};

module.exports = { postJob};
