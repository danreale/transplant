import pandas as pd
from itertools import product
import datetime
import pytz


df = pd.read_csv("WaitingList.csv")

print(df.info())

# Rename columns
df.rename(
    columns={
        "Unnamed: 0": "region",
        "Unnamed: 1": "wait_list_type",
        "Unnamed: 2": "wait_list_time",
        "Unnamed: 3": "ExtraSpace",
        "All ABO": "blood_type_all",
        "O": "blood_type_o",
        "A": "blood_type_a",
        "B": "blood_type_b",
        "AB": "blood_type_ab",
    },
    inplace=True,
)

# Remove Extra Space column since that's not needed
df.drop("ExtraSpace", axis=1, inplace=True)


# Drop all rows that have NaN for all values
df.dropna(how="all", inplace=True)


# Fill in missing values for region and wait list type
df.ffill(inplace=True, axis=0)


# print info
# print(df.info())


# Create Row Conditions

regions = [
    "All Regions",
    "Region  1",
    "Region  2",
    "Region  3",
    "Region  4",
    "Region  5",
    "Region  6",
    "Region  7",
    "Region  8",
    "Region  9",
    "Region  10",
    "Region  11",
]

wait_list_types = [
    "All Types",
    "Heart Status 1A",
    "Heart Status 1B",
    "Heart Status 2",
    "Heart Status 7 (Inactive)",
]

wait_list_times = [
    "All Time",
    "< 30 Days",
    "30 to < 90 Days",
    "90 Days to < 6 Months",
    "6 Months to < 1 Year",
    "1 Year to < 2 Years",
    "2 Years to < 3 Years",
    "3 Years to < 5 Years",
    "5 or More Years",
]


def generate_combinations(regions, wait_list_types, wait_list_times):
    combinations = []
    for region, wait_list_type, wait_list_time in product(
        regions, wait_list_types, wait_list_times
    ):
        combinations.append(
            {
                "region": region,
                "wait_list_type": wait_list_type,
                "wait_list_time": wait_list_time,
            }
        )
    return combinations


# Generate all possible combinations
combinations = generate_combinations(regions, wait_list_types, wait_list_times)
# print("Combinations:")
# print(combinations)

# Check to see if the combination exists in the data
missing_combinations = []
for combination in combinations:
    query = (
        f"region == '{combination['region']}' and "
        f"wait_list_type == '{combination['wait_list_type']}' and "
        f"wait_list_time == '{combination['wait_list_time']}'"
    )
    if df.query(query).empty:
        missing_combinations.append(
            {
                "region": combination["region"],
                "wait_list_type": combination["wait_list_type"],
                "wait_list_time": combination["wait_list_time"],
                "blood_type_all": 0,
                "blood_type_a": 0,
                "blood_type_b": 0,
                "blood_type_o": 0,
                "blood_type_ab": 0,
            }
        )

missing_combo_count = len(missing_combinations)
print("Missing combinations:")
print(missing_combo_count)

if missing_combo_count == 540:
    raise Exception("There should not be 540 missing combinations")

# For each missing combination, add a row
for combination in missing_combinations:
    df = pd.concat([df, pd.DataFrame([combination])], ignore_index=True)


# Sort the DataFrame by Region, WaitListType, and WaitListTime in the specified order
df["region"] = pd.Categorical(df["region"], categories=regions, ordered=True)
df["wait_list_type"] = pd.Categorical(
    df["wait_list_type"], categories=wait_list_types, ordered=True
)
df["wait_list_time"] = pd.Categorical(
    df["wait_list_time"], categories=wait_list_times, ordered=True
)

# Sort the DataFrame by Region, WaitListType, and WaitListTime
df.sort_values(by=["region", "wait_list_type", "wait_list_time"], inplace=True)


# Check for duplicate records
duplicates = df[
    df.duplicated(subset=["region", "wait_list_type", "wait_list_time"], keep=False)
]
# print("Duplicate records:")
# print(duplicates)

# Remove duplicate records if any exists
if duplicates.empty == False:
    df.drop_duplicates(
        subset=["region", "wait_list_type", "wait_list_time"],
        keep="first",
        inplace=True,
    )


# Count the number of rows
num_rows = df.shape[0]
print(f"Number of rows: {num_rows}")

if num_rows != 540:
    raise Exception("Incorrect Number of rows added", num_rows, "Should be 540")

# Set todays date as report date column
# Get the current time with timezone information
timezone = pytz.timezone("America/New_York")
x = datetime.datetime.now(timezone)

todays_date = x.strftime("%Y-%m-%d")
print(todays_date)

# todays_date = "2025-01-30"
df["report_date"] = todays_date

# Make the date column a date type
# df.report_date = pd.to_datetime(df.report_date)

# Make Blood Type columns integers
columns_to_check_type = [
    "blood_type_all",
    "blood_type_a",
    "blood_type_b",
    "blood_type_o",
    "blood_type_ab",
]

for column_name in columns_to_check_type:
    if df[column_name].dtype == "object":
        # # Action for string column
        df[column_name] = df[column_name].str.replace(",", "", regex=False)
        df[column_name] = pd.to_numeric(df[column_name])
    # fill in nulls That used to be 0 as 0
    df.fillna({column_name: 0}, inplace=True)


# reindex data
df.reset_index()
print(df.info())
print(df.head(25))

with open("WaitingList.json", "w") as f:
    f.write(df.to_json(orient="records"))
