# WWIKT — Who Will I Know There?

A simple project to help you find friends when you're moving somewhere totally new. Going off to college? Need a support network? Log in with your Facebook to find friends (and friends of friends) near your new home.

Moving somewhere new is scary, especially if you don't think that you'll know anyone there.
Yes, you could actually *talk* to your friends to see if they know anyone you would want to meet, but really, people, it's 2012.
This simple tool can help to put you in contact with people you might want to be friends with directly, ignoring the middle-man.

# Why does this exist?

1. I want to learn how to build things with Node.js, Coffeescript, and maybe Websockets.
2. I am moving to San Francisco in June and I have maybe one friend in the Bay Area (shoutout to my cousin Anna!).

# Progress

I'm going to try to make this entire app in like 12 hours. I'm going to keep track of the progress I make because it will be interesting to see if I can do it. I've never done anything with Node, Coffeescript, OR Websockets before. Let's see how quickly I can pick it up!

**5/2 14:43** Just installed Node and NPM through the DMG from nodejs.org.

**5/2 14:50** Changed the progress log formatting, added a gitignore. I've decided to check in every half hour or so and write a little overview of what I've done. My commit messages should serve as a finer-grained log.

**5/2 15:03** Just got a dotcloud instance running with a super basic "Hello World" app. I still don't really know anything about node but I get the basic callback structure (I think. Probably not.)

**5/2 15:57** Wow, NPM sort of blows. Dependency hell just an hour into the project. I'd think it's my fault but search.npmjs.org is down and I can't install anything. Also, devDependencies weren't being installed, and I wasn't sure why. I `npm config set dev true` and tried it again, but the server (which had been up) went down sometime before that. So, I have no dependencies, nor can I install them. I really wanted to get started with express.js, but I can't :(

**5/2 16:11** It's not just me, [NPM is down](https://github.com/isaacs/npm/issues/2409). Good to see that I'm not just *really* bad at node.js. It really stinks that this happened right as I started trying to do a code sprint. I'll try again tomorrow.

**5/2 17:34** Finally got express installed. I took a long break and then came back after the NPM people fixed the server.

**5/2 18:51** Took a long break for dinner. Decided to put up the express demo app on dotcloud and get it all working and then seriously work on this tomorrow. Should be fun! I'm excited about building something cool again. This is definitely different than Python, which I'm pretty comfortable with, but I like this. Some of the Jade templating syntax still seems strange to me. I'm also still not onfident I understand what's going on with all of the `app.use()` code.

**5/2 19:03** Got everything working on dotcloud. Tomorrow I'll try to actually build an app. I feel a little bit like I'm writing Python with different syntax right now — hopefully that changes tomorrow! I think I'm just going to use Bootstrap for the layout and make it super, super simple. Might actually rip the design I have on sexpert right now and shove it up. That's a pretty essential search layout.

**5/3 18:36** Well, I didn't really keep a very good log of my progress. But, as of right now I have facebook login working and everything's set up to make the OpenGraph searches. Now I've got to do some place parsing and cool things like that. Woo hoo!

**5/3 20:07** So, sweet, I've got the facebook login actually working and everything. Very cool. But I'm losing steam on finishing the rest of the app tonight, I'm kind of tired and a little bit sick. So maybe I'll do the location matching tomorrow? Or some other day.

TODO: do location finding and similarity matching. I can use graph.facebook.com/id to get basic info, which will include hometown/location when available. That's a city, state / city, country thing. But those not might exist. So I think a good way to do it would be to check for location/hometown *first*, then use graph.facebook.com/id/locations second.

Also, I can do friends of friends, but only if my friends use the app, too. I can add an invite? Send out a "Hey, I'm moving to xxx, and I want to see if I know anyone there."

**5/4 02:10** Couldn't sleep, so I kept hacking. Hooray! Things don't work. Boo! Mostly everything does. Actually, it's pretty cool, it acts as a _super basic_ location search for your friends.
