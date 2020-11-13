const actions = {
  fadeOut: function (element, time) {
    let delay = time * 1000;

    setTimeout(() => {
      element.style.opacity = 0;
    }, delay);
  },
  hide: function (id) {
    document.getElementById(id).style.display = "none";
  },
  overlay: {
    open: function (id) {
      document.getElementById(id).style.display = "block";
    },
    openSide: function (id) {
      document.getElementById(id).style.width = "100%";
    },
    openTop: function (id) {
      document.getElementById(id).style.height = "100%";
    },
    close: function (id) {
      document.getElementById(id).style.display = "none";
    },
    closeSide: function (id) {
      document.getElementById(id).style.width = "0%";
    },
    closeTop: function (id) {
      document.getElementById(id).style.height = "0%";
    },
  },
  popup: {
    close: function (id) {
      document.getElementById(id).style.visibility = "hidden";
      document.getElementById("popup-overlay").style.display = "none";
    },
    open: function (id) {
      document.getElementById(id).style.visibility = "visible";
      document.getElementById("popup-overlay").style.display = "block";
    },
  },
  show: function (id) {
    document.getElementById(id).style.display = "block";
  },
  validate: function (element, id, message) {
    let notification = document.createElement("span");

    notification.id = id;
    notification.innerHTML = `${message} <br />`;
    if (document.querySelectorAll(`#${id}`).length < 1) {
      element.appendChild(notification);
      actions.fadeOut(notification, 2);
      setTimeout(() => {
        element.removeChild(notification);
      }, 2750);
    }
  },
};

const cards = {
  ringOfFireLite: {
    values: {
      1: "Waterfall &mdash; Everyone should keep drinking until the person who picked the card stops.",
      2: "You &mdash; You pick someone that has to drink.",
      3: "Me &mdash; You must drink.",
      4: "Whores &mdash; All girls must drink.",
      5: "Thumb Master &mdash; When you put your thumb on the table, everyone must follow and whomever is last must drink. You are thumb master until someone else gets this number.",
      6: "Dicks &mdash; All guys must drink.",
      7: "Heaven &mdash; Point your finger to the sky, whoever is last must drink.",
      8: "Mate &mdash; Pick someone to drink with you. He/She is now your drinking buddy and must always drink when you drink.",
      9: "Rhyme &mdash; Pick a word, such as fog, and as you go through the circle of players, everyone has to say a word that rhymes with fog, until someone messes up. Whoever messes up will have to drink.",
      10: "Categories &mdash; Pick a category, such as cereal brands, and as you go through the circle of players, everyone has to name a brand of cereal, until someone messes up.  Whoever messes up will have to drink.",
      J:
        "Make a Rule &mdash; You can make up any rule, within reason, that everyone has to follow- including yourself. Whoever disobeys this rule must drink.",
      K:
        "Pour! &mdash; Pour any amount of your drink into a cup or glass and set it in the middle of the table. Whoever draws the 4th King, must drink the entire concoction that is in the cup.",
      Q:
        "Questions &mdash; Go through the circle of players asking the player next in the circle a question. It does not matter what the question is, first person to not answer or to not ask a question must drink.",
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
  confirmChallenge: function (response) {
    if (response == "yes") {
      game.updateScore();
      game.turn();
    } else if (response == "no") {
      game.turn();
    }
  },
  current: () => {
    return data.storage.get("current");
  },
  hasPlayers: function () {
    if (game.players() !== null) {
      player.indexAll(game.players());

      return Object.keys(game.players()).length <= 1 ? false : true;
    }
  },
  hasSelection: function () {
    if (game.settings() !== null) {
      return game.settings().game !== undefined ? true : false;
    }
  },
  load: function () {
    if (game.checkScreenSize()) {
      if (!game.hasSelection()) {
        game.pregame();
      } else {
        if (game.settings().game == "tip-it-back" && !game.hasPlayers()) {
          game.pregame();
        } else {
          actions.overlay.close("form-pregame");
          game.turn();
        }
      }
    }
    /* functionality to implement */
    // actions - fill up cup
    // return true; // debug
  },
  menu: function () {
    if (
      confirm(
        "Returning to the main menu will clear ALL game data (including scores AND players) and you will have to start your game over.\r\n\r\nAre you sure you want to do this?"
      )
    ) {
      actions.overlay.closeSide("form-settings");
      localStorage.clear();
      game.pregame();
    }
  },
  next: function () {
    if (game.settings().game == "tip-it-back") {
      actions.popup.open("popup-confirm-challenge");
    } else if (game.settings().game == "ring-of-fire-lite") {
      game.turn();
    }
  },
  pickGame: function () {
    let settings = {},
      valid = document.getElementById("game-validate");

    if (game.rofl.checked) {
      game.selection = "ring-of-fire-lite";
    } else if (game.tib.checked) {
      game.selection = "tip-it-back";
      settings.difficulty = "";
    } else {
      actions.validate(valid, "validate-game", "**You must select a game.");
    }

    settings.theme = "light";
    settings.game = game.selection;
    data.storage.set("settings", settings);
  },
  players: () => {
    return data.storage.get("players");
  },
  playCard: function () {
    let card,
      value = document.getElementById("card-value"),
      description = document.getElementById("card-description");

    if (game.settings().game == "ring-of-fire-lite") {
      card = cards.ringOfFireLite.pickCard();
    } else if (game.settings().game == "tip-it-back") {
      if (game.settings().difficulty == "easy") {
        card = cards.tipItBack.pickCard("easy");
      } else if (game.settings().difficulty == "hard") {
        card = cards.tipItBack.pickCard("hard");
      } else if (game.settings().difficulty == "spicy") {
        card = cards.tipItBack.pickCard("spicy");
      } else {
        card = cards.tipItBack.pickCard();
      }
    }

    value.innerHTML = card[0];
    description.innerHTML = card[1];
    if (game.settings().game == "tip-it-back") description.innerHTML += ", or take a drink.";

    return card;
  },
  pregame: function () {
    actions.overlay.open("form-pregame");
    if (game.rofl.checked) {
      actions.hide("add-players");
      actions.hide("button-reset-players");
    }
    if (game.tib.checked) {
      actions.show("add-players");
      actions.show("button-reset-players");
    }
  },
  settings: () => {
    return data.storage.get("settings");
  },
  submitPregame: function () {
    let start = false;
    game.pickGame();
    if (game.selection == "tip-it-back") {
      if (player.array.length > 1) {
        player.storeAll();
        actions.overlay.close("form-pregame");
        start = true;
      } else {
        actions.validate(player.valid, "validate-store", "**You need more players in order to play.");
      }
    } else {
      actions.overlay.close("form-pregame");
      start = true;
    }

    if (start) game.turn();
  },
  stats: function () {
    // populate game stats and current player stats
  },
  turn: function () {
    let value = game.playCard()[0];

    if (game.settings().game == "ring-of-fire-lite") {
      if (document.getElementById("card-player").style.display != "none") actions.hide("card-player");
      if (document.getElementById("difficulty-setting").style.display != "none") actions.hide("difficulty-setting");
      if (value == "K") {
        cards.ringOfFireLite.kingCount();
      }
    }
    if (game.settings().game == "tip-it-back") {
      if (document.getElementById("card-player").style.display != "block") actions.show("card-player");
      if (document.getElementById("difficulty-setting").style.display != "block") actions.show("difficulty-setting");
      game.updateCurrent();
    }
  },
  updateCurrent: function () {
    let i,
      current = {},
      playerCount = Object.keys(game.players()).length,
      player = document.getElementById("card-player"),
      value = document.getElementById("card-value"),
      description = document.getElementById("card-description");

    current.card = {
      value: parseInt(value.innerText),
      description: description.innerText,
    };
    if (game.current().player !== undefined) {
      i = game.current().player.id + 1;
      if (i == playerCount) i = 0;
      current.player = game.players()[i];
    }
    if (game.current().turn !== undefined) {
      current.turn = game.current().turn + 1;
      if (current.turn % (playerCount * 4) == 0) alert("SHOTS! Everybody take a shot before continuing.");
    } else {
      current.turn = 1;
    }

    data.storage.set("current", current);
    player.innerHTML = current.player.name.charAt(0).toUpperCase() + current.player.name.slice(1);
  },
  updateScore: function () {
    let card, current, player, players;

    current = game.current();
    players = game.players();
    card = current.card;
    player = current.player;
    players[player.id].score += parseInt(card.value);
    data.storage.set("players", players);
  },
};

const player = {
  array: [],
  list: document.getElementById("player-list"),
  name: document.getElementById("player-name"),
  valid: document.getElementById("player-validate"),
  add: function () {
    if (player.name.value == "") {
      actions.validate(player.valid, "validate-add", "**Cannot leave form blank.");
    } else {
      player.array.push(player.name.value);
      for (let i = 0; i < player.array.length; i++) {
        let deleteButton = `<button type="button" class="badge badge-danger" onclick="player.delete(this.value);" value="${i}">&times;</button>`;
        if (i > 0) {
          player.list.innerHTML += `<span id="player-id_${i}">${deleteButton} &nbsp; ${player.array[i]} <br /></span>`;
        } else {
          player.list.innerHTML = `<span id="player-id_${i}">${deleteButton} &nbsp; ${player.array[i]} <br /></span>`;
        }
      }

      player.name.value = "";
      player.name.focus();
      player.name.select();
    }
  },
  delete: function (id) {
    let last = player.array.length - 1,
      oldPlayer = document.getElementById(`player-id_${id}`),
      newPlayer = document.getElementById(`player-id_${last}`);

    oldPlayer.remove();
    [player.array[id], player.array[last]] = [player.array[last], player.array[id]];
    newPlayer.id = `player-id_${id}`;
    newPlayer.firstElementChild.value = id;
    player.array.pop();
    if (player.array.length < 1) {
      player.list.innerHTML = "Player list empty. Add players to play.";
    }
  },
  deleteAll: function () {
    data.storage.delete("players");
  },
  indexAll: function (obj) {
    for (let i = 0; i < Object.keys(obj).length; i++) {
      player.array.push(obj[i].name);
      let deleteButton = `<button type="button" class="badge badge-danger" onclick="player.delete(this.value);" value="${i}">&times;</button>`;

      if (i > 0) {
        player.list.innerHTML += `<span id="player-id_${i}">${deleteButton} &nbsp; ${obj[i].name} <br /></span>`;
      } else {
        player.list.innerHTML = `<span id="player-id_${i}">${deleteButton} &nbsp; ${obj[i].name} <br /></span>`;
      }
    }
  },
  reset: function () {
    if (player.array.length < 1) {
      actions.validate(player.valid, "validate-reset", "**There is nothing to reset.");
    } else {
      player.list.innerHTML = "Player list reset. Add players to play.";
      player.array = [];
    }
  },
  storeAll: function () {
    if (player.array.length <= 1) {
      actions.validate(player.valid, "validate-store", "**You need more players in order to play.");
    } else {
      let players = {};

      for (let i = 0; i < player.array.length; i++) {
        players[i] = {
          id: i,
          name: player.array[i],
          score: 0,
        };
      }

      let current = {
        player: players[0],
      };

      data.storage.set("players", players);
      data.storage.set("current", current);
    }
  },
};

const settings = {
  difficulty () {
    return game.settings().difficulty;
  },
  display: function () {
    // add "selected" to settings
  },
  save: function () {
    //  save settings
  },
};
