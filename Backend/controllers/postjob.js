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
    category_description,
  } = req.body;

  const { user_id } = req.user;

  if (!company_name || !job_title || !job_category || !company_description || !job_description || !requirement || 
    !salary || !status || !city || !country || !state || !street || !picture) {
    console.log("fields incomplete");
    return res.status(400).json({ error: "All fields are required." });
  }

  db.beginTransaction((transactionError) => {
    if (transactionError) {
      return res.status(500).json({ error: "Failed to initiate transaction." });
    }

    const EmployerQuery = `SELECT company_id FROM employers WHERE employer_id = ? AND company_name = ?`;
    const employerParams = [user_id, company_name];

    db.query(EmployerQuery, employerParams, (err, employerResult) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: "Failed to check employer." });
        });
      }

      let company_id;
      if (employerResult.length > 0) {
        console.log("Employer already exists, using existing employer.");
        company_id = employerResult[0].company_id;
        checkLocationAndProceed();
      } else {
        const EmployerInsertQuery = `
          INSERT INTO employers (employer_id, company_name, company_description, company_image)
          VALUES (?, ?, ?, ?)`;
        const employerInsertParams = [
          user_id,
          company_name,
          company_description,
          picture,
        ];
        db.query(
          EmployerInsertQuery,
          employerInsertParams,
          (err, employerInsertResult) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: "Failed to insert employer." });
              });
            }
            company_id = employerInsertResult.insertId;
            checkLocationAndProceed();
          }
        );
      }

      function checkLocationAndProceed() {
        const LocationQuery = `SELECT location_id FROM locations WHERE street_name = ? AND country = ? AND state = ? AND city = ?`;
        const locationParams = [street, country, state, city];

        db.query(LocationQuery, locationParams, (err, locationResult) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: "Failed to check location." });
            });
          }

          let location_id;
          if (locationResult.length > 0) {
            console.log("Location already exists, using existing location.");
            location_id = locationResult[0].location_id;
            checkCategoryAndProceed();
          } else {
            const LocationInsertQuery = `
              INSERT INTO locations (street_name, country, state, city)
              VALUES (?, ?, ?, ?)`;
            const locationInsertParams = [street, country, state, city];

            db.query(
              LocationInsertQuery,
              locationInsertParams,
              (err, locationInsertResult) => {
                if (err) {
                  return db.rollback(() => {
                    res
                      .status(500)
                      .json({ error: "Failed to insert location." });
                  });
                }
                location_id = locationInsertResult.insertId;
                checkCategoryAndProceed();
              }
            );
          }

          function checkCategoryAndProceed() {
            const ChckCategory = `SELECT category_id FROM job_categories WHERE category_name = ?`;
            const categoryParams = [job_category];

            db.query(ChckCategory, categoryParams, (err, reslt) => {
              if (err) {
                console.error("Error checking category:", err);
                return;
              }

              let category_id;
              if (reslt.length > 0) {
                console.log("Category already exists, skipping insert.");
                category_id = reslt[0].category_id;
                insertJobListing();
              } else {
                const catParams = [job_category,category_description]
                const CategoryQuery = `INSERT INTO job_categories (category_name,category_description) VALUES (?,?)`;
                db.query(CategoryQuery, catParams, (err, reslt) => {
                  if (err) {
                    return db.rollback(() => {
                      res
                        .status(500)
                        .json({
                          error:
                            "Failed to post job due to invalid category values.",
                        });
                    });
                  }
                  category_id = reslt.insertId;
                  insertJobListing();
                });
              }

              function insertJobListing() {
                const JobQuery = `
                  INSERT INTO job_listings (title, description, category_id, requirements, salary, location_id, posting_date, company_id, status)
                  VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`;
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
                      res
                        .status(500)
                        .json({
                          error:
                            "Failed to post job due to invalid listing values.",
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
          }
        });
      }
    });
  });
};

module.exports = { postJob };
