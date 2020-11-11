AHRS Sensor Fusion Library (JavaScript)
======
This is an JavaScript compliment sensor fusion library for sensor arrays of gyroscopes, accelerometers, and magnetometers.  It was originally written in C++ and after ported to JavaScript, making it more accessible. It was also specifically developed for use with embedded systems and has been optimised for execution speed.  The library includes modules for: attitude and heading reference system (AHRS) sensor fusion, gyroscope bias correction, and a tilt-compensated compass.

AHRS sensor fusion algorithm
----------------------------

The AHRS sensor fusion algorithm to combines gyroscope, accelerometer, and magnetometer measurements into a single measurement of orientation relative to the Earth (NWU convention).

The algorithm can be used with only gyroscope and accelerometer measurements, or only gyroscope measurements.  Measurements of orientation obtained without magnetometer measurements can be expected to drift in the yaw component of orientation only.  Measurements of orientation obtained without magnetometer and accelerometer measurements can be expected to drift in all three degrees of freedom.

The algorithm also provides a measurement of linear acceleration and Earth acceleration.  Linear acceleration is equal to the accelerometer  measurement with the 1 g of gravity subtracted.  Earth acceleration is a measurement of linear acceleration in the Earth coordinate frame.

The algorithm outputs a quaternion describing the Earth relative to the sensor.  The library includes a quaternion conjugate function for converting this to a quaternion describing the sensor relative to the Earth, as well as functions for converting a quaternion to a rotation matrix and Euler angles.

Gyroscope bias correction algorithm
-----------------------------------

The gyroscope bias correction algorithm provides an estimate of the gyroscope bias to achieve run-time calibration.  The algorithm will detect when the gyroscope is stationary for a set period of time and then begin to sample the gyroscope output to calculate the bias as an average.

This algorithm is intended to be used in conjunction with the AHRS sensor fusion algorithm to improve the accuracy of the gyroscope measurements provided to the AHRS sensor fusion algorithm.

Tilt-compensated compass
------------------------

The tilt-compensated compass calculates an angular heading relative to magnetic north using accelerometer and magnetometer measurements (NWU convention).

Usage
------------------------

```
// g,a,m are sensor measurements (three-axis each)
// NOTE: usally, raw gyroscope values need to be converted in radians/sec

var fusionAhrs = clone(FusionAhrs);
var gyro = clone(FusionVector3);
gyro.axis.x = gx;
gyro.axis.y = gy;
gyro.axis.z = gz;

var accelerometer = clone(FusionVector3);
accelerometer.axis.x = ax;
accelerometer.axis.y = ay;
accelerometer.axis.z = az;

var magnetometer = clone(FusionVector3);
magnetometer.axis.x = mx;
magnetometer.axis.y = my;
magnetometer.axis.z = mz;

var heading = FusionCompassCalculateHeading(accelerometer, magnetometer);
FusionAhrsUpdate(fusionAhrs, gyroscope, accelerometer, magnetometer, 0.01f); // assumes 100 Hz sample rate
FusionAhrsUpdate(fusionAhrs, gyroscope, accelerometer, FUSION_VECTOR3_ZERO, 0.01f); // alternative function call to ignore magnetometer
FusionAhrsUpdate(fusionAhrs, gyroscope, FUSION_VECTOR3_ZERO, FUSION_VECTOR3_ZERO, 0.01f); // alternative function call to ignore accelerometer and magnetometer
```

References
------------------------
You can find the original C++ Fusion library here: https://github.com/xioTechnologies/Fusion/.

Follow the comments inside the .c/.h files to further details about the usage.
