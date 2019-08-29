App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init:function() {

    return App.initWeb3();
  },

  initWeb3: function() {
    
    if(typeof web3 !== "undefined"){
      //If a web3 instance is already provided by Meta mask
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }else{
      //Specify default instance if no web3 instance profive
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Contest.json", function(contest){
      //Instantiate a new truffle contracts from  the artifact
      App.contracts.Contest = TruffleContract(contest);
      // Connect provider to interact with the contract
      App.contracts.Contest.setProvider(App.web3Provider);
    
    
    return App.render();
  });
  },

  listenForEvents: function() {
    App.contracts.Contest.deployed().then(function (instance) {
        instance.votedEvent({}, {
            fromBlock: 0,
            toBlock: 'latest'
        }).watch(function (error, event) {
            console.log("event triggered", event) 
            // Reload when a new vote is recorded
            App.render();
        });
    });
  },


  
  render: function() {
      var contestInstance;
      var loader = $("#loader");
      var content = $("#content");

      loader.show();
      content.hide();
      // Load account data 
      web3.eth.getCoinbase(function (err, account) {
          if (err === null) {
              App.account = account;
              $("#accountAddress").html("Your Account: " + account);
          }
      });
      // Load contract data 
      App.contracts.Contest.deployed().then(function (instance) {
          contestInstance = instance;
          return contestInstance.contestantsCount();
      }).then(function (contestantsCount) {
          var contestantsResults = $("#contestantsResults"); 
          contestantsResults.empty();

          var contestantsSelect = $("#contestantsSelect"); 
          contestantsSelect.empty();

          for (var i = 1; i <= contestantsCount; i++) {
            contestInstance.contestants(i).then(function(contestant){

              var id = contestant[0];
              var name = contestant[1];
              var voteCount = contestant[2];

              //Render contestant Result
              var contestantTemplate = "<tr><th>"+ id +"</th><td>"+ name+"</td><td>"+ voteCount + "</td></tr>";
              contestantsResults.append(contestantTemplate);
            
              //Render candidate voting option
              var contestantOption = "<option value ='" + id +"'>" + name + "</option>";
              contestantsSelect.append(contestantOption);
            });
          } 
          loader.hide();
          content.show();
      }).catch(function(error){
        console.warn(error);
      });
  },

  castVote: function() {
      var contestantId = $('#contestantsSelect').val(); 
      App.contracts.Contest.deployed().then(function (instance) {
          return instance.vote(contestantId, { from: App.account });
      }).then(function (result) {
          // Wait for votes to update 
          $("#content").hide();
          $("#loader").show();
      }).catch(function (err) {
          console.error(err);
      });
  }


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

var img1 = "./images/tuong.jpg";
var img2 = "https://i.makeagif.com/media/7-22-2018/h52BhP.gif";
var img3 = "./images/thor1.jpg";

$('#contestantsSelect').change(function () {
  var value = $('option:selected', this).attr('value');

  if (value == "1") {
    document.getElementById('img-responsive').src = img1;
  }
  if (value == "2") {
    document.getElementById('img-responsive').src = img2;
  }
  if (value == "3") {
    document.getElementById('img-responsive').src = img3;
  }
});