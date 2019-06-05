import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from 'config';

import { ApplicationModule } from './module';

const PORT = config.get('PORT');

export default async function (): Promise<void> {
    const app = await NestFactory.create(ApplicationModule);
    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }));

    const nodeEnv = process.env.NODE_ENV;

    if (nodeEnv !== 'production') {
        const contentApiDocsOptions = new DocumentBuilder()
            .setTitle('Event')
            .setDescription('Event API')
            .build();

        const document = SwaggerModule.createDocument(app, contentApiDocsOptions);
        SwaggerModule.setup('/api', app, document);
    }

    await app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    });
}
