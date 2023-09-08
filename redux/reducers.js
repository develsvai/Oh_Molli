import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  // userId : {userData : {deactivate : undefined}},
};


const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthstate: (state, action) => {
      // 유저 정보를 슬라이스에 저장하는 액션
        const {browserId, userData } = action.payload;
        state[browserId] = userData;
    },

    setAuthupdate: (state, action) => {
        const {browserId, userData } = action.payload;
        if(!state[browserId]){
          // state[browserId] = {} 
        }else{
          state[browserId] = userData;
        }
    },
    
    Authclear: (state, action) => {
      const {browserId} = action.payload;
      delete state[browserId];
    },
  },
});

export const {setAuthstate, setAuthupdate, Authclear} = userSlice.actions;

export default userSlice.reducer;