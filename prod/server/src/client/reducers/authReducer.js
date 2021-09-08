import { FETCH_CURRENT_USER } from '../actions/index';

export default (state = null, action) => {
  switch(action.type) {
    case FETCH_CURRENT_USER:
      // false if not authenticated. action.payload.data will be undefined
      return action.payload.data || false;
    default:
      return state;
  }
}