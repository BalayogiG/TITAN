
let bgpage = chrome.extension.getBackgroundPage();
let sentence = bgpage.word;
detectCyberbullying(sentence);
var p = document.createElement('P');
p.innerText = sentence;
document.body.appendChild(p);


function detectCyberbullying(sentence) {
    let entry=  {
        'sentence': sentence
    }

    fetch(`http://localhost:8000/DetectCyberbullying`, {
        method: "POST",
        body: JSON.stringify(entry),
        cache:"no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
    .then(function(response){
        if(response.status !== 200){
            console.log(`Response status was not 200: ${response.status}`);
            return ;
        }

        response.json().then(function (data){
            const metrics = JSON.parse(data);
            console.log(data);
            AlertAudio(data);
        })  
    })
}

function AlertAudio(values){
    dataValues = JSON.parse(values);
    labels = dataValues['labels'];
    metrics = dataValues['metrics'];
    var pos = new Audio("alertSounds/positive.wav");
    
    var max = metrics.reduce(function(a, b) {
        return Math.max(a, b);
    }, 0);
    
    if (max > 0.5){
        Display(values);
        let index = metrics.indexOf(max);
        let label_index = labels[index];

        var msg = new SpeechSynthesisUtterance();
        msg.text = "Cyberbullying detected";
        window.speechSynthesis.speak(msg);

        if (label_index === "INSULT"){
            var msg = new SpeechSynthesisUtterance();
            msg.text = "Insult level is".concat(max.toString());
            window.speechSynthesis.speak(msg);
        }

        if (label_index === "TOXICITY"){
            var msg = new SpeechSynthesisUtterance();
            msg.text = "Toxicity level is".concat(max.toString());
            window.speechSynthesis.speak(msg);
        }

        if (label_index === "SEVERE_TOXICITY"){
            var msg = new SpeechSynthesisUtterance();
            msg.text = "Severe toxicity level is".concat(max.toString());
            window.speechSynthesis.speak(msg);
        }

        if (label_index === "PROFANITY"){
            var msg = new SpeechSynthesisUtterance();
            msg.text = "Profanity level is".concat(max.toString());
            window.speechSynthesis.speak(msg);
        }

        if (label_index === "IDENTITY_ATTACK"){
            var msg = new SpeechSynthesisUtterance();
            msg.text = "Identity attack level is".concat(max.toString());
            window.speechSynthesis.speak(msg);
        }

        if (label_index === "THREAT"){
            var msg = new SpeechSynthesisUtterance();
            msg.text = "Threat level is".concat(max.toString());
            window.speechSynthesis.speak(msg);
        }
    }
    else{
        display_clear_image();
        var msg = new SpeechSynthesisUtterance();
        msg.text = "No cyberbullying found";
        window.speechSynthesis.speak(msg);
    }
}

function display_clear_image(){
    var img = document.createElement('img');
    img.src = "https://img.picturequotes.com/2/585/584939/no-cyberbullying-quote-1-picture-quote-1.png";
    document.body.appendChild(img);
}

function Display(values){
    dataValues = JSON.parse(values);
    console.log(dataValues['labels']);
    console.log(dataValues['metrics']);
    new Chart(document.getElementById("bar-chart-horizontal"), {
        type: 'bar',
        data: {
          labels: [dataValues['labels'][0], dataValues['labels'][1], dataValues['labels'][2], dataValues['labels'][3], dataValues['labels'][4],dataValues['labels'][5]],
          datasets: [
            {
                label: [],
                backgroundColor: ["#FF5733","#F0FF33","#71FF33","#33FFE6","#334FFF","#FF33A8"],
                data: [dataValues['metrics'][0],dataValues['metrics'][1],dataValues['metrics'][2],dataValues['metrics'][3],dataValues['metrics'][4],dataValues['metrics'][5]]
            }
          ]
        },
        options: {
          legend: { display: false},
          title: {
            display: false,
            text: 'Cyberbullying detection and Alert'
          }
        }
    });
}