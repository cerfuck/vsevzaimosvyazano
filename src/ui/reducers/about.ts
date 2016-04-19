import { events } from '../../events';
import { pagesType } from '../../io/types';
let objectAssign = require('object-assign');

let initialState = {
  contentText: ''
};

export type aboutType = {
  contentText: string;
};

export default function about<Reducer>(state: aboutType = initialState, action) {
  switch (action.type) {
    case events.saver.PAGES:
      return objectAssign({}, state, {
        contentText: action.payload.filter(page => page['name'] === 'about')[0].text
      });
    default:
      return state;
  }
}
