/**
 * Author: DeVry University CEIS420 Team 3
 * Team leader: Richard Lara
 * Team members: Richard Lara, Juan Diaz, Manuel Gonzalez, 
 * Joey Gil, Devin Nguyen, Logan Susini, Mohammad Mohammad
 * GitHub: https://github.com/richardlara67/PairPort
 * Project: PairPort
 * Description: A JS, HTML and CSS based memory game.
 * The goal is to match pairs of cards in the least
 * number of matching attempts.
 */

/**
 * @namespace Card object
 */
PairPort.Card = function(value, isMatchingCard) {
  this.value = value;
  this.isRevealed = false;
  if (isMatchingCard) {
    this.isMatchingCard = true;
  }

  this.reveal = function() {
    this.isRevealed = true;
  }

  this.conceal = function() {
    this.isRevealed = false;
  }
};
