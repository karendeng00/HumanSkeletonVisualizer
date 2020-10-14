# -*- coding: utf-8 -*-
"""
Created on Sat Oct 10 10:15:42 2020

@author: Charlotte
"""

#filePath = input("File address: ")
df_path = "C:/Users/cmmcc/OneDrive/Desktop/SkeletonFiles/OpportunityUCIDataset/dataset/S1-ADL1.dat"
col_key_path = "C:/Users/cmmcc/OneDrive/Desktop/SkeletonFiles/OpportunityUCIDataset/dataset/column_names.txt"

#create list of column names
cols=[]
with open(col_key_path, 'r') as col_key: #NOTE: This part is specfic to OPPORTUNITY Dataset
    lines = col_key.readlines()
    for line in lines:
        entries = line.split(' ')
        if entries[0]=="Column:":
            if(len(entries) < 6):
                cols.append(entries[2])
            else:
                if not entries[4][-1].isalpha():
                    entries[4] = entries[4][:-1]
                cols.append(entries[3]+ " " + entries[4])



data=[] #a list of dictionaries ***each dictionary, the keys are the same. They are the cols. The values are the data
with open(df_path, 'r') as f:
    lines = f.readlines()
    for line in lines:
        entries = line.split(' ')
        
        if(len(cols) != len(entries)):
            print("Warning! Row has a different number of columns than specified!")
        t = {} #each dictionary contains data for that time row
        for i in range(len(cols)):
            if(entries[i] != "NaN"):
                entries[i]=int(entries[i])
            t[cols[i]] = entries[i]
        data.append(t)
        
subset = data[1:50] #gets data from the first 50 (seconds?)
positions = []
for s in subset:
    p = ((s['RUA gyroX'],s['RUA gyroY'], s['RUA gyroZ']))
    positions.append(p)