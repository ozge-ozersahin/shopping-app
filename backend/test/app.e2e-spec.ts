import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Shopping App (e2e)', () => {
  let app: INestApplication;
  let cartId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Products
  it('GET /products — returns all products', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('GET /products?category=men — returns filtered products', () => {
    return request(app.getHttpServer())
      .get('/products?category=men')
      .expect(200)
      .expect((res) => {
        expect(res.body.every((p: any) => p.category === 'men')).toBe(true);
      });
  });

  it('GET /products/:id — returns a single product', () => {
    return request(app.getHttpServer())
      .get('/products/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(1);
      });
  });

  it('GET /products/:id — returns 404 for unknown product', () => {
    return request(app.getHttpServer()).get('/products/999').expect(404);
  });

  // Cart
  it('POST /cart — creates a new cart', () => {
    return request(app.getHttpServer())
      .post('/cart')
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        cartId = res.body.id;
      });
  });

  it('GET /cart/:id — returns the cart', () => {
    return request(app.getHttpServer())
      .get(`/cart/${cartId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.items).toEqual([]);
        expect(res.body.total).toBe(0);
      });
  });

  it('POST /cart/:id/items — adds an item to the cart', () => {
    return request(app.getHttpServer())
      .post(`/cart/${cartId}/items`)
      .send({ productId: 1, quantity: 2 })
      .expect(201)
      .expect((res) => {
        expect(res.body.items).toHaveLength(1);
        expect(res.body.items[0].productId).toBe(1);
        expect(res.body.items[0].quantity).toBe(2);
      });
  });

  it('POST /cart/:id/items — rejects invalid quantity', () => {
    return request(app.getHttpServer())
      .post(`/cart/${cartId}/items`)
      .send({ productId: 1, quantity: -1 })
      .expect(400);
  });

  it('PATCH /cart/:id/items/:productId — updates item quantity', () => {
    return request(app.getHttpServer())
      .patch(`/cart/${cartId}/items/1`)
      .send({ quantity: 3 })
      .expect(200)
      .expect((res) => {
        expect(res.body.items[0].quantity).toBe(3);
      });
  });

  it('PATCH /cart/:id/items/:productId — rejects invalid quantity', () => {
    return request(app.getHttpServer())
      .patch(`/cart/${cartId}/items/1`)
      .send({ quantity: 0 })
      .expect(400);
  });

  it('POST /cart/:id/discount — rejects invalid code', () => {
    return request(app.getHttpServer())
      .post(`/cart/${cartId}/discount`)
      .send({ code: 'INVALID' })
      .expect(400);
  });

  it('DELETE /cart/:id/items/:productId — removes an item', () => {
    return request(app.getHttpServer())
      .delete(`/cart/${cartId}/items/1`)
      .expect(200)
      .expect((res) => {
        expect(res.body.items).toEqual([]);
      });
  });

  it('POST /cart/:id/checkout — fails on empty cart', () => {
    return request(app.getHttpServer())
      .post(`/cart/${cartId}/checkout`)
      .expect(400);
  });
});