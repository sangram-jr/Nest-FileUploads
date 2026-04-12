import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import type { AuthRequest } from 'src/auth/interfaces/auth-request.interface';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req:AuthRequest, @Body() createCollectionDto: CreateCollectionDto) {
    const usedId=req.user.sub;
    return this.collectionService.create(usedId,createCollectionDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req:AuthRequest) {
    const userId=req.user.sub;
    return this.collectionService.findAll(userId);
  }

  /*@Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(+id);
  }*/

  @UseGuards(AuthGuard)
  @Patch(':collectionId')
  update(
    @Req() req:AuthRequest,
    @Param('collectionId') collectionId: string, 
    @Body() updateCollectionDto: UpdateCollectionDto
  ) {
    const userId=req.user.sub;
    return this.collectionService.update(collectionId,userId, updateCollectionDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':collectionId')
  remove(@Req() req:AuthRequest,@Param('collectionId') collectionId: string) {
    const userId=req.user.sub;
    return this.collectionService.remove(collectionId,userId);
  }
}
