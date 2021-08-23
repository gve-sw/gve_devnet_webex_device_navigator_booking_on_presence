/*
Copyright (c) 2021 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
*/

const xapi = require('xapi');

//Adjust meeting parameters
const bookingDuration = 30 //in minutes
const bookingTitle = "Automated Walk-In Booking"


function applyConfiguration(){
  // Ensure PresenceDetector is On
  xapi.Config.RoomAnalytics.PeoplePresenceDetector.set("On");

  // Ensure counting of people out of call is enabled
  xapi.Config.RoomAnalytics.PeopleCountOutOfCall.set("On");
}


function createBooking() {
    //https://roomos.cisco.com/xapi/Command.Bookings.Book/
    xapi.Command.Bookings.Book({Title: bookingTitle, Duration: bookingDuration});
    console.log("Created automated booking!")
}

function removeBooking(){
  //Check all of today's bookings and remove those with matched titles (can somtimes have duplicates booked overlapping)
  xapi.Command.Bookings.List({Days: 1}).then(result =>
      {
        for (const booking of result.Booking) {
          // console.log(booking)
          if(booking.Title==bookingTitle){
            xapi.Command.Bookings.Delete({ MeetingId: booking.MeetingId})
          };
        }
      });
  console.log("Removed automated booking!")
}

function manageRoom(occupied){
  if(occupied == "Yes"){
    console.log("Occupied! Creating booking...")
    createBooking()

  }else if (occupied == "No") {
    console.log("Unoccupied! Removing booking...")
    removeBooking()
  }else {
    console.log("Presence Unknown")
  }
}

function beginDetection() {

  //Runs on presence change
  xapi.Status.RoomAnalytics.PeoplePresence.on(presence => {
    // https://roomos.cisco.com/xapi/Status.RoomAnalytics.PeoplePresence/
    //Shows if there are people present in the room or not.
    //The feature is based on ultrasound.
    //The device will not keep record of who was in the room, only whether or not there are people present in the room.
    //When someone enters the room, the status is updated immediately.
    //After the room gets vacant, it may take up to two minutes for the status to change.
      console.log("Change in occupancy detected. Room is now occupied?: " + presence);


      if(presence == "No" || presence == "Unknown"){ //If the presence is No, do a double check by seeing people count
        xapi.Status.RoomAnalytics.PeopleCount.Current.get().then(count => {
          if(count >= 1){
            //Presence: No but Count: >1 then  book
            manageRoom("Yes")
          }else{
            //Presence: No and Count <1 then remove
            manageRoom("No")
          }
        });
      }else{
        //Presence: Yes Count: Not Checked then  book
        manageRoom("Yes")
      }
    });


    //Subscribe to people count. When 0 are detected, do a check then free up the room
    xapi.Status.RoomAnalytics.PeopleCount.Capacity.on(count => {
      if(count>=1){
        console.log("PeoplePresence triggered. There are 1 or more people detected")
        //People detected, manage the room booking
        //Count >=1 always book room regardless of presence
        manageRoom("Yes")
      }else{
        console.log("PeoplePresence triggered. There are no people detected. Checking presence...")
        //Since this might not detect the person, double check presence
        xapi.Status.RoomAnalytics.PeoplePresence.get().then(presence => {
          if(presence=="No"){
            //Presence: No, Count: <1 remove booking
            console.log("Presence is none, managing room....")
            manageRoom("No")
          }//Not sure what to do if the count is none but presence is some due to lag effect
        });
      }
    });



    //when booking ends check to see if people are still there
    xapi.Event.Bookings.End.on(booking_info => {
      console.log("Booking ended, checking to see if still occupied...");
      xapi.Status.RoomAnalytics.PeoplePresence.get()
      .then(stillOccupied => manageRoom(stillOccupied));
    });

}



/**
 * START Detection
 */
applyConfiguration();
beginDetection();






