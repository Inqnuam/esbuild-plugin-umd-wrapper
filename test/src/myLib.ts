// some dummy library

let started = false;

export const start = () => {
  started = true;
};

export const end = () => {
  started = false;
};

export const isAppStarted = () => {
  return started;
};
