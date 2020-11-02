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
                cols.append(entries[2].strip())
            else:
                d = (entries[3]+ " " + entries[4]).strip()
                if not d[-1].isalpha(): #gets rid of non-alpha character at end
                    d = d[:-1]
                cols.append(d)


data=[] #a list of dictionaries ***each dictionary, the keys are the same. They are the cols. The values are the data
with open(df_path, 'r') as f:
    lines = f.readlines()
    for line in lines: #separates datafile
        entries = line.split(' ')
        
        if(len(cols) != len(entries)): #checks to make sure size matches col_key
            print("Warning! Row has a different number of columns than specified!")
        t = {} #each dictionary contains data for that time row
        for i in range(len(cols)):
            if(entries[i] != "NaN"): #turns data into numbers
                entries[i]=float(entries[i])
            t[cols[i]] = entries[i]
        data.append(t) #adds dictionary to dataset