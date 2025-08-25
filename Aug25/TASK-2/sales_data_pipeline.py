import os
import pandas as pd

# Optional: Azure SDK upload (skips if no Azure credentials)
def try_upload_to_blob(local_path, blob_name):
    try:
        from azure.storage.blob import BlobServiceClient
    except ImportError:
        print(f"[Blob Upload] Skipped (Azure SDK not installed): {local_path}")
        return

    account_name = os.getenv("AZURE_STORAGE_ACCOUNT_NAME")
    account_key = os.getenv("AZURE_STORAGE_ACCOUNT_KEY")
    container_name = os.getenv("AZURE_CONTAINER_NAME")

    if not (account_name and account_key and container_name):
        print(f"[Blob Upload] Skipped (no Azure credentials): {local_path}")
        return

    try:
        blob_service_client = BlobServiceClient(
            account_url=f"https://{account_name}.blob.core.windows.net",
            credential=account_key
        )
        container_client = blob_service_client.get_container_client(container_name)
        container_client.upload_blob(name=blob_name, data=open(local_path, "rb"), overwrite=True)
        print(f"[Blob Upload] Uploaded {blob_name}")
    except Exception as e:
        print(f"[Blob Upload] FAILED for {local_path}: {e}")


def main():
    # Step 1: Load data
    df = pd.read_csv("data/sales_data.csv")

    # Step 2: Save raw copy (unchanged)
    raw_out = "raw_sales_data.csv"
    df.to_csv(raw_out, index=False)

    # Step 3: Remove duplicates by order_id
    df = df.drop_duplicates(subset=["order_id"])

    # Ensure revenue/cost are numeric
    df["revenue"] = pd.to_numeric(df["revenue"], errors="coerce")
    df["cost"] = pd.to_numeric(df["cost"], errors="coerce")

    # Step 4: Handle missing values
    df["region"] = df["region"].fillna("Unknown")
    df["revenue"] = df["revenue"].fillna(0)

    # Step 5: Add profit_margin
    df["profit_margin"] = (df["revenue"] - df["cost"]) / df["revenue"].replace(0, pd.NA)
    df["profit_margin"] = df["profit_margin"].fillna(0)

    # Step 6: Customer segmentation
    def segment(rev):
        if rev > 100000:
            return "Platinum"
        elif 50000 < rev <= 100000:
            return "Gold"
        else:
            return "Standard"

    df["customer_segment"] = df["revenue"].apply(segment)

    # Step 7: Save processed data
    processed_out = "processed_sales_data.csv"
    df.to_csv(processed_out, index=False)

    print("✅ Files created: raw_sales_data.csv, processed_sales_data.csv")

    # Try upload to Azure (skips if no credentials)
    try_upload_to_blob(raw_out, "raw_sales_data.csv")
    try_upload_to_blob(processed_out, "processed_sales_data.csv")


if __name__ == "__main__":
    main()
