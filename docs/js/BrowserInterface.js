/**
 * Author: Maximo Mena
 * GitHub: mmenavas
 * Twitter: @menamaximo
 * Project: Memory Workout
 * Description: The game interface
 */

/**
 * @TODO Refactor code.
 */
(function($) {

  /************ Start hard coded settings ******************/

  // How long a non matching card is displayed once clicked.
  var nonMatchingCardTime = 1000;

  // Shuffle card images: How many different images are available to shuffle
  // from?
  var imagesAvailable = 15;

  /************ End hard coded settings ******************/

  // Handle clicking on settings icon
  var settings = document.getElementById('pairport--settings-icon');
  var modal = document.getElementById('pairport--settings-modal');
  var handleOpenSettings = function (event) {
    event.preventDefault();
    modal.classList.toggle('show');
  };
  settings.addEventListener('click', handleOpenSettings);

  // Handle settings form submission
  var reset = document.getElementById('pairport--settings-reset');
  var handleSettingsSubmission = function (event) {
    event.preventDefault();

    var selectWidget = document.getElementById("pairport--settings-grid").valueOf();
    var grid = selectWidget.options[selectWidget.selectedIndex].value;
    var gridValues = grid.split('x');
    var cards = $.initialize(Number(gridValues[0]), Number(gridValues[1]), imagesAvailable);

    if (cards) {
      document.getElementById('pairport--settings-modal').classList.remove('show');
      document.getElementById('pairport--end-game-modal').classList.remove('show');
      document.getElementById('pairport--end-game-message').innerText = "";
      document.getElementById('pairport--end-game-score').innerText = "";
      buildLayout($.cards, $.settings.rows, $.settings.columns);
    }

  };
  reset.addEventListener('click', handleSettingsSubmission);

  // Handle clicking on card
  var handleFlipCard = function (event) {

    event.preventDefault();

    var status = $.play(this.index);
    console.log(status);

    if (status.code != 0 ) {
      this.classList.toggle('clicked');
    }

    if (status.code == 3 ) {
      setTimeout(function () {
        var childNodes = document.getElementById('pairport--cards').childNodes;
        childNodes[status.args[0]].classList.remove('clicked');
        childNodes[status.args[1]].classList.remove('clicked');
      }.bind(status), nonMatchingCardTime);
    }
    else if (status.code == 4) {
      var score = parseInt((($.attempts - $.mistakes) / $.attempts) * 100, 10);
      var message = getEndGameMessage(score);

      document.getElementById('pairport--end-game-message').textContent = message;
      document.getElementById('pairport--end-game-score').textContent =
          'Score: ' + score + ' / 100';

      document.getElementById("pairport--end-game-modal").classList.toggle('show');
    }

  };

  var getEndGameMessage = function(score) {
    var message = "";

    if (score == 100) {
      message = "Amazing job!"
    }
    else if (score >= 70 ) {
      message = "Great job!"
    }
    else if (score >= 50) {
      message = "Great job!"
    }
    else {
      message = "You can do better.";
    }

    return message;
  }

  // Build grid of cards
  var buildLayout = function (cards, rows, columns) {
    if (!cards.length) {
      return;
    }

    var pairportCards = document.getElementById("pairport--cards");
    var index = 0;

    var cardMaxWidth = document.getElementById('pairport--app-container').offsetWidth / columns;
    var cardHeightForMaxWidth = cardMaxWidth * (3 / 4);

    var cardMaxHeight = document.getElementById('pairport--app-container').offsetHeight / rows;
    var cardWidthForMaxHeight = cardMaxHeight * (4 / 3);

    // Clean up. Remove all child nodes and card clicking event listeners.
    while (pairportCards.firstChild) {
      pairportCards.firstChild.removeEventListener('click', handleFlipCard);
      pairportCards.removeChild(pairportCards.firstChild);
    }

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        // Use cloneNode(true) otherwise only one node is appended
        pairportCards.appendChild(buildCardNode(index, cards[index],
          (100 / columns) + "%", (100 / rows) + "%"));
        index++;
      }
    }

    // Resize cards to fit in viewport
    if (cardMaxHeight > cardHeightForMaxWidth) {
      // Update height
      pairportCards.style.height = (cardHeightForMaxWidth * rows) + "px";
      pairportCards.style.width = document.getElementById('pairport--app-container').offsetWidth + "px";
      pairportCards.style.top = ((cardMaxHeight * rows - (cardHeightForMaxWidth * rows)) / 2) + "px";
    }
    else {
      // Update Width
      pairportCards.style.width = (cardWidthForMaxHeight * columns) + "px";
      pairportCards.style.height = document.getElementById('pairport--app-container').offsetHeight + "px";
      pairportCards.style.top = 0;
    }

  };

  // Update on resize
  window.addEventListener('resize', function() {
    buildLayout($.cards, $.settings.rows, $.settings.columns);
  }, true);

  // Build single card
  var buildCardNode = function (index, card, width, height) {
    var flipContainer = document.createElement("li");
    var flipper = document.createElement("div");
    var front = document.createElement("a");
    var back = document.createElement("a");

    flipContainer.index = index;
    flipContainer.style.width = width;
    flipContainer.style.height = height;
    flipContainer.classList.add("flip-container");
    if (card.isRevealed) {
      flipContainer.classList.add("clicked");
    }

    flipper.classList.add("flipper");
    front.classList.add("front");
    front.setAttribute("href", "#");
    back.classList.add("back");
    back.classList.add("card-" + card.value);
    if (card.isMatchingCard) {
      back.classList.add("matching");
    }
    back.setAttribute("href", "#");

    flipper.appendChild(front);
    flipper.appendChild(back);
    flipContainer.appendChild(flipper);

    flipContainer.addEventListener('click', handleFlipCard);

    return flipContainer;
  };

})(PairPort);
