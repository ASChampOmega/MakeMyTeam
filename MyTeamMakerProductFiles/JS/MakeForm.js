// The Attributes are in A
// The entire data will be in the matrix arr
// n is the number of attributes, nP is the number of people

var A = [];
var arr;
var names = [];
var n = 0;
var nP = 0;
var m = 0;
// An array to store names for storage
var namesO = []

function ChooseData() {
    // Show the box for User to Enter Data
    document.getElementById("PageCont1").style.display = "block";
    document.getElementById("EnterDataBtn").style.display = "none";
    document.getElementById("PasteStringBtn").style.display = "none";
}

function ChooseString() {
    // Show the box for User to Enter Data String
    document.getElementById('ImportDataDiv').style.display = "block";
    document.getElementById("EnterDataBtn").style.display = "none";
    document.getElementById("PasteStringBtn").style.display = "none";
}


function nameAttr() {
    n = document.getElementById("nAttr").value;
    nP = document.getElementById("nPeople").value;
    arr = new Array(nP);
    for (var i = 0; i < n; i++) {
        // Create labels and textboxes to input the attributes
        var createL = document.createElement("label");
        createL.innerHTML = "Attribute " + (i + 1);
        createL.setAttribute("id", "atrL" + i);

        var createTb = document.createElement("INPUT");
        createTb.setAttribute("type", "text");
        createTb.setAttribute("id", "atr" + i);

        // To add textboxes to the page
        var b = document.getElementById('AttributeForm');
        b.innerHTML += "<br>"
        b.appendChild(createL);
        b.innerHTML += "&nbsp &nbsp"
        b.appendChild(createTb);
    }
    document.getElementById('AttributeForm').innerHTML += "<br> <br>";
    // Hide and show the correct buttons
    document.getElementById('NameAtrBtn').style.display = "none";
    document.getElementById('MakeFormBtn').style.display = "block";
    document.getElementById('nAttr').style.display = "none";
    document.getElementById('nPeople').style.display = "none";

}

// To make a custom form with textboxes according to the number of 
function makeForm() {

    document.getElementById('FormMain').style.display = "block";
    document.getElementById('AttributeForm').style.display = "none";
    for (var i = 0; i < n; i++) {
        // Storing the attributes in an Array and creating new labels
            A.push(document.getElementById('atr' + i).value);
            var createL = document.createElement("label");
            createL.innerHTML = A[i];
            createL.setAttribute('id', 'atrl' + i);
            createL.setAttribute('class', 'PageContLabel')
            // document.getElementById('atrL' + i).innerHTML = A[i];
            // Erasing old textboxes and adding new ones. This is done in one loop for efficiency

            document.getElementById('atr' + i).style.display = "none";
            document.getElementById('atrL' + i).style.display = "none";
            var createTb = document.createElement("INPUT");
            createTb.setAttribute("type", "number");
            createTb.setAttribute("id", "atrN" + i);
            var table = document.getElementById('FormBoxes');
            var row = table.insertRow(i);
            var labelCell = row.insertCell(0);
            var boxCell = row.insertCell(1);
            labelCell.appendChild(createL);
            boxCell.appendChild(createTb);
    }
    document.getElementById('FormSpace').innerHTML += "<br> <br>";

    // Hide and show the correct buttons
    document.getElementById('MakeFormBtn').style.display = "none";
    document.getElementById('SubN').style.display = "block";
}

function submitP() {
    // arrT will be used to build the matrix arr
    arr[m] = new Array(n);
    var arrT = [];
    names.push(document.getElementById('name').value);
    namesO.push(document.getElementById('name').value);
    document.getElementById('name').value = "";

    for (i = 0; i < n; i++) {
        //Filling arrT
        arrT.push(document.getElementById("atrN" + i).value);
        document.getElementById("atrN" + i).innerHTML = null;
    }
    // Filling arr
    arr[m] = arrT;

    m++;
    // Display the Button to make teams once appropriate number of people are added
    if (m == nP) {
        document.getElementById('MakeTeamArea').style.display = "block";
    }
    return;
}

function computeD(i, j) {
    var d = 0;
    // Distance between 2 points --> The sum of the squares of the difference of their attributes
    // Square root is unecessary
    for (var x = 0; x < n; x++) {
        d += (arr[i][x] - arr[j][x]) * (arr[i][x] - arr[j][x]);
    }
    return d;
}

var dist = new Array(nP);

function buildDist() {
    // Calculate the pairwise distances
    for (var i = 0; i < nP; i++) {
        dist[i] = new Array(nP);
        var dist1 = new Array(nP);
        for (var j = 0; j < nP; j++) {
            // If it is the same person, then distance should be infinity, so it is never selected.
            if (i == j) {
                dist1[j] = Infinity;
            }
            else {
                dist1[j] = computeD(i, j);
            }
        }
        // Setting the matrix rows
        dist[i] = dist1;
    }
}

var Teams;

var chosen = new Array(nP);
// After distances are computed, the array below correlates the distances to the actual indexes
// Which is used to correlate to names.
var distR = new Array(nP);


function sortR1(dist, distR) {
    for (var i = 0; i < nP; i++) {
        for (var j = 0; j < nP; j++) {
            for (var k = 0; k < nP - j - 1; k++) {
                if (dist[i][k] > dist[i][k+1]) {
                    var temp = dist[i][k];
                    var temp1 = distR[i][k];
                    dist[i][k] = dist[i][k+1];
                    dist[i][k+1] = temp;
                    distR[i][k] = distR[i][k+1];
                    distR[i][k+1] = temp1;
                }
            }
        }
    }
}

function sortR2(dist, distR, names) {
    var sums = new Array(nP);
    for (var i = 0; i < nP; i++) {
        sums[i] = 0;
        for (var j = 0; j < nP; j++) {
            // Condition to check if i!=j otherwise everything will be infinity
            if (i != j)
                sums[i] += dist[i]
        }
    }
    for (var j = 0; j < nP; j++) {
        for (var k = 0; k < nP - j - 1; k++) {
            if (sums[k] > sums[k + 1]) {
                var tempN = names[k];
                var temp = dist[k];
                var temp1 = distR[k];
                var temp2 = sums[k];
                dist[k] = dist[k + 1];
                dist[k + 1] = temp;
                distR[k] = distR[k + 1];
                distR[k + 1] = temp1;
                sums[k] = sums[k + 1];
                sums[k + 1] = temp2;
                names[k] = names[k + 1];
                names[k + 1] = tempN;
            }
        }
    }
    
}

// When Reverse teams are requested, to prevent the first element from being Infinity (i.e., the person himself in question)
// The invert function will make infinity => -1 --> the no self-reference will be first. Instead they will be last

function invert(dist) {
    for (var i = 0; i < nP; i++) {
        for (var j = 0; j < nP; j++) {
            if (i == j) {
                dist[i][j] = -1;
            }
        }
    }
}

// To reverse the lists for reverse teams.

function sortRev(dist, distR, names) {
    names.reverse();
    for (var i = 0; i < nP; i++) {
        dist[i].reverse();
        distR[i].reverse();
    }
}


// Finding a new teammate for a current team. It is based off the best preference among all teammates
function findMate(team) {
    var minP = Infinity;
    var minD = Infinity;
    for (var i = 0; i < team.length; i++) {
        var c = 0;
        // Travels to the first not chosen person according to person i's preferences
        while (chosen[distR[team[i]][c]] && c < nP - 2) {
            c++;
        }
        // Finding the overall Minimum distance

        if (dist[team[i]][c] < minD && !chosen[team[i]][c]) {
            minD = dist[team[i]][c];
            minP = distR[team[i]][c];
        }
        // As dist is sorted, only 1 iteration per person is needed
    }
    chosen[minP] = 1;
    return minP;

}

function findMateRev(team) {
    var maxD = -Infinity;
    var maxP = -Infinity;
    for (var i = 0; i < team.length; i++) {
        var c = 0;
        // Travels to the first not chosen person according to person i's preferences
        while (chosen[distR[team[i]][c]] && c < nP - 2) {
            c++;
        }
        // Finding the overall Minimum distance

        if (dist[team[i]][c] > maxD && !chosen[team[i]][c]) {
            maxD = dist[team[i]][c];
            maxP = distR[team[i]][c];
        }
        // As dist is sorted, only 1 iteration per person is needed
    }
    chosen[maxP] = 1;
    return maxP;
}

var TeamExt1 = [];
var Rev = false;

function makeTeam1() {
    var t = document.getElementById('NTeam1').value;
    makeTeam(t);
}

function makeTeam2() {
    var t = document.getElementById('NTeam1').value;
    Rev = true;
    makeTeam(t);
}

function makeTeam(t) {
    // Precomputing
    buildDist();
    // The array to store the teams. It has +1 for the case where students cannot be evenly distributed in all teams.
    Teams = new Array(Math.floor(nP / t));

    // Building the distR array
    for (var i = 0; i < nP; i++) {
        distR[i] = new Array(nP);
        for (var j = 0; j < nP; j++) {
            distR[i][j] = j;
        }
    }
    if (Rev)
        invert(dist);
    sortR1(dist, distR);
    sortR2(dist, distR, names);
    // Have A reversed list with -1 (i.e., the self index) at the end
    if(Rev)
        sortRev(dist, distR, names);


    // Saying that no one is chosen as of now
    for (var i = 0; i < nP; i++) {
        chosen[i] = 0;
    }
    // Making the teams
    for (var i = 0; i < Math.floor(nP/t); i++) {
        var c = 0;
        Teams[i] = new Array(t);
        // Finding first non-chosen person
        while (chosen[c]) {
            c++;
        }
        var TeamTemp = [];
        var TeamT = new Array(t);
        // Making a temporary team with non-chosen person.
        TeamTemp.push(c);
        TeamT[0] = c;
        chosen[c] = 1;
        // Building the team
        for (var j = 1; j < t; j++) {
            if (Rev)
                TeamT[j] = findMateRev(TeamTemp);
            else {
                TeamT[j] = findMate(TeamTemp);
            }
            TeamTemp.push(TeamT[j]);
        }
        Teams[i] = TeamT;
    }

    // In case there are extra people, they will be put in TeamExt
    TeamExt1 = new Array(nP % t);
    if (nP % t > 0) {
        var F = nP;
        var M = 0;
        // Filling the remaining people
        while (F >= 0) {
            F--;
            if (chosen[F] == 0) {
                TeamExt1[M] = F;
                chosen[F] = 1;
                M++;
            }
            
        }
    }
    
    // Displaying the teams
    for (var i = 0; i < Teams.length; i++) {
        document.getElementById('ShowTeams').innerHTML += "<div class = 'TeamBody'> <div class = 'TeamHeading'> Team " + (i + 1) + " </div>";
        // document.getElementById('ShowTeams').innerHTML += "<div class = 'TeamBody'> <div class = 'TeamHeading'> Team " + (i + 1) + " </div> <div class = 'TeamList'>";
        for (var j = 0; j < Teams[0].length; j++) {
            document.getElementById('ShowTeams').innerHTML += "<div class='TeamMates'> " + names[Teams[i][j]] + " <\div> <br>";
        }

        document.getElementById('ShowTeams').innerHTML += " </div>";
    }
    if (TeamExt1.length > 0) {
        // Display Extra Team
        document.getElementById('ShowTeams').innerHTML += "<div class = 'TeamBody'> <div class = 'TeamHeading'> Team " + (Teams.length + 1) + " </div>";
        //document.getElementById('ShowTeams').innerHTML += "<div class = 'TeamBody'> <div class = 'TeamHeading'> Team " + (Teams.length + 1) + " </div> <div class = 'TeamList'>";
        for (var i = 0; i < TeamExt1.length; i++) {
            document.getElementById('ShowTeams').innerHTML += "<div class='TeamMates'>" + names[TeamExt1[i]] + "<\div> <br>";

        }
        document.getElementById('ShowTeams').innerHTML += " </div>";
    }

    document.getElementById('OutputData').style.display = "block";

}

function makeStorage() {
    var outP = "N1=" + n + ",NP=" + nP + "\n";
    document.getElementById('OutputStorage').innerHTML = "Data String (Copy and Save): <br><br><br>"
    // An Output String is generated for future use.
    outP += "Attr:"

    // Storing Attribute Names
    for (var i = 0; i < n; i++) {
        outP += A[i] + ",";
    }

    outP += "\n";

    // Storing the Array Data Values
    outP += "Data:"
    for (var i = 0; i < nP; i++) {
        outP += namesO[i] + ",";
        for (var j = 0; j < n; j++) {
            outP += arr[i][j] + ",";
        }
        outP += "\n";
    }
    outP += "\n /* End */";
    // Presenting the string
    document.getElementById('OutputStorage').innerHTML += outP;

}

function outputTeams() {
    // A different string for Teams is presented below
    document.getElementById('OutputTeamsStorage').innerHTML = "Teams String: <br><br><br>"
    var outP = "Team's List \n\n";
    for (var i = 0; i < Teams.length; i++) {
        outP += "Team " + (i+1) + "\n";
        for (var j = 0; j < Teams[0].length; j++) {
            outP += names[Teams[i][j]] + ", ";
        }
        outP += "\n";
    }

    // Code for case where there is a team with an uneven number of people.
    if (TeamExt1.length > 0) {
        outP += "Team " + (i + 1) + "\n";
        for (var j = 0; j < TeamExt1.length; j++) {
            outP += names[TeamExt1[j]] + ", ";
        }
    }
    outP += "\n %End%";
    outP += "<br><br><br><br>"
    document.getElementById('OutputTeamsStorage').innerHTML += outP;

}

// In the Input String, this finds the immediately next Number
function getNum(i, inp) {
    var s = "";
    var j = 0;
    // Check how far the number goes.
    while (!isNaN(inp[i+j])){
        s += inp[i + j];
        j++;
    }
    return parseInt(s);
}
// In the Input String, this finds the immediately next String
function getStrN(i, inp){
    var j = 0;
    var s = "";
    while (inp[i + j] != ",") {
        s += inp[i + j];
        j++;
    }

    return s;
}

// Number of digits in the number. For purposes of traversing the Data string.
function numDig(n) {
    var c = 0;
    while (n > 0) {
        n = Math.floor(n/10);
        c++;
    }
    return c;
}

function uploadData(inp) {
    // Getting n, nP first
    var posN = inp.search("N1=");
    n = getNum(posN + 3, inp);
    var posNP = inp.search("NP=");
    nP = getNum(posNP + 3, inp);
    // Filling in Attributes
    A = [];
    arr = new Array(nP);
    names = new Array(nP);

    var posAttr = inp.search("Attr:");
    var nextAtr = 0;
    for (var i = 0; i < n; i++) {
        A.push(getStrN(posAttr + nextAtr + 5, inp));
        // +1 is for the comma
        nextAtr += A[i].length + 1;
    }

    // Filling in Data
    var posData = inp.search("Data:");
    posData += 5;
    var nextData = 0;
    for (var i = 0; i < nP; i++) {
        names[i] = getStrN(posData + nextData, inp);
        namesO[i] = names[i];
        nextData += names[i].length + 1;
        arr[i] = new Array(n);
        for (var j = 0; j < n; j++) {
            arr[i][j] = getNum(posData + nextData, inp);
            nextData += numDig(arr[i][j]) + 1;
        }
        nextData += 1;
    }

    var t = document.getElementById('NTeam').value;
    makeTeam(t);
}


function startUpload() {
    var s = document.getElementById("ImportDataBox").value;
    uploadData(s);
}