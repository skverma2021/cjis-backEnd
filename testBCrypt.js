const bcrypt = require('bcrypt');

const thePass = 'pqrs';

const testHash = async () => {
  try {
    const hash = await bcrypt.hash(thePass, 10);
    console.log(`success:   ${hash}`);
    const match = await bcrypt.compare(thePass, hash);
    console.log(`result:   ${match}`);
  } catch (error) {}

  //   console.log(hash, match);
};

testHash();
const toHash = async (clearPass) => {
  try {
    const hash = await bcrypt.hash(clearPass, 10);

    console.log('Hi', typeof hash);
  } catch (error) {}

  //   console.log(hash, match);
};
toHash(thePass);
