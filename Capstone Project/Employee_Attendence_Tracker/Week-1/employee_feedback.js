// MongoDB: Task Feedback & Indexes
//create database
use employee_db;

//Insert sample data
db.task_feedback.insertMany([
  {
    employee_id: 1,
    department: "HR",
    feedback: "Rishitha consistently completes reports on time.",
    notes: "Shows strong communication skills.",
    date: ISODate("2025-07-21")
  },
  {
    employee_id: 2,
    department: "IT",
    feedback: "Anil needs to improve bug tracking.",
    notes: "Late to team meetings occasionally.",
    date: ISODate("2025-07-21")
  },
  {
    employee_id: 3,
    department: "Sales",
    feedback: "Sneha achieved 120% of sales target.",
    notes: "Very persuasive and confident speaker.",
    date: ISODate("2025-07-21")
  },
  {
    employee_id: 4,
    department: "IT",
    feedback: "Karthik delivers fast but misses QA documentation.",
    notes: "Recommend QA workshop.",
    date: ISODate("2025-07-22")
  },
  {
    employee_id: 5,
    department: "Marketing",
    feedback: "Priya shows creativity in campaign planning.",
    notes: "Needs improvement in time management.",
    date: ISODate("2025-07-22")
  },
  {
    employee_id: 6,
    department: "Sales",
    feedback: "Manoj engages clients well and follows up promptly.",
    notes: "Could improve report formatting.",
    date: ISODate("2025-07-22")
  }
]);

//Create indexes 

// Index by employee_id
db.task_feedback.createIndex({ employee_id: 1 });

// Index by department
db.task_feedback.createIndex({ department: 1 });
