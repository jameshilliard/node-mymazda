# node-mymazda

This is an API client for the MyMazda (Mazda Connected Services) API, written in TypeScript.  This is the API used by the MyMazda mobile app ([iOS](https://apps.apple.com/us/app/mymazda/id451886367)/[Android](https://play.google.com/store/apps/details?id=com.interrait.mymazda)).

Note: There is no official API, and this library may stop working at any time without warning.

There is also a Python version of this library called [pymazda](https://github.com/bdr99/pymazda).

# Installation

To install the latest release from npm, run `npm install node-mymazda`.

# Quick Start

This example initializes the API client and gets a list of vehicles linked to the account. Then, for each vehicle, it gets and outputs the vehicle status and starts the engine.

```javascript
import MyMazda from "node-mymazda";

async function test() {
    // Initialize API Client (MNAO = North America)
    let client = new MyMazda("myemail", "mypassword", "MNAO");

    // Get list of vehicles from the API (returns a list)
    let vehicles = await client.getVehicles();

    // Loop through the registered vehicles
    for (let vehicle of vehicles) {
        // Get vehicle ID (you will need this in order to perform any other actions with the vehicle)
        let vehicleId = vehicle.id;

        // Get and output vehicle status
        let status = await client.getVehicleStatus(vehicleId);
        console.log(status);

        // Start engine
        await client.startEngine(vehicleId);
    }
}

test();
```

You will need the email address and password that you use to sign into the MyMazda mobile app. Before using this library, you will need to link your vehicle to your MyMazda account using the app. You will also need the region code for your region. See below for a list of region codes.

When calling these methods, it may take some time for the vehicle to respond accordingly. This is dependent on the quality of the car's connection to the mobile network.

# API Documentation

## Initialize API Client

```javascript
let client = new MyMazda(email, password, region);
```

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `email`   | The email address you use to log into the MyMazda mobile app |
| `password` | The password you use to log into the MyMazda mobile app |
| `region` | The code for the region in which your account was registered<br>Supported regions include:<ul><li>North America (`MNAO`)</li><li>Europe (`MME`)</li><li>Japan (`MJO`)</li></ul> |

### Return value

Returns an instance of `MyMazdaAPIClient` which can be used to invoke the below methods.

## Get List of Vehicles

```javascript
await client.getVehicles()
```

Gets a list of vehicles linked with the MyMazda account. **Only includes vehicles which are compatible with and enrolled in Mazda Connected Services.**

### Parameters
None

### Return value

```jsonc
[
   {
      "vin": "JMXXXXXXXXXXXXXXX",
      "id": 12345, // You will need this ID to call the other methods
      "nickname": "My Mazda3",
      "carlineCode": "M3S",
      "carlineName": "MAZDA3 2.5 S SE AWD",
      "modelYear": "2021",
      "modelCode": "M3S  SE XA",
      "modelName": "W/ SELECT PKG AWD SDN",
      "automaticTransmission": true,
      "interiorColorCode": "BY3",
      "interiorColorName": "BLACK",
      "exteriorColorCode": "42M",
      "exteriorColorName": "DEEP CRYSTAL BLUE MICA"
   },
   {
      // Other vehicles registered to your account
   }
]
```

## Get vehicle status

```javascript
await client.getVehicleStatus(vehicleId)
```

Get information about the current status of the vehicle. In my experience, this info is usually current as of the last time the vehicle was used.

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

```jsonc
{
   "lastUpdatedTimestamp": "20210227145504",
   "latitude": 0.000000,
   "longitude": 0.000000,
   "positionTimestamp": "20210227145503",
   "fuelRemainingPercent": 18.0,
   "fuelDistanceRemainingKm": 79.15,
   "odometerKm": 3105.8,
   "doors": {
      "driverDoorOpen": false,
      "passengerDoorOpen": false,
      "rearLeftDoorOpen": false,
      "rearRightDoorOpen": false,
      "trunkOpen": false,
      "hoodOpen": false,
      "fuelLidOpen": false
   },
   "doorLocks":{
      "driverDoorUnlocked": false,
      "passengerDoorUnlocked": false,
      "rearLeftDoorUnlocked": false,
      "rearRightDoorUnlocked": false
   },
   "windows":{
      "driverWindowOpen": false,
      "passengerWindowOpen": false,
      "rearLeftWindowOpen": false,
      "rearRightWindowOpen": false
   },
   "hazardLightsOn": false,
   "tirePressure": {
      "frontLeftTirePressurePsi": 33.0,
      "frontRightTirePressurePsi": 35.0,
      "rearLeftTirePressurePsi": 33.0,
      "rearRightTirePressurePsi": 33.0
   }
}
```

## Get EV vehicle status

```javascript
await client.getEVVehicleStatus(vehicleId)
```

Get additional status information which is specific to electric vehicles. This method should only be called for electric vehicles. To determine if the vehicle is electric, use the `isElectric` attribute from the `getVehicles()` response.

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

```jsonc
{
    "chargeInfo": {
        "lastUpdatedTimestamp": "20210807083956",
        "batteryLevelPercentage": 10,
        "drivingRangeKm": 218,
        "pluggedIn": false,
        "charging": true,
        "basicChargeTimeMinutes": 3, // Estimated time in minutes to fully charge using AC charging
        "quickChargeTimeMinutes": 0, // Estimated time in minutes to fully charge using DC charging
        "batteryHeaterAuto": true, // Current battery heater mode (true = auto, false = off)
        "batteryHeaterOn": true // Whether the battery heater is currently running
    },
    "hvacInfo": {
        "hvacOn": true,
        "frontDefroster": false,
        "rearDefroster": false,
        "interiorTemperatureCelsius": 15.1 // Current interior temperature of the car (actual temperature, not the HVAC setting)
    }
}
```

## Start Engine

```javascript
await client.startEngine(vehicleId)
```

Starts the engine. May take some time for the engine to start.

### Parameters

| Parameter | stopEngine |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

None

## Stop Engine

```javascript
await client.stopEngine(vehicleId)
```

Stops the engine. I believe this only works if the engine was started remotely (using Mazda Connected Services).

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

None

## Lock Doors

```javascript
await client.lockDoors(vehicleId)
```

Locks the doors.

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

None

## Unlock Doors

```javascript
await client.unlockDoors(vehicleId)
```

Unlocks the doors.

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

None

## Turn On Hazard Lights

```javascript
await client.turnHazardLightsOn(vehicleId)
```

Turns on the vehicle hazard lights.

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

None

## Turn Off Hazard Lights

```javascript
await client.turnHazardLightsOff(vehicleId)
```

Turns off the vehicle hazard lights.

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

None

## Send POI

```javascript
await client.sendPOI(vehicleId, latitude, longitude, name)
```

Send a GPS location to the vehicle's navigation. Requires a navigation SD card in the vehicle.

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |
| `latitude` | Latitude of the POI location |
| `longitude` | Longitude of the POI location|
| `name` | A friendly name for the location (e.g. "Work") |

### Return value

None

## Start Charging

```javascript
await client.startCharging(vehicleId)
```

Starts charging the battery (only for electric vehicles).

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

None

## Stop Charging

```javascript
await client.stopCharging(vehicleId)
```

Stops charging the battery (only for electric vehicles).

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

None

## Get HVAC Setting

```javascript
await client.getHVACSetting(vehicleId)
```

Get the current settings for the vehicle's HVAC system. Only for electric vehicles.

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

```jsonc
{
    "temperature": 20, // Current target temperature (NOT the current interior temperature reading)
    "temperatureUnit": "C",
    "frontDefroster": true,
    "rearDefroster": false
}
```

## Set HVAC Setting

```javascript
await client.setHVACSetting(vehicleId, temperature, temperatureUnit, frontDefroster, rearDefroster)
```

Set the HVAC settings for the vehicle's HVAC system. Only for electric vehicles.

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |
| `temperature` | Desired target temperature |
| `temperatureUnit` | Temperature unit - `"F"` or `"C"` |
| `frontDefroster` | Whether to use the front defroster - `true` or `false` |
| `rearDefroster` | Whether to use the rear defroster - `true` or `false` |

### Return value

None

## Turn On HVAC

```javascript
await client.turnOnHVAC(vehicleId)
```

Turn on the vehicle's HVAC system. Only for electric vehicles.

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

None

## Turn Off HVAC

```javascript
await client.turnOffHVAC(vehicleId)
```

Turn off the vehicle's HVAC system. Only for electric vehicles.

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

None

## Refresh Vehicle Status

```javascript
await client.refreshVehicleStatus(vehicleId)
```

Request a new status update from the vehicle. Only for electric vehicles.

### Parameters

| Parameter | Description |
| --------- | ----------- |
| `vehicleId` | Vehicle ID (obtained from `getVehicles()`) |

### Return value

None