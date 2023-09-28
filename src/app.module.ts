import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import config from './shared/config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { PermissionsModule } from './permissions/permissions.module';
import { PermissionsGuard } from './permissions/permissions.guard';
import { CoursesModule } from './courses/courses.module';
import { AdminModule } from './admin/admin.module';
import { MainCategoriesModule } from './main-categories/main-categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { TopicsModule } from './topics/topics.module';
import { StudentsModule } from './students/students.module';
import { FacultiesModule } from './faculties/faculties.module';
import { SectionsModule } from './sections/sections.module';
import { LecturesModule } from './lectures/lectures.module';
import { VideosModule } from './videos/videos.module';
import { RatingsModule } from './ratings/ratings.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { RulesModule } from './rules/rule.module';
import { OffersModule } from './offers/offers.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/temp/uploads/hls'),
      serveRoot: '/api/videos/local/',
    }),
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    RolesModule,
    UsersModule,
    AuthModule,
    PermissionsModule,
    CoursesModule,
    AdminModule,
    MainCategoriesModule,
    SubCategoriesModule,
    TopicsModule,
    StudentsModule,
    FacultiesModule,
    SectionsModule,
    LecturesModule,
    VideosModule,
    RatingsModule,
    EnrollmentsModule,
    RulesModule,
    OffersModule,
    WishlistModule,
    WalletModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
