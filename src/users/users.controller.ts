import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Public } from "../auth/decorators/public.decorator";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create new user (Public registration)
  @Public()
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() currentUser?: any
  ) {
    // If you want only admins to create users, uncomment below:
    // if (!currentUser || currentUser.role !== 'admin') {
    //   throw new ForbiddenException('Only admins can create users');
    // }
    return this.usersService.create(createUserDto);
  }

  // Get all users
  @Get()
  findAll(@CurrentUser() currentUser: any) {
    console.log("Current user accessing users list:", currentUser.email);
    return this.usersService.findAll();
  }

  // Get current user's profile
  @Get("me")
  getMyProfile(@CurrentUser() currentUser: any) {
    return this.usersService.findOne(currentUser.id);
  }

  // Get user by ID
  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: any
  ) {
    // Users can only view their own profile unless they're admin
    if (currentUser.id !== id) {
      // If you want to restrict access, uncomment below:
      // throw new ForbiddenException('You can only view your own profile');

      // Or allow all authenticated users to view any profile:
      console.log(
        `User ${currentUser.email} is viewing profile of user ID: ${id}`
      );
    }
    return this.usersService.findOne(id);
  }

  // Update user profile
  @Patch("me")
  updateMyProfile(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: any
  ) {
    return this.usersService.update(currentUser.id, updateUserDto);
  }

  // Update user by ID (Admin or self only)
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: any
  ) {
    // Users can only update their own profile
    if (currentUser.id !== id) {
      // If you want to restrict access, uncomment below:
      // throw new ForbiddenException('You can only update your own profile');

      // Or log admin action:
      console.log(`User ${currentUser.email} is updating user ID: ${id}`);
    }
    return this.usersService.update(id, updateUserDto);
  }

  // Soft delete or deactivate user
  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: any
  ) {
    // Prevent users from deleting themselves
    if (currentUser.id === id) {
      throw new ForbiddenException("You cannot delete your own account");
    }

    // Only admins can delete users (uncomment if needed):
    // if (currentUser.role !== 'admin') {
    //   throw new ForbiddenException('Only admins can delete users');
    // }

    console.log(`User ${currentUser.email} is deleting user ID: ${id}`);
    return this.usersService.remove(id);
  }

  // Deactivate user account (instead of hard delete)
  @Patch(":id/deactivate")
  deactivateUser(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: any
  ) {
    if (currentUser.id === id) {
      throw new ForbiddenException("You cannot deactivate your own account");
    }

    return this.usersService.update(id, { isActive: false });
  }

  // Activate user account
  @Patch(":id/activate")
  activateUser(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: any
  ) {
    console.log(`User ${currentUser.email} is activating user ID: ${id}`);
    return this.usersService.update(id, { isActive: true });
  }

  // Change password
  @Patch("me/password")
  changePassword(
    @Body() body: { currentPassword: string; newPassword: string },
    @CurrentUser() currentUser: any
  ) {
    return this.usersService.changePassword(
      currentUser.id,
      body.currentPassword,
      body.newPassword
    );
  }
}
