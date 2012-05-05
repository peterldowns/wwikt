console.log("logged in.");
console.log(access_token);
console.log(place);
console.log(appId);

$(document).ready(function(){
  $('#place').val(place); // update searched value
  
    
  // Helper functions
  
  var isNearby = function(a, b){
    console.log("Checking to see if '%s' is a substring of '%s'", b, a);
    return (a.toLowerCase().indexOf(b.toLowerCase()) !== -1);
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
      $('.loading').append("<p>Searching your "+friends.length+" friends...");
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
            addPersonTo('ul#people', friend_info);
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
                var loc_string = [event_loc.name, event_loc.location.city, event_loc.location.state, event_loc.location.country].join(', ');
                loc_string = String(loc_string);
                if(isNearby(loc_string, place)){
                  console.log('%s is nearby %s!', place, loc_string);
                  addPersonTo('ul#people', friend_info);
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