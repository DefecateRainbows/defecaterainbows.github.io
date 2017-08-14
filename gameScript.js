//'use strict';//This enforces stricter syntax, throwing more errors more often at even the tiniest mistake or infraction of good practice. Great for testing stuff!

//Start of function dictionary
function setPixel(x, y, ctx) {
	ctx.fillRect(x - 0.5, y - 0.5, 1, 1 );	
}

function roundToMaxOrMin(value, max, min){
  if(value > max)return max;
  else if(value < min)return min;
  else return value;  
}

//Thanks disfated! :D
String.prototype.capitalize = function(lower) {
  return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function distanceFrom(firstX, firstY, secondX, secondY){
  var leftOrRight = (firstX<secondX)? 'left' : 'right';
  var upOrDown = (firstY<secondY)? 'up' : 'down';
  var pixelDistanceX = secondX - firstX;
  var pixelDistanceY = secondY - firstY;

  return "Your click is " + pixelDistanceX + ' pixels(' + leftOrRight + '), and ' + pixelDistanceY + ' pixels(' + upOrDown + ') from the the top-left corner of the torso image.'
}

function coordsToIsometric(x, y){
  return [x+y, y - x/2];
}

/*
function coordsToIsometric(x, y, z){
  return [x - z/Math.sqrt(2), (x+2*y+z)/Math.sqrt(6)]
}
*/

function plotLine(xStart, yStart, xEnd, yEnd, color, ctx){ //The start variables are where the lines start, the end variables are where the lines end. ctx is the canvas it's drawn on.
  var dx =  Math.abs(xEnd-xStart); //Delta X? I think it's the left-right distance between where the line starts and where the line is goin'. Is always positive, because lines are only drawn from left to right.
  var sx = xStart<xEnd ? 1 : -1;   //If the line goes left front the start point, the variable is -1, while if the line goes right from the starting point, the variable is poisitve one.
  var dy = -Math.abs(yEnd-yStart); //Delta Y? I think it's the up-down distance between where the line starts and where the line is goin'. Is always negative, because lines are only drawn from top to bottom.
  var sy = yStart<yEnd ? 1 : -1;   //If the starting point is below the ending point, this value is -1. If the starting point is above the ending point, the value is 1.
  
  var err = dx+dy;                 //How far it has to go on the x, and the y combined.
  var e2;                          //Right now we are just going to say that this this variable exists, and not give it a value. That I completely understand, it's the value in the loop that confuses me.
  
  ctx.fillStyle = color;
  
  while (true){                                  //This will loop!

    setPixel(xStart,yStart, ctx);                //And draw pixels!

    if (xStart == xEnd && yStart == yEnd) break; //Until we've reached the end of the line.



    e2 = 2*err;                                  //This assigns a variable, e2, to double the sum of the distance to go on both axis. This variable is assigned inside the loop, instead of outside because it needs to change too, if err is changed.

    if (e2 >= dy) {                              //If double the sum of the distance to go on both axis is more than or equal to the distance to go on the y axis...
      err += dy;                                 //Add the distance that we have to go on the y axis to double the sum of the distance to go on both axis. Why?
      xStart += sx;                              //Increase xStart by 1 if xEnd is to the right of xStart, or by -1 if it's to the left. TL;DR: make it closer by one pixel.
    }

    if (e2 <= dx) {                              //If double the sum of the distance to go on both axis is less than or equal to the distance to go on the x axis...                         
      err += dx;                                 //Add the distance that we have to go on the x axis to double the sum of the distance to go on both axis. Why?
      yStart += sy;                              //Increase xStart by 1 if xEnd is to the right of xStart, or by -1 if it's to the left. TL;DR: make it closer by one pixel.
    }

  }
}
//The comments display what I do understand. What I don't understand is the err and e2 situation, specifically why err is doubled, and what e2 and err represent(mathmatically?). 
//I'm also completly baffled as to why the if statements compare e2 to delta y and x, but I partially understand why they reassign e2 to err*2 each time in the loop, because they increase err and want e2 to represent err*2 even when err changes.
//I think Delta X & DeltaY (dx and dy) are the distance between the start and finish, but I'm not completely sure about that.
//Why they increase x if dy is more than e2 and vice versa is a bit confusing, on top of everything else.
//I understand that that the code works, because it does, I'm just not entirely sure how/why it does.
//If I don't understand something mathmatically(or in any other area), I can just research it until I do, but I'm not sure what I'm missing here.

//startCoords and endCoords are an array of x then y.
function getCoordsOnWayTo(startCoords, endCoords){
  //setup of constants:

  var xStart = startCoords[0];
  var yStart = startCoords[1];
  var xEnd = endCoords[0];
  var yEnd = endCoords[1];

  var dx =  Math.abs(xEnd-xStart);
  var sx = xStart<xEnd ? 1 : -1;
  var dy = -Math.abs(yEnd-yStart);
  var sy = yStart<yEnd ? 1 : -1;

  var err = dx+dy;
  var e2;

  //Done with setup of constants

  if(!(Math.floor(xStart) == xEnd && Math.floor(yStart) == yEnd)){
    e2 = 2*err;

    if (e2 >= dy){
      err += dy;
      xStart += sx;
    }

    if (e2 <= dx){
      err += dx;
      yStart += sy;
    }

    return [Math.floor(xStart), Math.floor(yStart)];
  }
  
  else return 'Coords Same';
}

function chooseFrom(anArray){ //This function chooses something from an array.
  return anArray[Math.floor(Math.random() * anArray.length)];
}
//This function grabs the mouse position!
function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}
//Function to check whether a point is inside a rectangle!
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y;
}

function stringToRGBArray(stringOfRGB){
  return stringOfRGB.replace(/[^\d,]/g, '').split(',');
}

//Pretend an array is a circle: If you call for the element of the array that is one beyond the end of the array, you get the the first element, and vice versa.
function circularArray(array, direction, currentIndex){
  currentIndex = currentIndex + direction;
  if(currentIndex < 0)currentIndex = array.length - 1;
  else if(currentIndex > array.length-1)currentIndex = 0;
  
  return currentIndex;
}
//End of function dictionary


//Image dictionary

var woodenPlank = new Image();
woodenPlank.src = 'imgs/fillerPixelArt/WoodenPlank.gif';

var stoneTile = new Image();
stoneTile.src = 'imgs/fillerPixelArt/StoneTile.gif';


//Plank Images
var plankOddsAndEnds = new Image();
plankOddsAndEnds.src = 'imgs/fillerPixelArt/PlankOddsAndEnds.gif';

var plankStart = new Image();
plankStart.src = 'imgs/fillerPixelArt/PlankStart.gif';

var plankEnd = new Image();
plankEnd.src = 'imgs/fillerPixelArt/PlankEnd.gif';

var plankMiddle = new Image();
plankMiddle.src = 'imgs/fillerPixelArt/PlankMiddle.gif';
//End of Plank Images

/*
//Jacob's Bow images
var bowTop = new Image();
bowTop.src = 'http://piskel-imgstore-b.appspot.com/img/3d2e8480-fec1-11e6-86b8-6d27f02baa93.gif';

var bowBottom = new Image();
bowBottom.src = 'http://piskel-imgstore-b.appspot.com/img/e0a7aa21-fec0-11e6-80e8-6d27f02baa93.gif';

var bowMiddle = new Image();
bowMiddle.src = 'http://piskel-imgstore-b.appspot.com/img/77c948ae-fec0-11e6-8c5e-6d27f02baa93.gif';
//End of Jacob's Bow images
*/

//End of image dictionary

/*
http://piskel-imgstore-b.appspot.com/img/a443234c-01cd-11e7-8b3b-c714d3e93f2a.gif
http://piskel-imgstore-b.appspot.com/img/256a5059-01ce-11e7-8da3-c714d3e93f2a.gif


http://piskel-imgstore-b.appspot.com/img/2d30ac66-01d0-11e7-9eed-c714d3e93f2a.gif


http://piskel-imgstore-b.appspot.com/img/7be9b16b-01ce-11e7-a65e-c714d3e93f2a.gif
http://piskel-imgstore-b.appspot.com/img/85bd4557-01d0-11e7-acaa-c714d3e93f2a.gif



*/











//START OF GAME ENGINE CODE(Walking, attacking, inventory, stuff like that.) ----------------------------------------------

//Variables for game engine
var worldMap;
var playerCharacter;

var onkeyup;
var onkeydown;

var keyMap = {};
//End of variables for game engine.

//Assisting functions for game engine! :D

//DO NOT USE BEFORE IMAGES ARE DONE LOADING: Thanks Braden Best & Stack Overflow!

function raceFromGroup(group){
  var val = Math.floor(Math.random() * 100) + 1;//This code generates a random number, 1-100 inclusive.
  var subRace = "";//This assigns the subRace variable to an empty string, so we can use it later.
  var raisedBy;
  
  group = group.capitalize(true);
  
  switch(group){
    case 'Inclus':
      return 'Inclus';

    case 'Kewer'://Agrakin is open to immigrants, and so the Humans and Impkin came.
      if (val < 90) {subRace = 'Kewer'}
      else if (val < 95) {subRace = 'Human'}
      else {subRace = 'Impkin'}
      
      if(subRace = 'Impkin')return [subRace, raisedBy];
      else return subRace;

    case 'Empyrean Guild'://All Empyreans are
      return 'Human';//human, as only humans are dumb enough to want to live on islands that float in the sky.

    case 'Hell Dweller'://However, there are many different races for Hell Dwellers, so their code is quite a bit more complicated.
      //However, when broken into parts, it's actually quite simple.

      //Remember those subrace and var variables we set up later? If not, check back and remember what they are, they are used a lot in the following code

      //THIS CODE PICKS THE RACE
      if(val <= 30) { subRace = "Uhk"; if (val > 29) { subRace = "Hell Hound";} }//This says if val is less than 30, then call the code inbetween the brackets. The code inbetween the brackets says if val is above 29, so then if it was 30, then your Ugh is a Hell Hound
      else if(val <= 50) { subRace = "Fiend"; if (val > 49) { subRace = "Blue Fiend";}}//This code is very similiar to the Uhk code; Only instead of having 30% of the population be Uhks, only 20% of the population is Fiend, so since all of the numbers below 30 have already been filtered out, we'll say all of the numbers below 50(and above 30) are Fiends. One percent of the total population(the number 50) would be Blue Fiendish.
      else if (val <= 65) { subRace = "Hell Gnome";}//15 percent of the population are Hell Gnomes, so 50 + 15 = 65.
      else if(val <= 80) { subRace = "Impkin";}//15 percent Impkin, 65 + 15 = 80
      else if(val <= 95) { subRace = 'Succubi';}//15% are Cubi, so 80 + 15 = 95
      else if (val <= 100) { subRace = "Human";}//5% are human, so 95+ 5 = 100. There we go, we now have code that generates a random hell dweller race.
      //END OF RACE PICKING CODE

      //var answer = subRace;
      if(subRace = 'Impkin')return [subRace, raisedBy];
      else return subRace;

    default:
      return "Error!";
  }
}

function nameFromRace(race, raisedBy){
  var firstPart = [];
  var lastPart  = [];
  var blacklist = [];
  var completeName = '';
  
  race = race.capitalize(true);

  var whichName = Math.floor(Math.random() * 20 + 1);

  switch(race){
    case 'Kewer'://Favors ending words in consonants g and z, uses a and o as most common vowel.
      firstPart = ['Swogg', 'Tragg', 'Raz', 'Ag'];
      lastPart  = ['lah', 'ack', 'ak', 'rakin'];

      return chooseFrom(firstPart) + chooseFrom(lastPart);

    case 'Human'://These should sound like english names, within reason. etaoin shrdlu are most common letters in english.
      firstPart = ["Jak", "Jac", "Jam", "Ger", 'Anth', "Robb", "Gid", "Der", "Sal"];
      lastPart  = ['e', "ard", "ean", 'ony', "ick", "es", "us", "ob"];
      var firstName = chooseFrom(firstPart) + chooseFrom(lastPart);
      var lastName  = chooseFrom(firstPart) + chooseFrom(lastPart);
      completeName = firstName + ' ' + lastName;
      blacklist = ['Sales', 'Sale', 'Robbob'];//These names will be blocked.
      
      //The following line works because indexOf returns 0 if the item isn't in the list.
      if (blacklist.indexOf(firstName) === -1 && blacklist.indexOf(lastName) === -1) {
        return completeName;
      }
      else {
        //If this happened, then the name was blacklisted. So...
        return nameFromRace('Human');
      }
      break;


    case 'Inclus'://Soft consonants only
      firstPart =   chooseFrom(["Yil", "Lis", "Yeow", "Shis", "Swill"]);
      middlePart  = chooseFrom(["ill", "ol", "ee", 'o', '', "'"]);//Empty ones so that there could be no middle part
      lastPart =    chooseFrom(["o", 'ye', 'oah', 'oso', '']);//Empty so that there could be no last part

      if (middlePart === "'")lastPart = lastPart.charAt(0).toUpperCase();
      if (middlePart === "'" && lastPart === '')middlePart = '';
      return firstPart + middlePart + lastPart;

    case 'Succubi':
      firstPart = ['Succ', 'Beaut', 'Lust', 'Nub', 'Volup', 'Curv', 'Bux', 'Scand'];
      middlePart = 'ul'
      lastPart  = ['ent', 'ence', 'issa', 'ica', 'tuous'];

      return chooseFrom(firstPart) + middlePart + chooseFrom(lastPart);


    case "Hell Gnome":
      firstPart = ['Oct', 'Jul', 'Sept', 'Null', 'Mor', "Unit", "Bin", 'Tern', "Quad", 'Noven', 'Den', 'Cent', 'Millen'];
      lastPart  = ['avius', 'ulius', 'ius', 'ullus', 'pheus', 'ero', 'ace', 'etus', 'onius'];

      return chooseFrom(firstPart) + chooseFrom(lastPart);

    case 'Fiend': //Guttural noises
      firstPart = ["Teshk", "Ficksh", "Thekt", "Ught", "Deght", "Kicksh", 'Flektsh', 'Flesht', 'Vegth'];
      lastPart  = ["ekt", "igth", "egst", "erkt", "'Jiktheh", 'akth', 'othked', ''];

      return chooseFrom(firstPart) + chooseFrom(lastPart);


    case 'Blue Fiend': //More unconventional Fiend names
      firstPart = ["Zhaan", "Racksh", "Delv", "Ugh", "Neagh"];
      lastPart  = ["ian", "sikt", "blasht", "frahk", "atik", "'Jaktan"];

      return chooseFrom(firstPart) + chooseFrom(lastPart);

    case 'Uhk':

      if (whichName === 1)//Easter egg pet names
      {
        return chooseFrom(["Mr. Mittens", "Pokey", "Crack-Head", "Sparky", "Guido", "Buckwheat", "Rug", "Fluffy", "Spanky", "Napoleon", "Bonaparte", "Rygel"]);
      }

      else
      { //Traditional Uhk names will depend upon eh and similiar vowels, along with soft consonants
        firstPart = ["Meh", 'Yeh', 'Seh', 'Reh', 'Weh', 'Bleh', 'Phle'];
        lastPart  = ["m", 's', 'r', 'weh', 'gm'];//Option to have no last part

        return chooseFrom(firstPart) + chooseFrom(lastPart);
      }
      break;

    case 'Hell Hound':
      return chooseFrom(["Mr. Mittens", "Pokey", "Crack-Head", "Sparky", "Guido", "Buckwheat", "Rugrat", "Fluffy", "Spanky", "Napoleon", "Bonaparte", "Arty"]);

    case 'Impkin':
      return nameFromRace(raisedBy);
      
    default:
      return "Unkown Race";
  }

}

function modifiersForPart(part, race, group, profession, mortalName, gender){
  var secondaryClass;
  
  var pronouns;
  if(gender === 'male')pronouns = ['he', 'his', 'him'];
  else if (gender === 'female')pronouns = ['she', 'her', 'her'];
  else pronouns = ['they', 'them', 'their']
  
  switch(part){
    case 'face':
      switch(profession){
        case 'mage':
          var nameArray = ['wise', 'friendly'];
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'wise':
              var story = "Something in the shape of " + mortalName[0] + "'s brow suggests that " + pronouns[0] + " is knowledgable in many subjects.";
              var bonusToStats = {academicCharisma:5, wisdom:3}
              break;
              
            case 'friendly':
              var story = "Something in " + mortalName[0] + "'s eyes suggests that " + pronouns[0] + " is someone you can trust.";
              var bonusToStats = {generalCharisma:3}
              break;
          }
          
          return [name, bonusToStats, story, secondaryClass];
          
          
        case 'rogue':
          var nameArray = ['mischievous', 'charming'];
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'mischievous':
              var story = "Something in the way that the edges of " + mortalName[0] + "'s mouth crease suggest that " + pronouns[0] + "'s up to no good.";
              var bonusToStats = {criminalCharisma:4, sneaking:2, stealing:2}
              break;
              
            case 'charming':
              var story = "Something in the shape of " + mortalName[0] + "'s cheekbones draws the eye, and suggests that " + pronouns[1] + " words conceal another meaning.";
              var bonusToStats = {generalCharisma:2, criminalCharisma:3}
              break;
          }
          
          return [name, bonusToStats, story, secondaryClass];
          
        
        case 'warrior':
          var nameArray = ['simple', 'charismatic'];
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'simple':
              var story = "Something in the way that " + mortalName[0] + "'s wide forhead is shaped suggests that " + pronouns[0] + " possesses unparalleled stupidity.";
              var bonusToStats = {wisdom:-5, strength:3}
              break;
              
            case 'charismatic':
              var story = "Something in the way that " + mortalName[0] + "'s features are put together makes him quite pleasant to be around.";
              var bonusToStats = {generalCharisma:1, militaryCharisma:3}
              break;
          }
          
          return [name, bonusToStats, story, secondaryClass];
      }
      break;
      
    case 'limbs':
      switch(profession){
          
        case 'mage':
          var nameArray = ['weak', 'weak', 'weak', 'weak', 'nimble'];
          for(var i = 0; i < 12; i++)nameArray.push('long');
          var name = chooseFrom(nameArray);
          
          switch(name){
              
            case 'long':
              var story = mortalName[0] + '\'s long limbs allow ' + pronouns[2] + ' to pry books off of distant shelves, and they often do so.';
              var bonusToStats = {wisdom:3};
              break;
              
            case 'weak':
              var story = mortalName[0] + "'s weak limbs weren't much good at physical labor or playing outside, so " + mortalName[0] + " read books and practiced channeling magic.";
              var bonusToStats = {wisdom:5, magic:5, strength:-4};
              break;
              
            case 'nimble':
              var story = mortalName[0] + " once used " + pronouns[1] + " nimble appendages to steal a few magical tomes from the forbidden section of the library. What " + pronouns[0] + " read in that tome changed him forever.";
              var bonusToStats = {magic:5, sneaking:3, stealing:2};
              var secondaryClass = 'rogue';
              break;
          }
          return [name, bonusToStats, story, secondaryClass];
          
        case 'rogue':
          var nameArray = ['nimble', 'disfigured', 'disfigured', 'disfigured', 'disfigured'];
          for(var i = 0; i < 12; i++)nameArray.push('long');
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'long':
              var story = mortalName[0] + " discovered early on in " + pronouns[1] + " life that " + pronouns[1] + " long limbs are quite useful for reaching into the pockets of the unwary.";
              var bonusToStats = {stealing:3};
              break;
              
            case 'nimble':
              var story = mortalName[0] + " once used " + pronouns[1] + " nimble appendages to steal a few magical tomes from the forbidden section of the library. Soon afterwards, " + pronouns[0] + " cast " + pronouns[1] + " first spell.";
              var bonusToStats = {magic:5, sneaking:3, stealing:2};
              var secondaryClass = 'mage'
              break;
              
            case 'disfigured':
              var story = mortalName[0] + "'s disfigured limbs were often the subject of ridicule by other children."
                +" That is, until " + mortalName[0] + " stole a knife from an unwary shopkeeper, and proceeded to break into the home of the tortorous childrens' leader. Once there, " + pronouns[0] + " waited until " + pronouns[1] + " tormenter fell asleep, and proceeded to sever one of his toes."
                +" The next day, when the bully began to tease " + mortalName[0] + " yet again, " + pronouns[0] + " returned the toe to it's open-mouthed owner, who never again spoke to " + mortalName[0] + ".";
              var bonusToStats = {sneaking:5, stealing:2};
              break;
          }
          return [name, bonusToStats, story, secondaryClass];
          
        case 'warrior':
          var nameArray = ['strong', 'long', 'quick'];
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'long':
              var story = mortalName[0] + " often uses the extra reach provided to " + pronouns[2] + " by " + pronouns[1] + " long limbs in battle, and doing so allows " + pronouns[2] + " to better attack unprotected areas.";
              var bonusToStats = {criticalChance:3, fighting:5};
              break;

            case 'strong':
              var story = "Years spent toiling away at physically intensive tasks have strengthened " + mortalName[0] + "'s limbs. " + pronouns[0].capitalize() + " often uses these strong limbs to bash in the heads of those " + pronouns[0] + " isn't quite fond of.";
              var bonusToStats = {strength:4};
              break;
              
            case 'quick':
              var story = mortalName[0] + " spent most of " + pronouns[1] + " childhood running errands for local merchants. These merchants often payed " + mortalName[0] + " extra if " + pronouns[0] + " could do a job quickly. This practice has made " + mortalName[0] + "'s limbs quick and nimble.";
              var bonusToStats = {dexterity:4, speed:4};
              break;
          }
          return [name, bonusToStats, story, secondaryClass];
      }
      break;
    
    case 'torso':
      switch(profession){
        case 'mage':
          var nameArray = ['maimed'];
          for(var i = 0; i < 12; i++)nameArray.push('pale');
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'maimed':
              var story = "One murky night, " + mortalName[0] + " was traveling alone in the wilderness. " + pronouns[0].capitalize() + " bore a torch in one hand, and held a channeling tome of travel in the other. " + pronouns[0].capitalize() + " heard something stir in a nearby patch of foilage, and, in a fright, " + pronouns[0] + " channeled " + pronouns[1] + " magic into the tome. Fortunately, the tome brought " + pronouns[2] + " home, but channeling all of " + pronouns[1] + " magic at once had scarred " + pronouns[1] + " torso with deep red welts.";
              var bonusToStats = {generalCharisma:-2, wisdom:3};
              break;
            
            case 'pale':
              var story = "A life spent inside reading books has left " + mortalName[0] + " with remarkably pale skin.";
              var bonusToStats = {wisdom:5};
              break;
          }
          return [name, bonusToStats, story, secondaryClass];
          
        case 'rogue':
          var nameArray = ['scarred', 'tattoed'];
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'scarred':
              var story = mortalName[0] + " was once in the process of robbing the local baker's cellar, when the baker caught " + pronouns[2] + " in the act. As punishment for this crime, " + mortalName[0] + " was flogged almost to the point of death, and to this day " + pronouns[0] + " bears long red scars across his back and torso. The next time someone stumbled across " + mortalName[0] + " as " + pronouns[0] + " was stealing something, " + mortalName[0] + " killed them.";
              var bonusToStats = {criminalCharisma:2, stealing:3, sneaking:3};
              break;
            
            case 'tattoed':
              var story = "Dark, swirling tattoos cover " + mortalName[0] + "'s chest, marking him as a rogue.";
              var bonusToStats = {generalCharisma:-3, criminalCharisma:6}
              break;
          }
          return [name, bonusToStats, story, secondaryClass];
          
        case 'warrior':
          var nameArray = ['scarred', 'muscled'];
          var name = chooseFrom(nameArray);
          
          switch(name){
            case 'scarred':
              var story = "Plenty of fighting practice has left behind jagged scars that cover " + mortalName[0] + "'s torso.";
              var bonusToStats = {fighting:7, militaryCharisma:2};
              break;
            
            case 'muscled':
              var story = "Intensive physical labor has left " + mortalName[0] + " with firm muscles all across " + pronouns[1] + " torso.";
              var bonusToStats = {strength:5};
              break;
          }
          return [name, bonusToStats, story, secondaryClass];
      }
      
  }
  
  
}

function effect(type){
  
  switch(type){
    case 'magic orb':
      //fall through
    case 'magic ball':
      //fall through
    case 'magical ball':
      //fall through
    case 'magical orb':
      this.durationCounter = 0;//Incremented each time the orb is drawn, if duration isn't false.
      this.duration = false;//integer representing times to be looped before the orb stops being drawn. False for infinite duration.
      this.shouldAutoUpdate = false;//Dictates whether or not the drawing function should call itself.
      this.updateRate = 30;//Integer, milliseconds. If the orb is self drawn, this dictates how often it should update itself.
      
      this.loopSpacing = false;//How much space inbetween each loop. 0 works, if false the value will be generated algorithmically.
      this.loops = 10;//Dictates how many loops the orb should have. More loops causes more lag, but makes the orb look more whispy around the edges.
      this.alphaTransparency = 0.4;//Integer, dictates translucency
      
      this.frequencyOfColorChange = 0.01;//Decimal representing percentage chance orb has of changing color each time it's drawn.
      this.shouldColorChange = true;//Boolean, if true, activeColor is reassigned to a randomly selected color from the colors array.
      this.shouldColorFade = true;//Fades into the next color instead of directly changing.
      this.isColorFading = false;//Used internally if shouldColorFade is true. If it is true, the color will start fading.
      this.activeColorValues = false;//Used internally if shouldColorFade is true. Stores the values of the active color.
      this.fadeToColorValues = false;//Used internally if shouldColorFade is true. Stores the values of the color selected for fading to.
      this.fadeMax = 300;//Used internally to count level of fade.
      this.colors = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)','rgb(0, 0, 0)', 'rgb(255, 255, 255)'];//Any color values should work(excluding RGBA).
      this.activeColor = 'rgb(255, 255, 255)';//Color the orb is currently being drawn as.
      
      this.alive = true;//Dictates whether or not the orb is drawn. Can be changed externally. Is set to false at the end of duration.
      this.x = $(window).width()/2;//Drawn to this coordinate, will change if shouldGlide is true.
      this.y = $(window).height()/2;//Drawn to this coordinate, will change if shouldGlide is true.
      
      this.speed = 5;//Dictates how many times the movement loop is iterated before a time delay is enacted.
      this.isGliding = false;//Boolean, if true x and y will gradually change to glideX and glide Y.
      this.glideX = false;//Integer(0 inclusive), or false for gliding to any(randomly selected) location. A-Okay to change externally.
      this.glideY = false;//Integer(0 inclusive), or false for gliding to any(randomly selected) location. A-Okay to change externally.
      
      this.size = 20;//Integer, size in pixels. Changes if shouldSizeChange is true.
      this.shouldSizeChange = true;//Boolean, if true then size changes gradually inbetween sizeMax and sizeMin
      this.maxSize = 20;//Maximum size in px, disreguarded if this.shouldSizeChange === false
      this.minSize = 15;//Minimum size in px, disreguarded if this.shouldSizeChange === false
      this.growthRate = 1;//Number to be added to size after growthBuffer fills to growthBufferMax.
      this.growthBufferMax = 10;//Number of times function has to be iterated before growthRate is added to size.
      this.growthBuffer = 0;//Used internally to slow growth.
      this.growing = true;//Boolean, Used internally (if shouldSizeChange is true), if false then the orb is shrinking.
      
      this.degreeOfWobble = 5;//Integer, amount of pixels to drift away from set x value by.
      this.shouldWobble = true;//If this is true, a random number in between degreeOfWobble and -degreeOfWobble offsets where each layer is drawn.
      
      ///Use me externally to make the orb draw itself! :D
      this.startUp = function(){
        if(this.shouldAutoUpdate){
          updateLoop = setInterval(this.draw.bind(this), this.updateRate);
        }
      }
      
      //Use me externally for gliding to a random location! :D
      this.glideRandom = function(){
        this.isGliding = true;
        this.glideX = Math.floor(Math.random()*$(window).width());
        this.glideY = Math.floor(Math.random()*$(window).height());
      }
      
      //This is different than this.draw because it only draws the shape, instead of dealing with all of the surrounding foofoo like color and shape changing.
      this.drawShape = function(){
        for(var i = 0;i < this.loops;i++){
          ctx.globalAlpha = this.alphaTransparency;
          ctx.beginPath();
          ctx.arc(this.x + ((this.shouldWobble) ? Math.floor(Math.random()*(this.degreeOfWobble*2)-this.degreeOfWobble) : 0),this.y + ((this.shouldWobble) ? Math.floor(Math.random()*this.degreeOfWobble) : 0), this.size*2/(i/2+1),0,Math.PI * 2,true);
          ctx.closePath();
          ctx.fill();
        }
      }
      
      
      this.draw = function(){
        if(this.alive && this.shouldAutoUpdate)ctx.clearRect(0, 0, $(window).width(), $(window).height());
        
        if(this.shouldColorChange){
          if(Math.floor(Math.random()*100) < this.frequencyOfColorChange*100){
            
            if(this.shouldColorFade && !this.isColorFading){
              this.isColorFading = true;
              this.fadeToColorValues = stringToRGBArray(chooseFrom(this.colors));
              this.activeColorValues = stringToRGBArray(this.activeColor);
            }
            
            else if(!this.shouldColorFade)this.activeColor = chooseFrom(this.colors);
          }
        }
        
        if(this.isColorFading){
          for(var i = 0; i < 3; i++){
            if(this.activeColorValues[i] !== this.fadeToColorValues[i]){
              if(this.fadeToColorValues[i] > this.activeColorValues[i])this.activeColorValues[i] = this.activeColorValues[i]*1 + 1;
              else if(this.fadeToColorValues[i] < this.activeColorValues[i])this.activeColorValues[i] = this.activeColorValues[i]*1 - 1;
            }
          }
          
          this.activeColor = 'rgb(' + this.activeColorValues[0] + ',' + this.activeColorValues[1] + ',' + this.activeColorValues[2] + ')';
          this.fadeToColor = 'rgb(' + this.fadeToColorValues[0] + ',' + this.fadeToColorValues[1] + ',' + this.fadeToColorValues[2] + ')';
          
          if(this.activeColor === this.fadeToColor){
            this.isColorFading = false;
          }
          
        }
        
        if(this.shouldSizeChange){
          this.growthBuffer = this.growthBuffer + 1;
          if(this.growthBuffer >= this.growthBufferMax){
            this.growthBuffer = 0;
            //Logic controlling growth:
            if(this.growing){
              this.size = this.size + this.growthRate;
              if(this.size > this.maxSize)this.growing = false;
            }
            else {
              this.size = this.size - this.growthRate;
              if(this.size < this.minSize)this.growing = true;
            }
          }
        }
        
        if(this.isGliding){
          for(var i = 0; i <= this.speed; i++){
            var newCoords = getCoordsOnWayTo([this.x, this.y], [this.glideX, this.glideY]);
            
            if(newCoords == 'Coords Same'){
              this.isGliding = false;
              break;
            }

            else {
              this.x = newCoords[0];
              this.y = newCoords[1];
            }
          }
        }
        
        ctx.fillStyle = this.activeColor;
        
        this.drawShape();
      }
      
      this.draw.bind(this);
      
      break;
      
    case 'chaos magic':
      orb = new effect('magical orb');
      orb.drawShape = function(){
        ctx.beginPath();
        ctx.moveTo(this.x + ((this.shouldWobble) ? Math.floor(Math.random()*(this.degreeOfWobble*2+this.size*2)-(this.degreeOfWobble+this.size)) : 0), this.y + ((this.shouldWobble) ? Math.floor(Math.random()*(this.degreeOfWobble*2+this.size*2)-(this.degreeOfWobble+this.size)) : 0));
        
        for(i = 0; i < 5; i++){
          ctx.lineTo(this.x + ((this.shouldWobble) ? Math.floor(Math.random()*(this.degreeOfWobble*2+this.size*2)-(this.degreeOfWobble+this.size)) : 0), this.y + ((this.shouldWobble) ? Math.floor(Math.random()*(this.degreeOfWobble*2+this.size*2)-(this.degreeOfWobble+this.size)) : 0));
        }
        ctx.fill();
        ctx.closePath();
      }
      
      return orb;
      
    default:
      return undefined;
  }
}

function tile(image, x, y, zHeight, shouldAddElements){
  //ctx.drawImage(image, 0, 0);

  this.image = image;

  this.x = x;
  this.y = y;
  
  //if(typeof shouldAddElements == typeof undefined)shouldAddElements = true;
  
  if(shouldAddElements){
    worldMap.elementTypes.forEach(function(element){
      if(Math.random()*100 < element.frequency){
        var newElement = new tile(element.image, this.x, this.y, element.zHeight, false);
        
        newElement.cartesianX = (this.x / 32 + this.y / 16) /2;
        newElement.cartesianY = (this.y / 16 -(this.x / 32)) /2;
        
        worldMap.mapIndex[element.zIndex][0].push(newElement);
      }
    }.bind(this));
  }
  
  this.rect = {
    coords0:[(this.x) + this.image.width/2, (this.y) + this.image.height/2],
    coords1:[(this.x) + this.image.width, (this.y) + this.image.height/4 + this.image.height/2],
    coords2:[(this.x) + this.image.width/2, (this.y) + this.image.height/2 + this.image.height/2],
    coords3:[(this.x), (this.y) + this.image.height/4 + this.image.height/2]
  }
  //(x-y)*(width/2), (y+x)*(height/2)
  
  this.draw = function(){
      ctx.drawImage(this.image, this.x, this.y);
  }
  
  this.drawRect = function(whichLevel){
    ctx.strokeStyle="rgb(0, 0, 0)";
    ctx.lineWidth=1;
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.moveTo(this.rect.coords0[0], this.rect.coords0[1] - whichLevel*zHeight);
    for(var i = 1; i < 4; i++){ 
      ctx.lineTo(this.rect['coords' + i][0], this.rect['coords' + i][1] - whichLevel*zHeight);
    }
    
    ctx.closePath();
    ctx.stroke();
  }
}

function gameMap(tileImage1, tileImage2, size){
  this.tileImage1 = tileImage1;
  this.tileImage2 = tileImage2;

  this.mapIndex = {
    0:[],
  };//Includes z-index one.
  
  //This list is appended to when an element is added, and helps to store the information needed for adding elements when the map is expanded.
  this.elementTypes = [];
  
  this.size = size;
  this.moreSizeStats = {
    widthTotal:size,
    widthAddedPos:size,
    widthAddedNeg:0,
    lengthAddedPos:size,
    lengthAddedNeg:0
  }
  
  this.makeTiles = function(){
    for(var rows = 0; rows < this.size; rows++){
      this.mapIndex[0].push([]);
      for(var columns = 0; columns < this.size; columns++){
        var newTile = new tile(chooseFrom([this.tileImage1, this.tileImage2, this.tileImage2]), (rows-columns)*32-32, ((columns+rows)/2)*32, 32, true);
        newTile.cartesianX = rows;
        newTile.cartesianY = columns;
        this.mapIndex[0][rows].push(newTile);
      }
    }
  }
  
  //0 for top, 1 for back.
  this.addRow = function(whichSide){
    var length = (whichSide) ? this.moreSizeStats.lengthAddedPos : this.moreSizeStats.lengthAddedNeg;
    this.mapIndex[0].splice(length*whichSide + ((whichSide) ? this.moreSizeStats.lengthAddedNeg : 0), 0, [])
    for(var i = 0; i < this.moreSizeStats.widthTotal; i++){
      
      var tileStats = {};
      
      tileStats.cartesianX = (length*whichSide) - ((whichSide) ? 0 : length+1);
      tileStats.cartesianY = i - this.moreSizeStats.widthAddedNeg;
      
      tileStats.x = (tileStats.cartesianX-tileStats.cartesianY)*32-32;
      tileStats.y = ((tileStats.cartesianY+tileStats.cartesianX)/2)*32;
      
      var newTile = new tile(chooseFrom([this.tileImage1, this.tileImage2, this.tileImage2]), tileStats.x, tileStats.y, 32, true);
      
      newTile.cartesianX = tileStats.cartesianX;
      newTile.cartesianY = tileStats.cartesianY;
      
      this.mapIndex[0][length*whichSide + ((whichSide) ? this.moreSizeStats.lengthAddedNeg : 0)].push(newTile);
    }
    if(whichSide){
      this.moreSizeStats.lengthAddedPos = this.moreSizeStats.lengthAddedPos + 1;
    }
    
    else {
      this.moreSizeStats.lengthAddedNeg = this.moreSizeStats.lengthAddedNeg + 1;
    }
  }
  
  //0 for left, 1 for right
  this.addColumn = function(whichSide){
    
    var length = (whichSide) ? this.moreSizeStats.widthAddedPos : this.moreSizeStats.widthAddedNeg;
    
    for(var row = 0; row < Object.keys(this.mapIndex[0]).length; row++){
      var tileStats = {};
      tileStats.cartesianX = row - this.moreSizeStats.lengthAddedNeg;
      tileStats.cartesianY = (whichSide) ? this.moreSizeStats.widthAddedPos : 0-this.moreSizeStats.widthAddedNeg-1;
      
      tileStats.cartesianY = parseInt(tileStats.cartesianY);
      tileStats.cartesianX = parseInt(tileStats.cartesianX);
      
      tileStats.x = (tileStats.cartesianX-tileStats.cartesianY)*32-32;
      tileStats.y = ((tileStats.cartesianY+tileStats.cartesianX)/2)*32;
      
      var newTile = new tile(chooseFrom([this.tileImage1, this.tileImage2, this.tileImage2]), tileStats.x, tileStats.y, 32, true);
      
      newTile.cartesianX = tileStats.cartesianX;
      newTile.cartesianY = tileStats.cartesianY;
      
      if(whichSide)this.mapIndex[0][row].push(newTile);
      else this.mapIndex[0][row].unshift(newTile);
    }
    if(whichSide){
      this.moreSizeStats.widthAddedPos = this.moreSizeStats.widthAddedPos + 1;
    }
    
    else {
      this.moreSizeStats.widthAddedNeg = this.moreSizeStats.widthAddedNeg + 1;
    }
    
    this.moreSizeStats.widthTotal = this.moreSizeStats.widthTotal + 1;
  }

  this.drawMap = function(zIndex){
    this.mapIndex[zIndex].forEach(function(element){
      element.forEach(function(element){
        //element.drawRect(0);
        element.draw();
        //element.drawRect(1);
      });
    });
  }
  
  //Image and zIndex are self explanatory. Frequency is the percentage chance the element has of spawning when a new tile is created.
  this.addElement = function(image, zIndex, frequency, onClick, zHeight){
    if(!this.mapIndex[zIndex]){
      this.mapIndex[zIndex] = [];
      this.mapIndex[zIndex][0] = [];
    }
    
    this.elementTypes.push(
      {
        image:image,
        zIndex:zIndex,
        zHeight:zHeight,
        frequency:frequency,
        onClick:onClick
      }
    );
    
    /*
    this.mapIndex[zIndex].push([]);
    for(var i = 0; i < frequency*0.1*this.size; i++){
      var x = Math.floor(Math.random() * (this.size*2))-2;
      var y = Math.floor(Math.random() * (this.size*2))-2;
      this.mapIndex[zIndex][this.mapIndex[zIndex].length - 1].push(new tile(image, (x-y)*16-32, ((y+x)/2)*16, 32));
    }*/
  }
}

//End of assisting functions section! :D

function character(){
  this.lastFocusedOn = false;
  this.focusOn = false;
  
  this.overTiles = [worldMap.mapIndex[0][25][25]];
  
  this.direction = 0;
  this.x = 100;
  this.y = 100;
  this.zIndex = 'clutter';
  
  this.modelArray = [];
  
  this.movementSettings = {
    8:[['w'], 5],
    7:[['s'], 1],
    6:[['a'], 7],
    5:[['d'], 3],
    4:[['a', 'w'], 6],
    3:[['d', 'w'], 4],
    2:[['d', 's'], 2],
    1:[['a', 's'], 0]
  }
  this.directionLibrary = {
    1:function(speed){
      this.y = this.y + speed;
    }.bind(this),
    
    5:function(speed){
      this.y = this.y + speed*-1;
    }.bind(this),
    
    3:function(speed){
      this.x = this.x + speed*2;
    }.bind(this),
    
    7:function(speed){
      this.x = this.x + speed*-2;
    }.bind(this)
  }
  
  this.base = {
    width:32,
    height:32,
    zHeight:122
  }
  
  this.stats = {
    speed:2,
    maxSight:25,
    sight:25
  };
  
  this.load = function(images){
    this.modelArray = images;
  }
  
  this.draw = function(){
    this.modelArray[this.direction].forEach(function(element){
      ctx.drawImage(element, this.x, this.y);
    }.bind(this));
  }
  
  this.drawRect = function(whichLevel){
    this.updateRect();
    ctx.strokeStyle="rgb(0, 0, 0)";
    ctx.lineWidth=1;
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.moveTo(this.rect.coords0[0], this.rect.coords0[1] - whichLevel*this.base.zHeight);
    for(var i = 1; i < 4; i++){ 
      ctx.lineTo(this.rect['coords'+i][0], this.rect['coords'+i][1] - whichLevel*this.base.zHeight);
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  this.update = function(){
    
    if(keyMap['Alt']){
      this.focusOn = !this.lastFocusedOn;
      setTimeout(function(){
        this.lastFocusedOn = this.focusOn;
      }.bind(this), 500);
    }
    
    if(this.focusOn){
      this.cameraFocus();
    }
    
    for(var element in this.movementSettings){
      if(keyMap[this.movementSettings[element][0]] || keyMap[this.movementSettings[element][0][0]] && keyMap[this.movementSettings[element][0][1]]){;
        this.move(this.movementSettings[element][1]);
        break;
      }
    }
  }
  
  this.cameraFocus = function(){
    ctx.translate(
      cameraX - this.x + $(window).width()/2 - this.modelArray[0][0].width/2,
      cameraY - this.y + $(window).height()/2 - this.modelArray[0][0].height/2
    );
    cameraX = this.x - $(window).width()/2 + this.modelArray[0][0].width/2;
    cameraY = this.y - $(window).height()/2 + this.modelArray[0][0].height/2; 
  }
  
  
  this.move = function(direction, speed){
    var xBefore = this.x;
    var yBefore = this.y;
    
    if(!direction && direction !== 0){
      var direction = this.direction;
    }
    if(!speed){
      var speed = this.stats.speed;
    }
    
    var directionX = direction;
    var directionY = direction;
    
    if(direction%2 == 0){
      directionX = this.changeSide(direction, 1);
      directionY = this.changeSide(direction, -1);
    }
    
    this.directionLibrary[directionX](speed);
    this.directionLibrary[directionY](speed);
    
    this.direction = direction;
    
    this.updateRect();
    for(var subFolder in worldMap.mapIndex[this.zIndex]){
      for(var element in worldMap.mapIndex[this.zIndex][subFolder]){
        var element = worldMap.mapIndex[this.zIndex][subFolder][element];
        for(var i = 0; i < 4; i++){
          if(this.rect['coords' + i][0] < element.rect.coords1[0] && this.rect['coords' + i][0] > element.rect.coords3[0]){
            if(this.rect['coords' + i][1] < element.rect.coords2[1] && this.rect['coords' + i][1] > element.rect.coords0[1]){
              this.x = xBefore;
              this.y = yBefore;
            }
          }
        }
      }
    }
  }
  
  this.changeSide = function(direction, rightOrLeft){
    var newDirection = parseInt(direction) + rightOrLeft;
    if(newDirection > 7)return 0;
    if(newDirection < 0)return 7;
    return newDirection;
  }
  
  this.updateOverTiles = function(){
    var lastOverTile = this.overTiles[0];
    this.overTiles = [];
    this.updateRect();
    for(var x = -4; x < 5; x++){
      for(var y = -4; y < 5; y++){
        var element = worldMap.mapIndex[0][lastOverTile.cartesianX + x + worldMap.moreSizeStats.lengthAddedNeg][lastOverTile.cartesianY + y + worldMap.moreSizeStats.widthAddedNeg];
        var elementRect = {
          x:element.x,
          y:element.y,
          width:element.image.width,
          height:element.image.height
        }
        for(var coordSet in this.rect){
          var coordSetObject = {
            x:this.rect[coordSet][0],
            y:this.rect[coordSet][1]
          }
          if(isInside(coordSetObject, elementRect) && !(this.overTiles.includes(element))){
            this.overTiles.push(element);
          }
        }
      }
    }
  }
  
  this.updateRect = function(){
    this.rect = {
      coords0:[(this.x) + this.base.width/2 + this.base.width/2, (this.y) + this.base.zHeight-this.base.height + this.base.height/2],
      coords1:[(this.x) + this.base.width + this.base.width/2, (this.y) + this.base.zHeight-this.base.height + this.base.height/4 + this.base.height/2],
      coords2:[(this.x) + this.base.width/2 + this.base.width/2, (this.y) + this.base.zHeight-this.base.height + this.base.height/2 + this.base.height/2],
      coords3:[(this.x) + this.base.width/2, (this.y) + this.base.zHeight-this.base.height + this.base.height/4 + this.base.height/2]
    }
  }
}


//MAIN FUNCTION FOR STARTING UP GAME ENGINE! :D
function startGame(){
  //$('#gameCanvas').replaceWith('<canvas id="gameCanvas" width="600" height="600">This human\'s web browser is incapable of using the graphical deity interface I have created...</canvas>');
  var cnv = document.getElementById('gameCanvas');
  var ctx = cnv.getContext('2d');
  
  $('#canvasCan').append('<div class = tabBottom id = settingsTab style = right:10px;><img src="imgs/icons/settingsIcon.png" alt="Settings" style = display:block;margin:auto;></div>');
  
  $('#canvasCan').append('<div class = inGameWindow id = settingsWindow> <h3 style = margin-left:100px;margin-right:100px;margin-top:20px;> Settings </h3> <h4 style = position:absolute;top:0px;right:15px; > Drag Me! </h4> <hr id = thinHr> </div>');
  $('#settingsWindow').hide();
  
  
  function makeDraggable(id){
    $(id).mousedown(function(event){
      $('#gameCanvas').on('mousemove', function(event){
        var mousePos = getMousePos(cnv, event);
        $(id).css('left', mousePos.x - $(id).width()/2);
        $(id).css('top', mousePos.y - $(id).height()/2);
      });
    });
    $(id).mouseup(function(event){
      $(id).off('mousemove');
      //var mousePos = getMousePos(cnv, event);
      //  $(id).css('left', mousePos.x - $(id).width()/2);
      //  $(id).css('top', mousePos.y - $(id).height()/2);
    });
  }
  
  makeDraggable('#settingsWindow');
  
  $('#settingsTab').click(function(){
    $('#settingsWindow').toggle();
  });
  $('#canvasCan').append('<div class = tabBottom id = mortalInfoTab style = right:120px;><img src="imgs/icons/mortalIcon.png" alt="Mortal Info" style = display:block;margin:auto;></div>');
  
  gameLoad(ctx, cnv);
}

function gameLoad(ctx, cnv){
  var playerModelArray = [];//All of the playerModel images will be here.
  var playerModelCounter = 0;//This counts how many of the playerModel images have been loaded
  var tileArray = [];//All of the tile images will go here
  var tileCounter = 0;//This counts how many of the tiles have been loaded
  $(window).off('resize');
  ctx.fillStyle = 'black';
  ctx.lineWidth = 4;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for(var i = 0; i < 8; i++){
    playerModelArray.push([]);
    for(var i2 = 0; i2 < 14; i2++){
      playerModelArray[i].push(new Image());

      playerModelArray[i][i2].onload = function(){
        playerModelCounter = playerModelCounter + 1;
        
        //Loading screen for playermodels
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.fillText('LOADING PLAYERMODELS: ' + playerModelCounter + '/112', $(window).width()/2, $(window).height()/2);
        //Done with loading screen for playermodels
        
        if(playerModelCounter === 112){
          
          //Tile loading now!
          var numberOfTileImages = 3;
          for(var i = 0; i < numberOfTileImages; i++){
            tileArray.push(new Image());
            
            tileArray[i].onload = function(){
              tileCounter = tileCounter + 1;
              
              //Loading screen for tiles
              ctx.clearRect(0, 0, cnv.width, cnv.height);
              ctx.fillText('LOADING TILES: ' + tileCounter + '/' + numberOfTileImages, $(window).width()/2, $(window).height()/2);
              //Done with loading screen for tiles
              
              if(tileCounter === numberOfTileImages){
                //Loading Done!
                ctx.clearRect(0, 0, cnv.width, cnv.height);
                
                var directionBool = true;
                var mousePos1;
                var mousePos2;
                $('#gameCanvas').mousedown(function(event){
                  if(!playerCharacter.focusOn){
                    $('#gameCanvas').on('mousemove', function(event){
                      if(event.which == 1){
                        if(directionBool){
                          mousePos1 = getMousePos(cnv, event);

                          if(mousePos2){
                            ctx.translate(mousePos1.x - mousePos2.x, mousePos1.y-mousePos2.y);
                            cameraX = cameraX - (mousePos1.x - mousePos2.x);
                            cameraY = cameraY - (mousePos1.y - mousePos2.y);
                          }
                        }

                        else if(!directionBool){
                          mousePos2 = getMousePos(cnv, event);

                          if(mousePos1){
                            ctx.translate(mousePos2.x - mousePos1.x, mousePos2.y-mousePos1.y);
                            cameraX = cameraX - (mousePos2.x - mousePos1.x);
                            cameraY = cameraY - (mousePos2.y - mousePos1.y);
                          }
                        }

                        directionBool = !directionBool;
                      }
                    });
                  }
                });

                $(document).mouseup(function(){
                  $('#gameCanvas').off('mousemove');
                  mousePos1 = false;
                  mousePos2 = false;
                });
                
                //Thanks Braden Best & Stack Overflow for this awesome key checking system.
                onkeydown = onkeyup = function(e){
                  e = e || event; //to deal with IE//Although nothing else is IE proof...
                  
                  if(typeof (e.key == 'r' && keyMap['ctrl']) == 'undefined' || typeof (e.key == 'I' && keyMap['ctrl'] && keyMap['shift']) == 'undefined' || e.key == 'F11');
                  else {
                    e.preventDefault();
                  }
                  keyMap[e.key] = e.type == 'keydown';
                }
                
                $(document).on('keydown', onkeydown)
                $(document).on('keyup', onkeyup)
                
                worldMap = new gameMap(tileArray[0], tileArray[1], 50);
                worldMap.addElement(tileArray[2], 'clutter', 0.15, undefined, 32);
                worldMap.makeTiles();
                
                playerCharacter = new character();
                playerCharacter.load(playerModelArray);
                
                playerCharacter.x = worldMap.mapIndex[0][25][25].x + 32;
                playerCharacter.y = worldMap.mapIndex[0][25][25].y - 96;
                
                $('#settingsWindow').append('<div style=margin:auto;display:block;> <h4 style = margin-top:13px;float:left;display:block;>Sight:</h4> <input id=sightInput type=range style = margin-top:10px;float:right;display:block;></input></div>');
                $('#sightInput').min = 0;
                $('#sightInput').max = 25;
                console.log($('#sightInput').max);
                
                $('#sightInput').on('input', function () {
                  $(this).trigger('change');
                  playerCharacter.stats.sight = $(this).val();
                  console.log($(this).val());
                });
                
                playerCharacter.cameraFocus();

                gameUpdate(ctx, cnv);
              }
            }
            
            tileArray[i].src = 'imgs/tiles/' + i + '.png';
          }
        }
      };


      playerModelArray[i][i2].src = 'imgs/spritesAndArmor/gameResSprites/humanStandard/' + i + '/' + i2 + '.png';
      //else if(i == 8)imagesInAnArray[i][i2].src = 'imgs/tiles/' + i + '/' + i2 + '.png';
    }
  }
}

function gameUpdate(ctx, cnv){

  ctx.clearRect(cameraX, cameraY, cnv.width, cnv.height);
  
  playerCharacter.updateOverTiles();
  
  //World rendering code
  for(var element in worldMap.mapIndex){
    
    if(element === 'clutter'){
      
      var drawAfter = [];
      
      for(environmentalElementIndex in worldMap.mapIndex[element][0]){
        
        environmentalElement = worldMap.mapIndex[element][0][environmentalElementIndex];
        
        if(isInside(
            {
              x:environmentalElement.cartesianX,
              y:environmentalElement.cartesianY
            },
            {
              x:playerCharacter.overTiles[0].cartesianX - playerCharacter.stats.sight,
              y:playerCharacter.overTiles[0].cartesianY - playerCharacter.stats.sight,
              width:playerCharacter.stats.sight*2,
              height:playerCharacter.stats.sight*2
            }
          )){
          
          if (environmentalElement.y-environmentalElement.image.height < playerCharacter.y){
            environmentalElement.draw();
          }

          else drawAfter.push(environmentalElement);
        }
      }
      
      
      playerCharacter.draw();
      
      drawAfter.forEach(
        function(element){
          element.draw();
        }
      );
      
      playerCharacter.update();
    }
    
    else {
      
      //The following (commented out) code empties out drawing function for any tile underneath the character, effectively turning the game into an epic Etch-A-Sketch.
      //playerCharacter.overTiles.forEach(function(element){
        //element.draw = function(){};
      //});
      
      
      //Adding the Neg value allows you to get zero indexed map coords, which you can then fish out of the map arrays.
      var tileX = playerCharacter.overTiles[0].cartesianX + worldMap.moreSizeStats.lengthAddedNeg;
      var tileY = playerCharacter.overTiles[0].cartesianY + worldMap.moreSizeStats.widthAddedNeg;
      
      //worldMap.mapIndex[0][tileX][tileY].draw = function(){};
      
      loop1:
      for(var x = -1*playerCharacter.stats.sight; x < playerCharacter.stats.sight; x++){
        for(var y = -1*playerCharacter.stats.sight; y < playerCharacter.stats.sight; y++){
          
          if(worldMap.mapIndex[element][tileX+x] &&  worldMap.mapIndex[element][tileX+x][tileY+y])worldMap.mapIndex[element][tileX+x][tileY+y].draw();
         
          else {
            
            //This if checks to see if a row is needed :D
            if(!worldMap.mapIndex[element][tileX+x]){
              
              //If the row needs to be added to the front,
              if((tileX+x) > worldMap.moreSizeStats.lengthAddedPos){
                worldMap.addRow(1);//Do so
              }
              
              //Or if it needs to be added to the back,
              if((tileX + x) < 0){//(zero and not worldMap.moreSizeStats.lengthAddedNeg*-1 because the coords are already zero indexed)
                worldMap.addRow(0);//Then do that.
              }
              
              //These two have to be updated so that columns and rows aren't added unnecessarily.
              var tileX = playerCharacter.overTiles[0].cartesianX + worldMap.moreSizeStats.lengthAddedNeg;
              var tileY = playerCharacter.overTiles[0].cartesianY + worldMap.moreSizeStats.widthAddedNeg;
            }
            
            
            //This if checks to see if a column is needed
            if(worldMap.mapIndex[element][tileX+x] && !(worldMap.mapIndex[element][tileX+x][tileY+y])){
              if(tileY+y > worldMap.moreSizeStats.widthAddedPos){
                worldMap.addColumn(1);
              }
              
              //Or if it needs to be added to the back,
              if((tileY + y) < 0){//(zero and not worldMap.moreSizeStats.widthAddedNeg*-1 because the coords are already zero indexed)
                worldMap.addColumn(0);//Then do that.
              }
              
              //These two have to be updated so that columns and rows aren't added unnecessarily.
              var tileX = playerCharacter.overTiles[0].cartesianX + worldMap.moreSizeStats.lengthAddedNeg;
              var tileY = playerCharacter.overTiles[0].cartesianY + worldMap.moreSizeStats.widthAddedNeg;
            }
          }
          
          
        }
      }
      //worldMap.drawMap(0);(ignores sight)
    }
  }
  //End of world render
  
  setTimeout(function(){gameUpdate(ctx, cnv);}, 17);
}

//END OF GAME ENGINE CODE!-------------------------------------------------------------------------------------------------





