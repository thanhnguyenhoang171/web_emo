import {
  Action,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlide';
import typeReducer from './slice/typeSlide';
import userReducer from './slice/userSlide';
import productReducer from './slice/productSlide';
import ratingReducer from './slice/ratingSlide';
import permissionReducer from './slice/permissionSlide';
import roleReducer from './slice/roleSlide';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    type: typeReducer,
    user: userReducer,
    product: productReducer,
    rating: ratingReducer,
    permission: permissionReducer,
    role: roleReducer
  },
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;