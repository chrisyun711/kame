function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.sharingContainer = document.querySelector(".score-sharing");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continue = function () {
  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "restart");
  }

  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var text = = document.createElement("div");
  inner.classList.add("tile-inner");
    switch (tile.value) {
    case 2:
      inner.textContent = "龙少";
      break;
    case 4:
      inner.textContent = "修几";
      break;
    case 8:
      inner.textContent = "汪汪";
      break;
    case 16:
      inner.textContent = "幼芽";
      break;
    case 32:
      inner.textContent = "骆驼";
      break;
    case 64:
      inner.textContent = "农民";
      break;
    case 128:
      inner.textContent = "雫雫";
      break;
    case 256:
      inner.textContent = "医生";
      break;
    case 512:
      inner.textContent = "大树";
      break;
    case 1024:
      inner.textContent = "贝姆";
      break;
    case 2048:
      inner.textContent = "龙老师";
      break;
    case 4096:
      inner.textContent = "";
      break;
    }
  var self = this;
  var text2 = function (n) { var r = 0; while (n > 1) r++, n >>= 1; return r; }
  var inner     = document.createElement("div");
  var wrapper   = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = text[text2(tile.value)];

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var mytxt=new Array(11);  
  mytxt[0]="应该没有人会死在这里吧";
  mytxt[1]="应该没有人会死在这里吧！死在这里的一定是幼芽亲妈！"
  mytxt[2]="骆驼的Dior摸不到叻！";
  mytxt[3]="没有肉包子不开心";
  mytxt[4]="红酒配チョコ一口胖一斤";
  mytxt[5]="医生的功能磁共振排队哈长呀！";
  mytxt[6]="あ、俺俺、だから俺だよ";
  mytxt[7]="等不到情深深雨蒙蒙";
  mytxt[8]="窥伐到龙老师细哈耶则";
 

  var text3 = function (m) { var r = 0; while (m > 1) r++, m >>= 1; return r; }
  var type    = won ? "game-won" : "game-over";
  var message = won ? "龙老师帅吗？！！恭喜你！223个kiss from咩咩！！" : mytxt[text3(maxscore)-2];

  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "end", type, this.score);
  }

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;

  this.clearContainer(this.sharingContainer);
  this.sharingContainer.appendChild(this.scoreTweetButton());
  twttr.widgets.load();
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};

HTMLActuator.prototype.scoreTweetButton = function () {
  var tweet = document.createElement("a");
  tweet.classList.add("twitter-share-button");
  tweet.setAttribute("href", "https://twitter.com/share");
  tweet.setAttribute("data-via", "oprilzeng");
  tweet.setAttribute("data-url", "http://oprilzeng.github.io/2048");
  tweet.setAttribute("data-counturl", "http://oprilzeng.github.io/2048/");
  tweet.textContent = "Tweet";

  var text = "I scored " + this.score + " points at PRC2048, a game where you " +
             "join numbers to score high! #PRC2048";
  tweet.setAttribute("data-text", text);

  return tweet;
};
