export const exceptionHandler = async (error: Error) => {
  //
  console.log(error.stack);
  console.log(error);
};
