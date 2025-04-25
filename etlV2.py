import pandas as pd

df1 = pd.read_csv('WaitingList.csv')
df2 = pd.read_csv('WaitingListYesterday.csv')

todays_date = "2025-01-28"
yesterdays_date = "2025-01-27"


# Todays Data
print(df1.info()) 
df1.rename(columns={'Unnamed: 0': 'Region', 'Unnamed: 1': 'WaitListType', 'Unnamed: 2': 'WaitListTime', 'Unnamed: 3': 'ExtraSpace'}, inplace=True)
df1.drop('ExtraSpace', axis=1, inplace=True)
df1['Report_Date'] = todays_date
df1.dropna(how='all', inplace=True)
df1.ffill(inplace=True, axis=0)
print(df1)

# Yesterdays Data
print(df2.info()) 
df2.rename(columns={'Unnamed: 0': 'Region', 'Unnamed: 1': 'WaitListType', 'Unnamed: 2': 'WaitListTime', 'Unnamed: 3': 'ExtraSpace'}, inplace=True)
df2.drop('ExtraSpace', axis=1, inplace=True)
df2['Report_Date'] = yesterdays_date
df2.dropna(how='all', inplace=True)
df2.ffill(inplace=True, axis=0)
print(df2)


# Add in missing Wait List Time Rows


# chat gpt
# Set Region and WaitListType as index for alignment
df1 = df1.set_index(['Region', 'WaitListType', 'WaitListTime'])
df2 = df2.set_index(['Region', 'WaitListType', 'WaitListTime'])

# Reindex df2 to match df1
df2_aligned = df2.reindex(df1.index)

# Create a new DataFrame to keep the original values and differences
# Today
comparison = df1[['All ABO', 'O', 'A', 'B', 'AB', 'Report_Date']].copy()
comparison.rename(columns={"All ABO": "All_ABO_Today", "O": "O_Today", "A": "A_Today", "B": "B_Today", "AB": "AB_Today", "Report_Date": "Report_Date_Today"}, inplace=True)

# Add yesterday's values
comparison['All_ABO_Yesterday'] = df2_aligned['All ABO']
comparison['O_Yesterday'] = df2_aligned['O']
comparison['A_Yesterday'] = df2_aligned['A']
comparison['B_Yesterday'] = df2_aligned['B']
comparison['AB_Yesterday'] = df2_aligned['AB']
comparison['Report_Date_Yesterday'] = df2_aligned['Report_Date']

# Calculate differences
# today - yesterday
comparison['all_abo_diff'] = comparison['All_ABO_Today'] - comparison['All_ABO_Yesterday']
comparison['o_change'] = comparison['O_Today'] - comparison['O_Yesterday']
comparison['a_change'] = comparison['A_Today'] - comparison['A_Yesterday']
comparison['b_change'] = comparison['B_Today'] - comparison['B_Yesterday']
comparison['ab_change'] = comparison['AB_Today'] - comparison['AB_Yesterday']

# Reset index for readability
# comparison = comparison.reset_index()

comparison = comparison.reset_index().drop_duplicates()
# comparison = comparison[comparison['WaitListTime'] 'All']


# Display the result
print(comparison.info()) 
print('Comparison',comparison)


# Filter rows where any of the "_diff" columns are not zero
diff_columns = [col for col in comparison.columns if '_change' in col]
changes_only = comparison[comparison[diff_columns].ne(0).any(axis=1)]
changes_only = changes_only[changes_only['WaitListTime'] != 'All Time']


# Display the new DataFrame with changes only
print('Changes', changes_only)






# Melt the DataFrame to focus on blood types and their changes
blood_type_columns = ['o_change', 'a_change', 'b_change', 'ab_change']
melted = changes_only.melt(
    id_vars=['Region', 'WaitListType', 'WaitListTime'], 
    value_vars=blood_type_columns, 
    var_name='BloodType', 
    value_name='Change'
)

# Filter non-zero changes
melted = melted[melted['Change'] != 0]

# Group by Region and Blood Type
grouped = melted.groupby(['Region', 'BloodType'])

df_grouped = pd.DataFrame(grouped)
print('Grouped', df_grouped)

# Initialize a list to collect patterns
patterns = []



# Loop through each group and find relationships
for (region, blood_type), group in grouped:
    # Check for opposite changes within the group
    positive_changes = group[group['Change'] > 0]
    negative_changes = group[group['Change'] < 0]
    
    if not positive_changes.empty and not negative_changes.empty:
        # Record patterns for matching +1 and -1
        patterns.append({
            'Region': region,
            'BloodType': blood_type,
            'Positive_WaitListType': positive_changes['WaitListType'].tolist(),
            'Negative_WaitListType': negative_changes['WaitListType'].tolist(),
            'Pattern': 'Movement changes detected',
            'Positive_WaitListTime': positive_changes['WaitListTime'].tolist(),
            'Negative_WaitListTime': negative_changes['WaitListTime'].tolist(),
        })
    else:
        if not positive_changes.empty:
            # added to waiting list
            # Record cases with no opposite changes
            patterns.append({
                'Region': region,
                'BloodType': blood_type,
                'Positive_WaitListType': positive_changes['WaitListType'].tolist(),
                'Negative_WaitListType': negative_changes['WaitListType'].tolist(),
                'Pattern': 'Added to Waiting List pattern detected',
                'Positive_WaitListTime': positive_changes['WaitListTime'].tolist(),
                'Negative_WaitListTime': [],
            })
        elif not negative_changes.empty:
            # Got transplanted
            # Record cases with no opposite changes
            patterns.append({
                'Region': region,
                'BloodType': blood_type,
                'Positive_WaitListType': positive_changes['WaitListType'].tolist(),
                'Negative_WaitListType': negative_changes['WaitListType'].tolist(),
                'Pattern': 'Transplant pattern detected',
                'Positive_WaitListTime': [],
                'Negative_WaitListTime': negative_changes['WaitListTime'].tolist(),
            })
        else:
            # Cannot determine pattern
            patterns.append({
                'Region': region,
                'BloodType': blood_type,
                'Positive_WaitListType': positive_changes['WaitListType'].tolist(),
                'Negative_WaitListType': negative_changes['WaitListType'].tolist(),
                'Pattern': 'Cannot determine pattern',
                'Positive_WaitListTime': positive_changes['WaitListTime'].tolist(),
                'Negative_WaitListTime': negative_changes['WaitListTime'].tolist(),
            })

# Create a DataFrame to summarize detected patterns
patterns_df = pd.DataFrame(patterns)

# Display the pattern DataFrame
print('Patterns',patterns_df)

with open('WaitingList.json', 'w') as f:
    f.write(df1.to_json(orient='records'))

with open('WaitingListYesterday.json', 'w') as f:
    f.write(df2.to_json(orient='records'))

with open('WaitingListMerged.json', 'w') as f:
    f.write(comparison.to_json(orient='records'))

with open('WaitingListMergedDiffs.json', 'w') as f:
    f.write(changes_only.to_json(orient='records'))

with open('WaitingListMergedPatternsGrouped.json', 'w') as f:
    f.write(df_grouped.to_json(orient='records'))

with open('WaitingListMergedPatterns.json', 'w') as f:
    f.write(patterns_df.to_json(orient='records'))