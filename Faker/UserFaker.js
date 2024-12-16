import { faker } from '@faker-js/faker';
import User from '../Models/User.js'; // Adjust the path according to your structure

const generateFakeUsers = async (count = 1000) => {
  const user = [];
    console.log(`Generating ${count} fake users...`);
    
  for (let i = 0; i < count; i++) {
    user.push(new User({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password('12345678'),
    }));
  }

  await User.insertMany(user);
  console.log(`${count} fake users inserted!`);
};

export default generateFakeUsers;
