# -*- coding: utf-8 -*-
"""
Created on Wed Oct 26 00:00:19 2020

@author: Charlotte
"""

from parsingAlgo import data #gets data from parsing algorithm
from fusion import Fusion

fuse_back = Fusion()
fuse_RUA = Fusion()
fuse_RLA = Fusion()
fuse_LUA = Fusion()
fuse_LLA = Fusion()

subset = data[0:50]

def get_AGM(row, key): #takes one time point and one IMU name 
    acc = (row[key+' accX'], row[key+' accY'], row[key+' accZ'])
    gyro = (row[key+' gyroX'], row[key+' gyroY'], row[key+' gyroZ'])
    mag = (row[key+' magneticX'], row[key+' magneticY'], row[key+' magneticZ'])
    
    return acc, gyro, mag

#y = [] #used for testing/looking at plots
for t in subset:
    back = get_AGM(t, 'BACK')
    RUA = get_AGM(t, 'RUA')
    RLA = get_AGM(t, 'RLA')
    LUA = get_AGM(t, 'LUA')
    LLA = get_AGM(t, 'LLA')
    
    fuse_back.update(back[0],back[1],back[2], t['MILLISEC'])
    fuse_RUA.update(RUA[0],RUA[1],RUA[2], t['MILLISEC'])
    #y.append(fuse_RUA.roll)
    fuse_RLA.update(RLA[0],RLA[1],RLA[2], t['MILLISEC'])
    fuse_LUA.update(LUA[0],LUA[1],LUA[2], t['MILLISEC'])
    fuse_LLA.update(LLA[0],LLA[1],LLA[2], t['MILLISEC'])

#for reference
#import matplotlib.pyplot as plt
#plt.plot([s['MILLISEC'] for s in subset], y)
#plt.show()