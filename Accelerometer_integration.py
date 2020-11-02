# -*- coding: utf-8 -*-
"""
Created on Sat Oct 10 10:15:42 2020

@author: Charlotte
"""

import numpy as np
from parsingAlgo import data #gets data from parsing algorithm
       
def get_acc(sub): #currently testing on RUA (right upper arm)
    acc = [] #list of vectors (numpy arrays)
    for s in sub:
        x = s['RUA_ accX']/9.8/1000 #NOTE: conversion is specific to OPPORTUNITY units. Will need to alter for other datasets
        y = s['RUA_ accY']/9.8/1000 #converts from milli g to m/s^2 based on a 256 sensitivity level
        z = s['RUA_ accZ']/9.8/1000
        acc.append(np.array([x,y,z]))
        
    return acc

def integrate(acc, t): #converts acc to velocitiy/velocity to position
    v = [np.array([0,0,0])]  #assume initial velocity/position is 0

    for i in range(len(acc)-1):
       # print(i)
        v.append(acc[i]*(t[i+1] - t[i]) + v[i])
        
    return v

def get_pos(sub): #gets position from acceleration
    acceleration = get_acc(sub)
    t = np.array([s['MILLISEC'] for s in sub]) #gets ms column from subset
    return integrate(integrate(acceleration, t), t) #converts acc to vel and vel to position

#example:
#get_pos(parsingAlgo.data[0:50])