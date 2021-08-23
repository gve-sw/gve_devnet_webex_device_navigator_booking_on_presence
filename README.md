# GVE Devnet Webex Device Navigator Booking on Presence
Room devices macro to create booking upon detecting people entering the room which turns on the LED and indicates the room is in use on any associated navigator device.



## Contacts
* Andrew Dunsmoor (adunsmoo@cisco.com)

## Solution Components
* Webex Room Devices
* xAPI
* Webex Navigator
* RoomOS

## Installation/Configuration

If you are unfamiliar with Cisco Room device macros and how to manage them, this is a good article to get started: https://help.webex.com/en-us/np8b6m6/Use-of-Macros-with-Room-and-Desk-Devices-and-Webex-Boards

Log into the Webex Endpoint Device. 
In the menu on the left under "Customization", select "Macro Editor". 
Create a new macro and paste the Javascript code into the editor. 
Save the code, ensure the macro is enabled and test it out!


The script requires both the PeopleCountOutOfCall and PeoplePresenceDetector to be enabled on the device. 
This configuration is attempted in the javascript, but you should ensure they're turned on. 

Booking Title and default duration can be adjusted at the top of the macro:
```javascript
//Adjust meeting parameters
const bookingDuration = 30 //in minutes
const bookingTitle = "Automated Walk-In Booking"
```
Note: The booking duration only matters for how you'd like walk-ins to appear in your calendar system. 
The macro will dynamically add/remove/extend the booking as long as the room is occupied. 

## Usage

The macro leverages the RoomOS xAPI to detect when the room is occupied. 
When the room is occupied, a calendar booking is made to indicate the room is in use. 
Once the occupant leaves, the booking is removed. 
The macro utilizes both the PeoplePresence and PeopleCountOutOfCall statuses as triggers to book/unbook the room. 
There is a disclaimer on PeoplePresence that it will take up to 2 minutes to register the room is empty, 
hence we use both Presence and Count to provide greater certainty. 

API reference: https://roomos.cisco.com/xapi 

Room Analytics specifically: https://roomos.cisco.com/xapi/domain/?domain=RoomAnalytics


# Screenshots

![/IMAGES/IMG_1361.jpeg](/IMAGES/IMG_1361.jpeg)

### LICENSE

Provided under Cisco Sample Code License, for details see [LICENSE](LICENSE.md)

### CODE_OF_CONDUCT

Our code of conduct is available [here](CODE_OF_CONDUCT.md)

### CONTRIBUTING

See our contributing guidelines [here](CONTRIBUTING.md)

#### DISCLAIMER:
<b>Please note:</b> This script is meant for demo purposes only. All tools/ scripts in this repo are released for use "AS IS" without any warranties of any kind, including, but not limited to their installation, use, or performance. Any use of these scripts and tools is at your own risk. There is no guarantee that they have been through thorough testing in a comparable environment and we are not responsible for any damage or data loss incurred with their use.
You are responsible for reviewing and testing any scripts you run thoroughly before use in any non-testing environment.