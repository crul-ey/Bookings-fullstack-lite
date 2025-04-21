import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

import users from '../src/data/users.json' assert { type: 'json' };
import hosts from '../src/data/hosts.json' assert { type: 'json' };
import admins from '../src/data/admins.json' assert { type: 'json' };
import properties from '../src/data/properties.json' assert { type: 'json' };
import amenities from '../src/data/amenities.json' assert { type: 'json' };
import bookings from '../src/data/bookings.json' assert { type: 'json' };
import reviews from '../src/data/reviews.json' assert { type: 'json' };

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log('🔐 Seeding users, hosts en admins...');
  const allUsers = await Promise.all([
    ...users.users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, SALT_ROUNDS),
      role: 'user',
      isBlocked: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    ...hosts.hosts.map(async (host) => ({
      ...host,
      password: await bcrypt.hash(host.password, SALT_ROUNDS),
      role: 'host',
      isBlocked: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    ...admins.admins.map(async (admin) => ({
      ...admin,
      password: await bcrypt.hash(admin.password, SALT_ROUNDS),
      role: 'admin',
      isBlocked: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  ]);

  await prisma.user.createMany({ data: allUsers });

  console.log('🏡 Seeding properties...');
  for (const property of properties.properties) {
    await prisma.property.create({
      data: {
        ...property,
        isActive: true,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log('🔧 Seeding amenities...');
  for (const amenity of amenities.amenities) {
    await prisma.amenity.create({
      data: {
        name: amenity.name,
        icon: amenity.icon || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log('📌 Seeding bookings...');
  for (const booking of bookings.bookings) {
    await prisma.booking.create({
      data: {
        ...booking,
        checkinDate: new Date(booking.checkinDate),
        checkoutDate: new Date(booking.checkoutDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log('⭐ Seeding reviews...');
  for (const review of reviews.reviews) {
    await prisma.review.create({
      data: {
        ...review,
        createdAt: new Date(),
      },
    });
  }

  console.log('✅ Database volledig gevuld!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Error tijdens seed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
