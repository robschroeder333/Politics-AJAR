export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('state');
    if (serializedState === null){
      return undefined;
    }
    // console.log('serializedState is', serializedState);
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    if (state.issues.selectedState !== 'AA'){
      const serializedState = JSON.stringify(state);
      // console.log('serializedState is', serializedState);
      sessionStorage.setItem('state', serializedState);
    }
  } catch (err) {
    // ignoring these errors
  }
};
