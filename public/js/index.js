console.log("logged in.");
console.log(access_token);
console.log(place);
console.log(appId);

$(document).ready(function(){
  $('#place').val(place); // update searched value
  
    
  // Helper functions
  var makeState = function(abbrev){
    var states = {'AK': 'Alaska', 'AL' : 'Alabama', 'AR' : 'Arkansas', 'AZ' : 'Arizona', 'CA' : 'California', 'CO' : 'Colorado', 'CT' : 'Connecticut', 'DE' : 'Delaware', 'DC' : 'District of Columbia', 'FL' : 'Florida', 'GA' : 'Georgia', 'HI' : 'Hawaii', 'IA' : 'Iowa', 'ID' : 'Idaho', 'IL' : 'Illinois', 'IN' : 'Indiana', 'KS' : 'Kansas', 'KY' : 'Kentucky', 'LA' : 'Louisiana', 'MA' : 'Massachusetts', 'MD' : 'Maryland', 'ME' : 'Maine', 'MI' : 'Michigan', 'MN' : 'Minnesota', 'MS' : 'Mississippi', 'MO' : 'Missouri', 'MT' : 'Montana', 'NC' : 'North Carolina', 'ND' : 'North Dakota', 'NE' : 'Nebraska', 'NH' : 'New Hampshire', 'NJ' : 'New Jersey', 'NM' : 'New Mexico', 'NV' : 'Nevada', 'NY' : 'New York', 'OH' : 'Ohio', 'OK' : 'Oklahoma', 'OR' : 'Oregon', 'PA' : 'Pennsylvania', 'RI' : 'Rhode Island', 'SC' : 'South Carolina', 'SD' : 'South Dakota', 'TN' : 'Tennessee', 'TX' : 'Texas', 'UT' : 'Utah', 'VA' : 'Virginia', 'VT' : 'Vermont', 'WA' : 'Washington', 'WI' : 'Wisconsin', 'WV' : 'West Virginia', 'WY' : 'Wyoming'};
    var clean = $.trim(abbrev);
    return clean in states ? states[clean] : abbrev;
  }

  var isSubstring = function(a, b){
    console.log("Checking to see if '%s' is a substring of '%s'", b, a);
    return (a.toLowerCase().indexOf(b.toLowerCase()) !== -1);
  }

  var isNearby = function(place, test){
    var cleaned_place = _.map(place.split(','), $.trim);
    console.log(cleaned_place);
    var pcity = cleaned_place[0];
    var pstate = makeState(cleaned_place[1]);

    var cleaned_test = _.map(test.split(','), $.trim);
    console.log(cleaned_test);
    var tcity = cleaned_test[0];
    var tstate = makeState(cleaned_test[1]);

    console.log("Place = '%s'", place);
    console.log("City = '%s', State = '%s'", tcity || "", tstate || "");

    if(!tstate){
      return isSubstring(place, tcity);
    }
    if(isSubstring(pcity, tcity)){
      if(pstate){
        return isSubstring(pstate, tstate);
      }
      return true;
    }
    return false;
  }


  var makePerson = function(friend){
    var id = friend.username || friend.id;
    var res = '<li>' +
                '<a href="https://facebook.com/'+id+'">' +
                  '<div class="person">' +
                    '<img src="https://graph.facebook.com/'+id+'/picture?type=normal"/>' +
                    '<h3>' + friend.name + '</h3>' +
                  '</div>' +
                '</a>' +
              '</li>';
    return res;
  }
  
  var FB = function(path, cb){
    $.getJSON('/fb/'+path, cb);
  }
  var addPersonTo = function(target, info){
    $(target).append(makePerson(info));
  }

  // Perform the search
  FB('/me', function(data){
    var me = data;
    FB('/me/friends', function(data){
      var friends = data.data;
      $('.loading').append("<br><p>Searching your "+friends.length+" friends...");
      console.log("Looking through "+friends.length+" friends");
      
      var people = $('ul#people');
      _.each(friends, function(friend, i, l){
        var id = friend.id;
        var name = friend.name;
        FB('/'+id, function(friend_info){
          var nearby = false;
          if(friend_info.hometown && friend_info.hometown.name &&
             isNearby(friend_info.hometown.name, place)){
            nearby = true;
          }
          else if(friend_info.location && friend_info.location.name &&
                  isNearby(friend_info.location.name, place)){
            nearby = true;
          }
          if(nearby){
            addPersonTo('ul#lived', friend_info);
          }
          else{
            console.log("Trying to grab %s's location info", friend_info.name);
            FB('/'+id+'/locations', function(loc_info){
              loc_info.data.some(function(_event){
                friend_info.from = _event.from;
                var event_loc = _event.place;
                if (!event_loc){
                  console.log("No location info for %s", friend_info.name);
                  return false;
                }
                var state = makeState(event_loc.location.state);
                var loc_string = [event_loc.name, event_loc.location.city, state, event_loc.location.country].join(' ');
                loc_string = String(loc_string);
                if(isNearby(loc_string, place)){
                  console.log('%s is nearby %s!', place, loc_string);
                  addPersonTo('ul#been', friend_info);
                  return true;
                }
              });
            });
          }
        });
      });
    });
  });
});
