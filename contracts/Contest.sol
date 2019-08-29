pragma solidity ^0.4.24;

/**
 * The Contest contract does this and that...
 */
contract Contest {
	// creating structure to model the contestant
	struct Contestant {
		
		uint id;
		string name;
		uint voteCount;
		
	}
	//use mapping to get or fetch the contestant details
	mapping(uint => Contestant) public contestants;

	//to save the list of users/account who already casted vote
	mapping(address => bool) public voters;

	//add a public state variable to keep track of contestant Count
	uint public contestantsCount;

	event votedEvent(
		uint indexed _contestantId
	);
	
	function Contest ()  public{
		addContestant("Nguyen Huu Tuong");
		addContestant("Nguyen Huu Thien");
		addContestant("Nguyen Văng Minh Toi");
	}

	function addContestant(string _name) private {
		contestantsCount++;
		contestants[contestantsCount] = Contestant(contestantsCount, _name,0);
	}
	function vote(uint _contestantId) public {
		//restricting the persion  who already casted the vote
		require(!voters[msg.sender]);

		//require that the vote is casted to a valid contestant
		require (_contestantId > 0  && _contestantId <= contestantsCount);

		// increase the contestant vote count
		contestants[_contestantId].voteCount++;

		// set the voter's status to true
		voters[msg.sender] = true;	

		//trigger the vote event
		votedEvent(_contestantId);
	}
}
