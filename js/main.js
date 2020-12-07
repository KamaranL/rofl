const cards = {
  ringOfFireLite: {
    values: {
      1: "<div class=\"text-center header-value\">Waterfall</div>Everyone should keep drinking until the person who picked the card stops.",
      2: "<div class=\"text-center header-value\">You</div>You pick someone that has to drink.",
      3: "<div class=\"text-center header-value\">Me</div>You must drink.",
      4: "<div class=\"text-center header-value\">Whores</div>All girls must drink.",
      5: "<div class=\"text-center header-value\">Thumb Master</div>When you put your thumb on the table, everyone must follow and whomever is last must drink. You are thumb master until someone else gets this number.",
      6: "<div class=\"text-center header-value\">Dicks</div>All guys must drink.",
      7: "<div class=\"text-center header-value\">Heaven</div>Point your finger to the sky, whoever is last must drink.",
      8: "<div class=\"text-center header-value\">Mate</div>Pick someone to drink with you. He/She is now your drinking buddy and must always drink when you drink.",
      9: "<div class=\"text-center header-value\">Rhyme</div>Pick a word, such as fog, and as you go through the circle of players, everyone has to say a word that rhymes with fog, until someone messes up. Whoever messes up will have to drink.",
      10: "<div class=\"text-center header-value\">Categories</div>Pick a category, such as cereal brands, and as you go through the circle of players, everyone has to name a brand of cereal, until someone messes up.  Whoever messes up will have to drink.",
      J:
        "<div class=\"text-center header-value\">Make a Rule</div>You can make up any rule, within reason, that everyone has to follow- including yourself. Whoever disobeys this rule must drink.",
      K:
        "<div class=\"text-center header-value\">Pour!</div>Pour any amount of your drink into a cup or glass and set it in the middle of the table. Whoever draws the 4th King, must drink the entire concoction that is in the cup.",
      Q:
        "<div class=\"text-center header-value\">Questions</div>Go through the circle of players asking the player next in the circle a question. It does not matter what the question is, first person to not answer or to not ask a question must drink.",
    },
    kingCount: function () {
      let current = {};

      if (game.current() === null) {
        current.kingCount = 1;
      } else {
        current.kingCount = game.current().kingCount + 1;

        if (current.kingCount == 4) {
          alert("Drink UP! This is the 4th king that has been pulled this round.\r\n\r\nThis counter will now reset.");
          current.kingCount = 0;
        }
      }

      data.storage.set("current", current);
    },
    pickCard: function () {
      let randomIndex = Math.floor(Math.random() * Object.keys(cards.ringOfFireLite.values).length);

      return Object.entries(cards.ringOfFireLite.values)[randomIndex];
    },
  },
};

const data = {
  storage: {
    delete: function (key) {
      localStorage.removeItem(key);
    },
    get: function (key) {
      return JSON.parse(localStorage.getItem(key));
    },
    set: function (key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
  },
};

const game = {
  checkScreenSize: function () {
    let bod, small;

    if (document.documentElement.clientWidth < 240) {
      bod = document.getElementsByTagName("body")[0]
      bod.innerHTML = "";
      bod.setAttribute("class", "text-center");
      small = document.createElement("small");
      small.setAttribute("class", "validate");
      small.innerHTML = "This site requires you use a screen that has a minimum width of 240px.";
      bod.appendChild(small);
      return false;
    } else {
      return true;
    }
  },
  current: () => {
    return data.storage.get("current");
  },
  load: function () {
    if (game.checkScreenSize()) {
      game.turn();
    }
  },
  next: function () {
    game.turn();
  },
  playCard: function () {
    let card,
      value = document.getElementById("card-value"),
      description = document.getElementById("card-description");

    card = cards.ringOfFireLite.pickCard();

    value.innerHTML = card[0];
    description.innerHTML = card[1];

    return card;
  },
  reset: function () {
    if (
      confirm(
        "Resetting the game will clear the amount of kings that have been played this round.\r\n\r\nAre you sure you want to do this?"
      )
    ) {
      localStorage.clear();
      game.turn();
    }
  },
  turn: function () {
    let value = game.playCard()[0];

    if (value == "K") {
      cards.ringOfFireLite.kingCount();
    }
  },
};

