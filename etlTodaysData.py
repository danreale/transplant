import pandas as pd
from itertools import product

df = pd.read_csv("WaitingList.csv")

print(df.info())

# Rename columns
df.rename(
    columns={
        "Unnamed: 0": "Region",
        "Unnamed: 1": "WaitListType",
        "Unnamed: 2": "WaitListTime",
        "Unnamed: 3": "ExtraSpace",
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
                "Region": region,
                "WaitListType": wait_list_type,
                "WaitListTime": wait_list_time,
                "All ABO": 0,
                "A": 0,
                "B": 0,
                "O": 0,
                "AB": 0,
            }
        )
    return combinations


# Generate all possible combinations
combinations = generate_combinations(regions, wait_list_types, wait_list_times)
# print(combinations)

# Check to see if the combination exists in the data
missing_combinations = []
for combination in combinations:
    query = (
        f"Region == '{combination['Region']}' and "
        f"WaitListType == '{combination['WaitListType']}' and "
        f"WaitListTime == '{combination['WaitListTime']}'"
    )
    if df.query(query).empty:
        missing_combinations.append(combination)

# print("Missing combinations:")
# print(missing_combinations)

# For each missing combination, add a row
for combination in missing_combinations:
    df = pd.concat([df, pd.DataFrame([combination])], ignore_index=True)


# Sort the DataFrame by Region, WaitListType, and WaitListTime in the specified order
df["Region"] = pd.Categorical(df["Region"], categories=regions, ordered=True)
df["WaitListType"] = pd.Categorical(
    df["WaitListType"], categories=wait_list_types, ordered=True
)
df["WaitListTime"] = pd.Categorical(
    df["WaitListTime"], categories=wait_list_times, ordered=True
)

# Sort the DataFrame by Region, WaitListType, and WaitListTime
df.sort_values(by=["Region", "WaitListType", "WaitListTime"], inplace=True)


# Check for duplicate records
duplicates = df[
    df.duplicated(subset=["Region", "WaitListType", "WaitListTime"], keep=False)
]
# print("Duplicate records:")
# print(duplicates)

# Remove duplicate records if any exists
if duplicates.empty == False:
    df.drop_duplicates(
        subset=["Region", "WaitListType", "WaitListTime"], keep="first", inplace=True
    )


# Count the number of rows
num_rows = df.shape[0]
print(f"Number of rows: {num_rows}")

if num_rows != 540:
    raise Exception("Incorrect Number of rows added", num_rows, "Should be 540")


# reindex data
df.reset_index()
print(df.info())

with open("WaitingList.json", "w") as f:
    f.write(df.to_json(orient="records"))
