//PART-1
db.jobs.insertMany([
  {
    job_id: 1,
    title: "Software Engineer",
    company: "TechNova",
    location: "Hyderabad",
    salary: 1200000,
    job_type: "remote",
    posted_on: new Date("2024-07-10")
  },
  {
    job_id: 2,
    title: "Data Analyst",
    company: "DataVista",
    location: "Bangalore",
    salary: 900000,
    job_type: "on-site",
    posted_on: new Date("2024-06-25")
  },
  {
    job_id: 3,
    title: "Backend Developer",
    company: "TechNova",
    location: "Remote",
    salary: 1500000,
    job_type: "remote",
    posted_on: new Date("2024-07-01")
  },
  {
    job_id: 4,
    title: "UI/UX Designer",
    company: "CreativeLab",
    location: "Pune",
    salary: 850000,
    job_type: "hybrid",
    posted_on: new Date("2024-07-15")
  },
  {
    job_id: 5,
    title: "DevOps Engineer",
    company: "TechNova",
    location: "Chennai",
    salary: 1000000,
    job_type: "on-site",
    posted_on: new Date("2024-06-10")
  }
]);

// 2. Applicants collection
db.applicants.insertMany([
  { applicant_id: 101, name: "Rishitha", skills: ["Python", "MongoDB"], experience: 2, city: "Hyderabad", applied_on: new Date("2024-07-11") },
  { applicant_id: 102, name: "Sudha", skills: ["Java", "Spring"], experience: 4, city: "Bangalore", applied_on: new Date("2024-07-12") },
  { applicant_id: 103, name: "Savitri", skills: ["MongoDB", "React"], experience: 1, city: "Pune", applied_on: new Date("2024-07-09") },
  { applicant_id: 104, name: "Sowmya", skills: ["HTML", "CSS", "JS"], experience: 3, city: "Hyderabad", applied_on: new Date("2024-07-10") },
  { applicant_id: 105, name: "Charitha", skills: ["Node.js", "MongoDB"], experience: 5, city: "Chennai", applied_on: new Date("2024-07-08") }
]);

// 3. Applications collection
db.applications.insertMany([
  { application_id: 201, applicant_id: 101, job_id: 1, application_status: "interview scheduled", interview_scheduled: true, feedback: "Good" },
  { application_id: 202, applicant_id: 102, job_id: 2, application_status: "applied", interview_scheduled: false, feedback: "Pending" },
  { application_id: 203, applicant_id: 103, job_id: 3, application_status: "interview scheduled", interview_scheduled: true, feedback: "Average" },
  { application_id: 204, applicant_id: 104, job_id: 4, application_status: "applied", interview_scheduled: false, feedback: "Pending" },
  { application_id: 205, applicant_id: 101, job_id: 3, application_status: "applied", interview_scheduled: false, feedback: "Pending" }
]);
//PART-2
// 1. Find all remote jobs with a salary > 10L
db.jobs.find({ job_type: "remote", salary: { $gt: 1000000 } });

// 2. Get all applicants who know MongoDB
db.applicants.find({ skills: "MongoDB" });

// 3. Number of jobs posted in the last 30 days
db.jobs.find({
  posted_on: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
}).count();

// 4. All applications in 'interview scheduled' status
db.applications.find({ application_status: "interview scheduled" });

// 5. Companies that posted more than 2 jobs
db.jobs.aggregate([
  { $group: { _id: "$company", job_count: { $sum: 1 } } },
  { $match: { job_count: { $gt: 2 } } }
]);
//PART-3
// 6. Join applications with jobs and show job title + applicant name
db.applications.aggregate([
  {
    $lookup: {
      from: "jobs",
      localField: "job_id",
      foreignField: "job_id",
      as: "job"
    }
  },
  { $unwind: "$job" },
  {
    $lookup: {
      from: "applicants",
      localField: "applicant_id",
      foreignField: "applicant_id",
      as: "applicant"
    }
  },
  { $unwind: "$applicant" },
  {
    $project: {
      _id: 0,
      "job.title": 1,
      "applicant.name": 1
    }
  }
]);

// 7. How many applications per job
db.applications.aggregate([
  {
    $group: {
      _id: "$job_id",
      applications_received: { $sum: 1 }
    }
  }
]);

// 8. Applicants who applied for more than one job
db.applications.aggregate([
  {
    $group: {
      _id: "$applicant_id",
      total_apps: { $sum: 1 }
    }
  },
  { $match: { total_apps: { $gt: 1 } } }
]);

// 9. Top 3 cities with the most applicants
db.applicants.aggregate([
  {
    $group: {
      _id: "$city",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 3 }
]);

// 10. Average salary by job type
db.jobs.aggregate([
  {
    $group: {
      _id: "$job_type",
      avg_salary: { $avg: "$salary" }
    }
  }
]);
//PART-4
// 11. Update status of one application to "offer made"
db.applications.updateOne(
  { application_id: 202 },
  { $set: { application_status: "offer made" } }
);

// 12. Delete a job with no applications
db.jobs.deleteOne({
  job_id: { $nin: db.applications.distinct("job_id") }
});

// 13. Add new field "shortlisted" = false to all applications
db.applications.updateMany({}, { $set: { shortlisted: false } });

// 14. Increment experience of Hyderabad applicants by 1 year
db.applicants.updateMany(
  { city: "Hyderabad" },
  { $inc: { experience: 1 } }
);

// 15. Remove applicants who haven’t applied to any job
db.applicants.deleteMany({
  applicant_id: { $nin: db.applications.distinct("applicant_id") }
});
