import { eq } from 'drizzle-orm';
import { user } from '../schema/auth.schema.js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../modules/app/app.module.js';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { DRIZZLE } from '../index.js';

async function seedAdmin() {
  const email = 'admin@example.com';
  const password = 'adminadmin';

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const authService = app.get<AuthService>(AuthService);
  const db = app.get(DRIZZLE);

  const existing = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing.length) {
    console.log(
      `Admin already exists\n\nemail: ${email}\npassword: ${password}`,
    );
  } else {
    await authService.api.signUpEmail({
      body: { email, password, name: 'admin' },
    });
    console.log(`Admin user created\n\nemail: ${email}\npassword: ${password}`);
  }

  app.close().catch(console.error);
  process.exit();
}

seedAdmin().catch(console.error);
