import { createElement } from '../helpers/domHelper';
import { fight } from './fight';
import { fighters } from '../helpers/mockData';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });
  //console.log(fighter)
  // todo: show fighter info (image, name, health, etc.)
  if (fighter) {
    const fighterImageElement = createFighterImage(fighter);
    const fighterInfoElement = createFighterInfoElement(fighter);
    fighterElement.append(fighterInfoElement, fighterImageElement);
  }
  
  return fighterElement;
}

export function createFighterInfoElement(fighter) {
  const {attack, defense, name, health} = fighter;
  const fighterInfoElement = createElement({
    tagName: 'div',
    className: 'fighter-preview___info'
  });
  Object.keys(fighter).forEach(key => {
    if (key == 'source' || key == '_id')  {
      return;
    }
    let elem = createElement({tagName: 'span'})
    elem.innerText = `${key}: ${fighter[key]}`
    fighterInfoElement.append(elem)
  })
  

  return fighterInfoElement
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
