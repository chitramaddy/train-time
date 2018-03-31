$(document).ready(function(){
// Initialize Firebase
var config = {
    apiKey: "AIzaSyB4EdcfKFg3HpsHgLYjDdsJ6YN4lf19h4w",
    authDomain: "mock-cdb53.firebaseapp.com",
    databaseURL: "https://mock-cdb53.firebaseio.com",
    projectId: "mock-cdb53",
    storageBucket: "mock-cdb53.appspot.com",
    messagingSenderId: "850606116600"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //to add a train to the database on clicking submit
  $("#submit").on("click", function(event){
      event.preventDefault();

      //take values from form inputs
      var trainName = $("#trainName").val();
      var destination = $("#destination").val();
      var firstTrainTime = $("#firstTrainTime").val();
      var frequency = $("#frequency").val();

      console. log(trainName, destination, firstTrainTime, frequency);

        //empty the form values
      $("#trainName").val("");
      $("#destination").val("");
      $("#firstTrainTime").val("");
      $("#frequency").val("");

      //create a new train object
      var addNewTrain = {
          name: trainName,
          destination: destination,
          firstTrainTime: firstTrainTime,
          frequency: frequency
      }

      //add the new train object to the database
      database.ref().push(addNewTrain);

      //When a new train is added, display it on the table with name, destination, nextETA, 
      database.ref().on("child_added", function(childSnapshot){
          console.log(childSnapshot.val());

          //Take values from database
          var trainName = childSnapshot.val().name;
          var destination = childSnapshot.val().destination;
          var firstTrainTime = childSnapshot.val().firstTrainTime;
          var tfrequency = childSnapshot.val().frequency;

          //to calculate when the next train is expected
          var currentTime = moment();
          var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm");
          
          var difference = moment().diff(firstTrainTimeConverted, "HH:mm"); 
          var remainder = difference % tfrequency;
          var minutesTillArrival=frequency-remainder;
          var nextETA = moment(currentTime+remainder).format("HH:mm");
          console.log(nextETA);
        
          //create and append html elements to hold the train info pulled from db
          var tr=$("<tr>")
          
          var tdName=$("<td>").text(trainName);
          var tdDestination=$("<td>").text(destination);
          var tdFrequency=$("<td>").text(tfrequency);
          var tdNextArrival=$("<td>").text(nextETA);
          var tdMinAway=$("<td>").text(minutesTillArrival);

          tr.append(tdName, tdDestination, tdFrequency, tdNextArrival, tdMinAway);

          $("#train-details").append(tr);
      })


  })
});