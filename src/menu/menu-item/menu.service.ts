import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem,SubItem } from '../dto/menu-item.dto';
import * as slugify from 'slugify';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel('MenuItem') private menuItemModel: Model<MenuItem>
  ) {}

  // Create a new menu item with SEO-friendly slugs and image URLs
  async createMenuItem(menuData: { menuName: string, subItems: SubItem[] }): Promise<MenuItem> {
    // Generate SEO-friendly slug for the main menu
    // const menuSlug = slugify(menuData.menuName, { lower: true });

    // Process each sub-item and create slugs for them
    menuData.subItems.forEach(subItem => {
    //   subItem.slug = slugify(subItem.name, { lower: true });
    });

    const newMenu = new this.menuItemModel({
      ...menuData,
    //   slug: menuSlug,
    });

    return newMenu.save();
  }

  // Get all menu items
  async getAllMenuItems(): Promise<MenuItem[]> {
    return this.menuItemModel.find().exec();
  }

  // Get menu by name (laundry/food)
  async getMenuByName(menuName: string): Promise<MenuItem | null> {
    return this.menuItemModel.findOne({ menuName }).exec();
  }

  // Update a menu item by ID
  async updateMenuItem(id: string, updateData: any): Promise<MenuItem | null> {
    return this.menuItemModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // Delete a menu item by ID
  async deleteMenuItem(id: string): Promise<MenuItem | null> {
    return this.menuItemModel.findByIdAndDelete(id).exec();
  }
}
