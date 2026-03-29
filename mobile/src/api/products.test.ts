import { getProductById, getProducts } from './products';

describe('products api', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.Mock;
    jest.clearAllMocks();
  });

  it('getProducts fetches all products', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, name: 'Bag' }],
    });

    const result = await getProducts();

    expect(fetch).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('getProducts with category uses category query param', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [{ id: 2, name: 'Shoes' }],
    });

    await getProducts('women' as any);

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('?category=women'));
  });

  it('getProductById returns a single product', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 3, name: 'Coat' }),
    });

    const result = await getProductById(3);

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/products/3'));
    expect(result.id).toBe(3);
  });

  it('throws useful error when getProducts fails', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Failed to fetch products' }),
    });

    await expect(getProducts()).rejects.toThrow('Failed to fetch products');
  });

  it('throws useful error when getProductById fails', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Product not found' }),
    });

    await expect(getProductById(999)).rejects.toThrow('Product not found');
  });
});