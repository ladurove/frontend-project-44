import { readln } from '../stdlibs/libs.js';

export default async function getUsername() {
  console.log('Welcome to the Brain Games!');
  return readln('May I have your name? ');
}
