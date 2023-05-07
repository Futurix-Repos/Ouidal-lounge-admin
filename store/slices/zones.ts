import {createSlice} from "@reduxjs/toolkit"

const zoneSlice = createSlice({
  name: "zones",
  initialState: {
    zoneId: "",
  },
  reducers: {
    setZoneId: (state, action) => {
      state.zoneId = action.payload
    },
  },
})
export const {setZoneId} = zoneSlice.actions
export default zoneSlice.reducer
