var model = {
    answer: "",
    answerToggle: false,
    needsReset: false,
    petitionText: "Please dark lord answer the following question",
};

var controller = {
    init: () => {
        view.init();
    },

    keyDown: (e) => {
    const len = view.getPetitionLength();

    if (len >= model.petitionText.length) {
        return false;
    }        
        if (e.key === ".") {
            // Period is the secret key
            model.answerToggle = !model.answerToggle;
            document.getElementById("petition").value +=
                model.petitionText[len];
            return false;
        } else if (e.key.length === 1 && model.answerToggle) {
            // If it's a character and in answer mode
            model.answer += e.key;
            document.getElementById("petition").value +=
                model.petitionText[len];
            console.log(model.answer);
            return false;
        } else if (e.key === "Backspace" && model.answerToggle) {
            // If it's a backspace
            model.answer = model.answer.slice(0, -1);
        }
    },
    getResetStatus: () => {
        return model.needsReset;
    },
    getPetitionChar: () => {
        const len = view.getPetitionLength();
        return len <= model.petitionText.length ? model.petitionText[len - 1] : ' ';
    },

    },
    getAnswer: () => {
        const invalidResponse = [
            "The darkness does not respond to your call.",
            "Invalid summoning. Try again with caution.",
            "Your incantation lacks power. Retry.",
            "Why should I answer to you?",
            "The veil is thick tonight. Seek answers elsewhere.",
            "I'm occupied. Disturb me later.",
            "The shadows remain silent. You must persist.",
            "Your petition is weak. Strengthen it.",
        ];
        const invalidQuestion = "Please ask a valid question.";
        model.needsReset = true;

        if (!view.getQuestion()) {
            // Valid Question check
            return invalidQuestion;
        } else if (model.answer) {
            // Valid Petition check
            return "The Dark Oracle whispers: " + model.answer;
        } else {
            // Invalid Response
            let randomNum = Math.floor(Math.random() * invalidResponse.length);
            return invalidResponse[randomNum];
        }
    },
    reset: () => {
        model.answer = "";
        model.answerToggle = false;
        model.needsReset = false;
        view.resetUi();
    },
};

var view = {
    init: () => {
        document.getElementById("answerButton").addEventListener("click", () => {
            view.renderAnswer();
        });
        document.getElementById("resetButton").addEventListener(
            "click",
            controller.reset
        );
        document.getElementById("petition").onkeydown = (event) => {
            if (document.getElementById("petition").value == "") {
                controller.reset();
            }
            return controller.keyDown(event);
        };
        document.getElementById("question").onkeydown = (event) => {
            switch (event.key) {
                case "?":
                    view.renderAnswer();
                    break;
                case "Enter":
                    if (
                        !document
                            .getElementById("question")
                            .value.includes("?")
                    ) {
                        document.getElementById("question").value += "?";
                    }
                    view.renderAnswer();
                    break;
            }
        };
        document.getElementById("petition").onfocus = () => {
            if (controller.getResetStatus()) {
                controller.reset();
            }
        };
    },
    getInputText: () => {
        return document.getElementById("petition").value;
    },
    getPetitionLength: () => {
        return document.getElementById("petition").value.length;
    },
    getQuestion: () => {
        return document.getElementById("question").value;
    },
    renderAnswer: () => {
        document.getElementById("answer").innerHTML = controller.getAnswer();
        view.loadingBar();
        view.disableQuestion();
        view.clearPetition();
    },
    showAnswer: () => {
        document.getElementById("answer").style.display = "block";
    },
    hideAnswer: () => {
        document.getElementById("answer").style.display = "none";
    },
    resetUi: () => {
        view.clearPetition();
        view.clearQuestion();
        view.clearAnswer();
        view.enableQuestion();
        view.hideAnswer();
    },
    clearPetition: () => {
        document.getElementById("petition").value = "";
    },
    clearQuestion: () => {
        document.getElementById("question").value = "";
    },
    clearAnswer: () => {
        document.getElementById("answer").innerHTML = "";
    },
    disableQuestion: () => {
        document.getElementById("question").disabled = true;
    },
    enableQuestion: () => {
        document.getElementById("question").disabled = false;
    },
    loadingBar: () => {
        var bar = document.getElementById("loading");
        var barInside = document.getElementById("loading-inside");
        var progress = 0;
        var interval = setInterval(incr, 10 /*randominterval*/);
        console.log("button  clicked");
        bar.style.display = "block";

        function incr() {
            console.log("test");
            if (progress >= 100) {
                bar.style.display = "none";
                view.showAnswer();
                clearInterval(interval);
            } else {
                progress += 1;
                barInside.style.width = progress + "%";
            }
        }
    },
};

controller.init();
