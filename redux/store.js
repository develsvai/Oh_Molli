'use client'
import { configureStore} from '@reduxjs/toolkit'
import userSlice from '../redux/reducers';
import { persistStore, persistReducer } from 'redux-persist';
import session from "redux-persist/lib/storage/session"; 



const persistConfig = {
  key: "root",
  // storage: new CookieStorage(Cookies), //session,
  storage: session,
};



const persistedReducer = persistReducer(persistConfig, userSlice);



// 리덕스 스토어를 생성합니다.
const store = configureStore({
  reducer: {  
     persistedReducer,
  },
  devTools: process.env.NODE_ENV !== 'production'
  // 미들웨어, 데브툴즈 활성화 등 다양한 설정
});


export const persistor = persistStore(store);

export default store;
