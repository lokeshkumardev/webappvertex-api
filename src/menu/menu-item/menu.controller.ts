import { Controller, Post, Get, Body, Param, Delete, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MenuService } from './menu.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

// Path for storing uploaded images
const imageStorage = diskStorage({
  destination: './uploads/images',  // Folder to store images
  filename: (req, file, callback) => {
    const filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  },
});

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Upload an image
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', { storage: imageStorage }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = `http://localhost:3000/uploads/images/${file.filename}`;  // URL for the image
    return { imageUrl: fileUrl };  // Return the image URL to be used in the menu item
  }

  // Create a new menu item
  @Post()
  async create(@Body() menuData: { menuName: string, subItems: any[] }): Promise<any> {
    return this.menuService.createMenuItem(menuData);
  }

  // Get all menu items
  @Get()
  async getAll(): Promise<any> {
    return this.menuService.getAllMenuItems();
  }

  // Get a menu by name
  @Get(':menuName')
  async getByName(@Param('menuName') menuName: string): Promise<any> {
    return this.menuService.getMenuByName(menuName);
  }

  // Update menu by ID
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any): Promise<any> {
    return this.menuService.updateMenuItem(id, updateData);
  }

  // Delete menu by ID
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.menuService.deleteMenuItem(id);
  }
}
