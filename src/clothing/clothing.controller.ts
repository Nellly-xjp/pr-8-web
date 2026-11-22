import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateClothingDto } from './dto/create-clothing.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateClothingDto } from './dto/update-clothing.dto';
import { ClothingService } from './clothing.service';

@Controller('clothing')
export class ClothingController {
  constructor(private readonly clothingService: ClothingService) {}

  @Post('collections')
  createCollection(@Body() dto: CreateCollectionDto) {
    return this.clothingService.createCollection(dto);
  }

  @Post()
  create(@Body() dto: CreateClothingDto) {
    return this.clothingService.create(dto);
  }

  @Get()
  findAll(@Query('material') material?: string) {
    return this.clothingService.findAll(material);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clothingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClothingDto,
  ) {
    return this.clothingService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clothingService.remove(id);
  }
}
