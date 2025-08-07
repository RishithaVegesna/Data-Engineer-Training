# Databricks notebook source
#TASK-1
from pyspark.sql import SparkSession
spark = SparkSession.builder.getOrCreate()
product_data = [
    (101, "Laptop", "Electronics", 55000, 10),
    (102, "Smartphone", "Electronics", 30000, 25),
    (103, "Chair", "Furniture", 2500, 50),
    (104, "Book", "Stationery", 400, 200),
    (105, "Headphones", "Electronics", 1500, 100),
    (106, "Table", "Furniture", 3200, 40),
    (107, "Pen", "Stationery", 20, 500),
    (108, "Monitor", "Electronics", 12000, 15),
    (109, "Notebook", "Stationery", 60, 300),
    (110, "Sofa", "Furniture", 45000, 5)
]
columns = ["product_id", "product_name", "category", "price", "quantity"]
df_csv = spark.createDataFrame(product_data, columns)
df_csv.show()



# COMMAND ----------

# Reading same data in json
product_data = [
    {"product_id": 101, "product_name": "Laptop", "category": "Electronics", "price": 55000, "quantity": 10},
    {"product_id": 102, "product_name": "Smartphone", "category": "Electronics", "price": 30000, "quantity": 25},
    {"product_id": 103, "product_name": "Chair", "category": "Furniture", "price": 2500, "quantity": 50},
    {"product_id": 104, "product_name": "Book", "category": "Stationery", "price": 400, "quantity": 200},
    {"product_id": 105, "product_name": "Headphones", "category": "Electronics", "price": 1500, "quantity": 100},
    {"product_id": 106, "product_name": "Table", "category": "Furniture", "price": 3200, "quantity": 40},
    {"product_id": 107, "product_name": "Pen", "category": "Stationery", "price": 20, "quantity": 500},
    {"product_id": 108, "product_name": "Monitor", "category": "Electronics", "price": 12000, "quantity": 15},
    {"product_id": 109, "product_name": "Notebook", "category": "Stationery", "price": 60, "quantity": 300},
    {"product_id": 110, "product_name": "Sofa", "category": "Furniture", "price": 45000, "quantity": 5}
]
#Creating dataframe using spark
df_json = spark.createDataFrame(product_data)
df_json.show()



# COMMAND ----------

#TASK-3
df_csv.write.mode("overwrite").parquet("/tmp/products_parquet")
df_parquet = spark.read.parquet("/tmp/products_parquet")
df_parquet.show()

# COMMAND ----------

#TASK-4
# Save as CSV
df_csv.write.mode("overwrite").csv("/tmp/products_csv")

# Save as JSON
df_csv.write.mode("overwrite").json("/tmp/products_json")

# Save as Parquet
df_csv.write.mode("overwrite").parquet("/tmp/products_parquet")




# COMMAND ----------

#TASK-5
from pyspark.sql.functions import sum
category_sales=df_sales.groupBy("category").agg(sum("total_sales").alias("total_sales_by_category"))
category_sales.show()

# COMMAND ----------

#TASK-6
from pyspark.sql.functions import col
top_3_products=df_sales.orderBy(col("total_revenue").desc()).limit(3)
top_3_products.show()

# COMMAND ----------

#TASK-7
from pyspark.sql.functions import col
furniture_filtered=df_csv.filter((col("category")=="Furniture") & (col("price")>3000))
furniture_filtered.show()

# COMMAND ----------

#TASK-8
from pyspark.sql.functions import when,col
df_price_band = df_csv.withColumn("price_band",
    when(col("price") > 10000, "High")
    .when((col("price") > 3000) & (col("price") <= 10000), "Medium")
    .otherwise("Low")
)
df_price_band.show()

# COMMAND ----------

#TASK-9
from pyspark.sql.functions import sum
category_sales=df_csv.groupBy("category").agg(sum("quantity").alias("total_quantity_sold"))
category_sales.show()

# COMMAND ----------

#TASK-10
from pyspark.sql.functions import avg
category_avg_price=df_csv.groupBy("category").agg(avg("price").alias("average_price"))
category_avg_price.show()

# COMMAND ----------

#TASK-11
price_band_count=df_price_band.groupBy("price_band").count()
price_band_count.show()

# COMMAND ----------

#TASK-12
from pyspark.sql.functions import col
filtered_electronics=df_csv.filter((col("category")=="Electronics") & (col("price")>5000))
filtered_electronics.show()

# COMMAND ----------

#TASK-13
from pyspark.sql.functions import col
stationery_products = df_csv.filter(col("category") == "Stationery")
stationery_products.write.mode("overwrite").json("/tmp/stationery_products")
spark.read.json("/tmp/stationery_products").show()


# COMMAND ----------

#TASK-14
from pyspark.sql.functions import col
df_parquet=spark.read.parquet("/tmp/products_parquet")
df_with_revenue=df_parquet.withColumn("total_revenue",col("price")*col("quantity"))
category_revenue=df_with_revenue.groupBy("category").agg(sum("total_revenue").alias("total_revenue_by_category"))
category_revenue.orderBy(col("total_revenue_by_category").desc()).show(1)




# COMMAND ----------

#TASK-15 (BONUS)
df_csv.createOrReplaceTempView("products_view")
result=spark.sql("""
                 SELECT * FROM products_view
                 WHERE quantity > 100 AND price < 1000
                 """)
result.show()