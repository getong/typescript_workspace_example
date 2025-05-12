import { Test } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';

describe('AppController', () => {
  let appController: AppController;
  
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should serve index.html', () => {
    const mockResponse = {
      sendFile: vi.fn().mockReturnValue('file-sent'),
    };

    const result = appController.serveIndex(mockResponse as any);
    
    expect(mockResponse.sendFile).toHaveBeenCalledWith(
      path.join(process.cwd(), 'public', 'index.html')
    );
    expect(result).toBe('file-sent');
  });
});
