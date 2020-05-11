import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    firstFighter = Object.assign({blocked: false, baseHealth: firstFighter.health, cooldown: false}, firstFighter)
    secondFighter = Object.assign({blocked: false, baseHealth: secondFighter.health, cooldown: false}, firstFighter)
    runOnKeys(
      () => criticalHit(firstFighter, secondFighter),
      ...controls.PlayerOneCriticalHitCombination
    );
    runOnKeys(
      () => criticalHit(secondFighter, firstFighter),
      ...controls.PlayerTwoCriticalHitCombination
    );
    var keysPressed = []
    document.addEventListener('keydown', function(event) {
      if (event.code == controls.PlayerOneBlock) {
        firstFighter.blocked = true
      }
      if (event.code == controls.PlayerTwoBlock) {
        secondFighter.blocked = true
      }
      if (event.code == controls.PlayerOneAttack && !secondFighter.blocked && keysPressed.indexOf(event.code) === -1) {
        let damage = getDamage(firstFighter, secondFighter)
        secondFighter.health -= damage
      }
      if (event.code == controls.PlayerTwoAttack && !firstFighter.blocked && keysPressed.indexOf(event.code) === -1) {
        let damage = getDamage(secondFighter, firstFighter)
        firstFighter.health -= damage
      }

      updateHealthBars(firstFighter, secondFighter)
      keysPressed.push(event.code)
      if (firstFighter.health <= 0 || secondFighter.health <= 0) {
        resolve(firstFighter)
      }
    });

    document.addEventListener('keyup', function () {
      keysPressed = [];
    });
  });
}

function criticalHit(attacker, defender) {
  if (!attacker.cooldown) {
    let damage = 2 * attacker.attack
    defender.health -= damage
    defender.blocked = false
    attacker.cooldown = true
    setTimeout(() => {
      attacker.cooldown = !attacker.cooldown
    }, 10000)
  }
}

function updateHealthBars(firstFighter, secondFighter) {
  document.getElementById('left-fighter-indicator').style.width = firstFighter.health > 0 ? `${(firstFighter.health / firstFighter.baseHealth) * 100}%` : '0'
  document.getElementById('right-fighter-indicator').style.width = secondFighter.health > 0 ? `${(secondFighter.health / secondFighter.baseHealth) * 100}%` : '0'
}

function runOnKeys(func, ...codes) {
  let pressed = new Set();

  document.addEventListener('keydown', function(event) {
    pressed.add(event.code);

    for (let code of codes) { // все ли клавиши из набора нажаты?
      if (!pressed.has(code)) {
        return;
      }
    }

    // да, все

    // во время показа alert, если посетитель отпустит клавиши - не возникнет keyup
    // при этом JavaScript "пропустит" факт отпускания клавиш, а pressed[keyCode] останется true
    // чтобы избежать "залипания" клавиши -- обнуляем статус всех клавиш, пусть нажимает всё заново
    pressed.clear();

    func();
  });

  document.addEventListener('keyup', function(event) {
    pressed.delete(event.code);
  });

}

export function getDamage(attacker, defender) {
  // return damage
  const damage = getHitPower(attacker) - getBlockPower(defender)
  if (damage < 0) return 0;
  return damage
}

export function getHitPower(fighter) {
  // return hit power
  const criticalHitChance = Math.random() + 1;
  const power = fighter.attack * criticalHitChance;
  return power
}

export function getBlockPower(fighter) {
  // return block power
  const dodgeChance = Math.random() + 1;
  const power = fighter.defense * dodgeChance;
  return power
}
