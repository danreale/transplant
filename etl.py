import pandas as pd

df = pd.read_csv('WaitingList.csv')

print(df.info()) 

df.rename(columns={'Unnamed: 0': 'Region', 'Unnamed: 1': 'WaitListType', 'Unnamed: 2': 'WaitListTime', 'Unnamed: 3': 'ExtraSpace'}, inplace=True)
df.drop('ExtraSpace', axis=1, inplace=True)

print(df.to_string()) 

# df.to_json('temp.json', orient='records', lines=True)

with open('temp.json', 'w') as f:
    f.write(df.to_json(orient='records'))