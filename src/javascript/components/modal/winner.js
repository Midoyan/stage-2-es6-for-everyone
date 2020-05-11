import { showModal } from './modal'
import { createElement } from '../../helpers/domHelper'
import { fight } from '../fight'

export function showWinnerModal(fighter) {
  // call showModal function 
  let knockOut = createElement({
    tagName: 'div',
    className: 'arena__knockout'
  })
  showModal({title: `Winner is ${fighter.name}!`, bodyElement: knockOut, onClose: () => location.reload()})
}