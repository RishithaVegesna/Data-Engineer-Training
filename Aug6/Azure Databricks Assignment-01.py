# Databricks notebook source
from pyspark.sql import SparkSession
from pyspark.sql.functions import col
data = [
    ("E101", "Amit", "Sales", 10, 1200),
    ("E102", "Sneha", "Marketing", 8, 1500),
    ("E103", "Ravi", "Sales", 12, 1300),
    ("E104", "Anjali", "HR", 7, 1100),
    ("E105", "Raj", "Sales", 5, 1000)
]
 
columns = ["EmpID", "Name", "Department", "UnitsSold", "UnitPrice"]
 
df = spark.createDataFrame(data, columns)
df.show()

# COMMAND ----------

#SHOW TOTAL NUMBER OF EMPLOYEES
df.count()

# COMMAND ----------

# Add a new column TotalSales (UnitsSold × UnitPrice):
df=df.withColumn("TotalSales",col("UnitsSold")*col("UnitPrice"))
df.show()

# COMMAND ----------

#Show only Sales department employees with TotalSales > 12000:
df.filter((col("Department")=="Sales")&(col("TotalSales")>12000))
df.show()

# COMMAND ----------

#Find the employee with the highest total sales:
df.orderBy(col("TotalSales").desc()).limit(1).show()

# COMMAND ----------

#Sort employees by TotalSales in descending order:
df.orderBy(col("TotalSales").desc()).show()