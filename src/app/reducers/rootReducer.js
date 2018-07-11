import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';
import testReducer from '../../features/testarea/testReducer';
import eventReducer from '../../features/event/eventReducer';
import modalsReducer from '../../features/modals/modalReducer';

const rootReducer = combineReducers({
    test: testReducer,
    events: eventReducer,
    form: FormReducer,
    modals: modalsReducer
});

export default rootReducer;
