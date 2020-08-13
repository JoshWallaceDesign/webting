"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var HoverButton = (function () {
  function HoverButton(el) {
    _classCallCheck(this, HoverButton);

    this.el = el;
    this.hover = false;
    this.calculatePosition();
    this.attachEventsListener();
  }

  HoverButton.prototype.attachEventsListener = function attachEventsListener() {
    var _this = this;

    window.addEventListener("mousemove", function (e) {
      return _this.onMouseMove(e);
    });
    window.addEventListener("resize", function (e) {
      return _this.calculatePosition(e);
    });
  };

  HoverButton.prototype.calculatePosition = function calculatePosition() {
    TweenMax.set(this.el, {
      x: 0,
      y: 0,
      scale: 1,
    });
    var box = this.el.getBoundingClientRect();
    this.x = box.left + box.width * 0.5;
    this.y = box.top + box.height * 0.5;
    this.width = box.width;
    this.height = box.height;
  };

  HoverButton.prototype.onMouseMove = function onMouseMove(e) {
    var hover = false;
    var hoverArea = this.hover ? 0.7 : 0.5;
    var x = e.clientX - this.x;
    var y = e.clientY - this.y;
    var distance = Math.sqrt(x * x + y * y);
    if (distance < this.width * hoverArea) {
      hover = true;
      if (!this.hover) {
        this.hover = true;
      }
      this.onHover(e.clientX, e.clientY);
    }

    if (!hover && this.hover) {
      this.onLeave();
      this.hover = false;
    }
  };

  HoverButton.prototype.onHover = function onHover(x, y) {
    TweenMax.to(this.el, 0.4, {
      x: (x - this.x) * 0.4,
      y: (y - this.y) * 0.4,
      scale: 1.15,
      ease: Power2.easeOut,
    });
    this.el.style.zIndex = 10;
  };

  HoverButton.prototype.onLeave = function onLeave() {
    TweenMax.to(this.el, 0.7, {
      x: 0,
      y: 0,
      scale: 1,
      ease: Elastic.easeOut.config(1.2, 0.4),
    });
    this.el.style.zIndex = 1;
  };

  return HoverButton;
})();

var btn1 = document.querySelector("li:nth-child(1)");
new HoverButton(btn1);

var btn2 = document.querySelector("li:nth-child(2)");
new HoverButton(btn2);

var btn3 = document.querySelector("li:nth-child(3)");
new HoverButton(btn3);

var btn3 = document.querySelector("li:nth-child(4)");
new HoverButton(btn3);
var btn3 = document.querySelector("li:nth-child(4)");
new HoverButton(btn3);

var element = $(".floating-chat");
var myStorage = localStorage;

if (!myStorage.getItem("chatID")) {
  myStorage.setItem("chatID", createUUID());
}

setTimeout(function () {
  element.addClass("enter");
}, 1000);

element.click(openElement);

function openElement() {
  var messages = element.find(".messages");
  var textInput = element.find(".text-box");
  element.find(">i").hide();
  element.addClass("expand");
  element.find(".chat").addClass("enter");
  var strLength = textInput.val().length * 2;
  textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
  element.off("click", openElement);
  element.find(".header button").click(closeElement);
  element.find("#sendMessage").click(sendNewMessage);
  messages.scrollTop(messages.prop("scrollHeight"));
}

function closeElement() {
  element.find(".chat").removeClass("enter").hide();
  element.find(">i").show();
  element.removeClass("expand");
  element.find(".header button").off("click", closeElement);
  element.find("#sendMessage").off("click", sendNewMessage);
  element
    .find(".text-box")
    .off("keydown", onMetaAndEnter)
    .prop("disabled", true)
    .blur();
  setTimeout(function () {
    element.find(".chat").removeClass("enter").show();
    element.click(openElement);
  }, 500);
}

function createUUID() {
  // http://www.ietf.org/rfc/rfc4122.txt
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

function sendNewMessage() {
  var userInput = $(".text-box");
  var newMessage = userInput
    .html()
    .replace(/\<div\>|\<br.*?\>/gi, "\n")
    .replace(/\<\/div\>/g, "")
    .trim()
    .replace(/\n/g, "<br>");

  if (!newMessage) return;

  var messagesContainer = $(".messages");

  messagesContainer.append(['<li class="self">', newMessage, "</li>"].join(""));

  // clean out old message
  userInput.html("");
  // focus on input
  userInput.focus();

  messagesContainer.finish().animate(
    {
      scrollTop: messagesContainer.prop("scrollHeight"),
    },
    250
  );
}

function onMetaAndEnter(event) {
  if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
    sendNewMessage();
  }
}
