import {createSlice} from "@reduxjs/toolkit"

const membersSlice = createSlice({
  name: "members",
  initialState: {
    memberId: "",
  },
  reducers: {
    setMemberId: (state, action) => {
      state.memberId = action.payload
    },
  },
})
export const {setMemberId} = membersSlice.actions
export default membersSlice.reducer
