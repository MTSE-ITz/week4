import dotenv from 'dotenv';

dotenv.config();
import connection from '../src/config/database.js';
import client from '../src/config/elastic';
import User from '../src/models/user';

const lastNames = [
  'Nguyen',
  'Tran',
  'Le',
  'Pham',
  'Hoang',
  'Do',
  'Bui',
  'Dang',
  'Vu',
  'Vo',
];
const middleNames = [
  'Van',
  'Thi',
  'Duc',
  'Quoc',
  'Ngoc',
  'Hong',
  'Thanh',
  'Minh',
  'Anh',
  'Thu',
];
const firstNames = [
  'An',
  'Binh',
  'Chi',
  'Dung',
  'Hanh',
  'Hieu',
  'Khanh',
  'Lam',
  'Mai',
  'Nam',
  'Oanh',
  'Phuong',
  'Quyen',
  'Son',
  'Trang',
  'Uyen',
  'Vy',
  'Xuan',
  'Yen',
];
const roles = ['admin', 'user', 'editor'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomName() {
  return `${randomItem(lastNames)} ${randomItem(middleNames)} ${randomItem(
    firstNames
  )}`;
}

const seedUsers = async () => {
  try {
    await connection();
    await User.deleteMany({});
    await client.indices.delete({ index: 'users' }, { ignore: [404] });

    const total = 10_000;
    const batchSize = 1_000;
    let inserted = 0;

    for (let batch = 0; batch < total / batchSize; batch++) {
      let users = [];
      for (let i = 0; i < batchSize; i++) {
        const name = generateRandomName();
        const email = `${name.toLowerCase().replace(/\s+/g, '')}${
          batch * batchSize + i + 1
        }@example.com`;

        users.push({
          name,
          email,
          password: '123456',
          role: randomItem(roles),
        });
      }

      const insertedUsers = await User.insertMany(users);

      const body = [];
      for (const u of insertedUsers) {
        body.push({ index: { _index: 'users', _id: u._id.toString() } });
        body.push({
          name: u.name,
          email: u.email,
          role: u.role,
        });
      }

      await client.bulk({ refresh: true, body });

      inserted += users.length;
      console.log(`✅ Đã seed và sync ${inserted}/${total} users`);
    }

    const count = await client.count({ index: 'users' });
    console.log(`🎉 Seed và đồng bộ Elasticsearch thành công ${total} users`);
    console.log('Total documents in ES:', count.count);
    process.exit();
  } catch (err) {
    console.error('❌ Lỗi seed:', err);
    process.exit(1);
  }
};

seedUsers();
