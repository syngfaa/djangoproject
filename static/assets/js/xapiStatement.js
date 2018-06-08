var conf = {
    "endpoint": "https://cloud.scorm.com/ScormEngineInterface/TCAPI/5ADOB8DV14/",
    "auth": "Basic " + toBase64("5ADOB8DV14:fmkYNz372m3DlwRznojaMXBWD7IHY0koNZRKjM3r")
};
ADL.XAPIWrapper.changeConfig(conf);
var verblist = [];
var total = 0;
var vid = document.getElementById("mediaPlayer");
var d = new Date("2018-04-25T02:12:00");

$('#sindsDatum').val("2018-04-25T12:00:00");
// var d = $('#sindsDatum').val();


document.getElementById("sindsDatum").addEventListener("change", function() {
    var input = this.value;
    d = new Date(input);
    console.log(input); //e.g. 2015-11-13
    console.log(d); //e.g. Fri Nov 13 2015 00:00:00 GMT+0000 (GMT Standard Time)
});


$(document).ready(function () {
    // this sets up the Variable "Vid" to point to the video player  
    // so we can interact with it.  

    // When the user hits Play...  
    vid.onplay = function () {
        console.log("onplay event");
        playFrom = (vid.currentTime).toFixed(2);
    }; // End onPlay()

    //Oude functie dat bij play een statement verstuurd
    //     vid.onplay = function() {  
    //send_statement(userEmail, userFirst,userLast, 'https://w3id.org/xapi/video/verbs/played', 'played','http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4', 'BigBuckBunny', 'Dit is een voorbeeldfilmpje dat een xAPI statement naar de Learning Record Store (LRS)');
    //}; // End onPlay()  

    // oude functie dat bij pauze een statement verstuurd
    //     vid.onpause = function() {  
    //send_statement(userEmail, userFirst,userLast, 'https://w3id.org/xapi/video/verbs/played', 'paused','http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4', 'BigBuckBunny', 'Dit is een voorbeeldfilmpje dat een xAPI statement naar de Learning Record Store (LRS)'); 
    //}; // End onPause()  

    // wanneer er gepauzeerd word pakt hij playFrom en huidige tijd met vid.currentTime en zet dit als een extension van de statement 
    vid.onpause = function () {
        console.log("The user has paused the video");
        send_statementWithExtension(userEmail, userFirst, userLast, 'https://w3id.org/xapi/video/verbs/paused', 'paused', 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4', 'BigBuckBunny', 'Dit is een voorbeeldfilmpje dat een xAPI statement naar de Learning Record Store (LRS)', playFrom);
    }; // End onPause()  

    // When the video completes  
    vid.onended = function () {
        send_statement(userEmail, userFirst, userLast, 'http://adlnet.gov/expapi/verbs/completed', 'completed', 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4', 'BigBuckBunny', 'Dit is een voorbeeldfilmpje dat een xAPI statement naar de Learning Record Store (LRS)');
    }; // End onEnded() 

    // statements laden
    // $("#showStatements").click(function () {
    //     ADL.XAPIWrapper.getStatements(null, null,
    //         function getMore(r) {
    //             var res = JSON.parse(r.response);
    //             var stmts = res.statements;
    //             total = stmts.length;
    //             stmts.reduce(getVerbs, verblist);
    //             updateUI(verblist);
    //             addStmtsToUI(stringifyStatements(stmts));
    //             if (res.more && res.more !== "") {
    //                 ADL.XAPIWrapper.getStatements(null, res.more, getMore);
    //             }
    //         });
    // });

    $("#showStatements").click(function () {
        get_statements();
    });
    $("#hideStatements").click(function () {
        //var select = document.getElementById('content');
        //var select2 = document.getElementById('verbs');
        // select.lastChild.textContent("");
        // select2.lastChild.textContent("");
        //    select.removeChild(select.lastChild);
    });
    // send statement from button
    $("#xapiStatementButton").click(function () {
        send_statement(userEmail, userFirst, userLast, 'http://adlnet.gov/expapi/verbs/interacted', 
        'interacted', 'http://example.com/Verzend_xAPI_statement', 'Verzend xAPI', 
        'Dit is een knop dat een xAPI statement naar de Learning Record Store (LRS)');
    });
});
function send_statement(userEmail, userFirstName, userLastName, verbId, 
    verbDisplay, objectId, objectName, objectDescription) {
    //define the xapi statement being sent  
    var statement = {
        "actor": {
            "mbox": "mailto:" + userEmail,
            "name": userFirstName + " " + userLastName,
            "objectType": "Agent"
        },
        "verb": {
            "id": verbId,
            "display": { "en-US": verbDisplay }
        },
        "object": {
            "id": objectId,
            "definition": {
                "name": { "en-US": objectName },
                "description": { "en-US": objectDescription }
            },
            "objectType": "Activity"
        },
    };
    //end statement definition  
    // Dispatch the statement to the LRS  
    var result = ADL.XAPIWrapper.sendStatement(statement);
}
function send_statementWithExtension(userEmail, userFirstName, userLastName, verbId, 
    verbDisplay, objectId, objectName, objectDescription, playFrom) {
    //define the xapi statement being sent  
    var statement = {
        "actor": {
            "mbox": "mailto:" + userEmail,
            "name": userFirstName + " " + userLastName,
            "objectType": "Agent"
        },
        "verb": {
            "id": verbId,
            "display": { "en-US": verbDisplay }
        },
        "object": {
            "id": objectId,
            "definition": {
                "name": { "en-US": objectName },
                "description": { "en-US": objectDescription }
            },
            "objectType": "Activity"
        },

        "result": {
            "extensions": {
                "http://example.com/xapi/period_start": playFrom,
                "http://example.com/xapi/period_end": (vid.currentTime).toFixed(2)
            }
        },
    };}
    //end statement definition  
    // Dispatch the statement to the LRS  
    // var result = ADL.XAPIWrapper.sendStatement(statement);
// }
// function getVerbs(val, cur) {
//     var verb = cur.verb.id;
//     if (!val.includes(verb)) val.push(verb);
//     return val;
// }
// function stringifyStatements(stmts) {
//     var strings = [];
//     for (var idx in stmts) {
//         var stmt = stmts[idx];
//         var actor = "";
//         if (stmt.actor.name) actor = stmt.actor.name;
//         else if (stmt.actor.mbox) actor = stmt.actor.mbox;
//         else if (stmt.actor.openid) actor = stmt.actor.openid;
//         else if (stmt.actor.account && stmt.actor.account.name) actor = stmt.actor.account.name;
//         else actor = "unknown";
//         var verb = stmt.verb.id;
//         if (stmt.verb.display) {
//             if (stmt.verb.display['en']) verb = stmt.verb.display['en'];
//             else if (stmt.verb.display['en-US']) verb = stmt.verb.display['en-US'];
//         }
//         var activity = stmt.object.id;
//         if (stmt.object.definition && stmt.object.definition.name) {
//             if (stmt.object.definition.name['en']) activity = stmt.object.definition.name['en'];
//             else if (stmt.object.definition.name['en-US']) activity = stmt.object.definition.name['en-US'];
//         }
//         strings.push(actor + " " + verb + " " + activity);
//     }
//     return strings;
// }
// function addStmtsToUI(strings) {
//     var newp = document.createElement('p');
//     for (var idx in strings) {
//         newp.innerHTML = strings.join('<br>');
//     }
//     var select = document.getElementById('content');
//     select.removeChild(select.lastChild);
//     document.getElementById('content').appendChild(newp);
// }
// function updateUI(verblist) {
//     var countUI = document.getElementById('count');
//     countUI.innerHTML = verblist.length + " unique verbs in " + total + " statements";
//     document.getElementById('verbs').innerHTML = verblist.join('<br>');

function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  }

function get_statements() {

    var conf = {
        "endpoint": "https://cloud.scorm.com/ScormEngineInterface/TCAPI/5ADOB8DV14/",
        "auth": "Basic " + toBase64("5ADOB8DV14:fmkYNz372m3DlwRznojaMXBWD7IHY0koNZRKjM3r")
    };
    ADL.XAPIWrapper.changeConfig(conf);

    var myparams = ADL.XAPIWrapper.searchParams();
    myparams.since = d.toISOString();
    myparams.verb = 'https://w3id.org/xapi/video/verbs/paused';
    myparams.activity = 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4';
    myparams.agent = '{"mbox": "mailto:syngfaa@gmail.com"}';
    var ret = ADL.XAPIWrapper.getStatements(myparams);

    var txt = " ";
    if (ret) {
        for (i = 0; i < ret.statements.length; i++) {
            var date = parseISOString(ret.statements[i].timestamp);
            var email = ret.statements[i].actor.mbox;
            var address = email.split('mailto:')[1];
            var stmt = "xAPI statement " + (i+1) + ":<br>" +
                ret.statements[i].actor.name.bold() + " " + 
                "("+address.bold() + ") " +
                ret.statements[i].verb.display["en-US"].bold() + " de video " +
                ret.statements[i].object.definition.name["en-US"].bold() + " waarbij video is gestart op: " +
                ret.statements[i].result.extensions["http://example.com/xapi/period_start"].bold() +
                " en gepauzeerd op: " + ret.statements[i].result.extensions["http://example.com/xapi/period_end"].bold() + "         <br>" +
                "xAPI statement gegenereerd op " + date.toString().bold() + "<br><br>";
            txt += stmt;
        }
        document.getElementById("results").innerHTML = txt;

        console.log(txt);
    }
}




