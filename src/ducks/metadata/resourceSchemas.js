const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    default:
      console.log(type, payload);

      return state;
  }
};