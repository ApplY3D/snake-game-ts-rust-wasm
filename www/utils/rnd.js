/**
 *
 * @param {number} from
 * @param {number} to
 */
export const rnd = (from, to) => {
  return Math.floor(Math.random() * (to - from + 1)) + from;
};
