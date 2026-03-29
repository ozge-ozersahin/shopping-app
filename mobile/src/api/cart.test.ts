import {
    addItemToCart,
    applyDiscount,
    checkoutCart,
    createCart,
    getCart,
    removeCartItem,
    updateCartItem,
  } from './cart';
  
  describe('cart api', () => {
    beforeEach(() => {
      global.fetch = jest.fn() as jest.Mock;
      jest.clearAllMocks();
    });
  
    it('createCart returns cart data', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1, items: [], subtotal: 0, discount: 0, total: 0 }),
      });
  
      const result = await createCart();
  
      expect(fetch).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });
  
    it('getCart throws backend error message', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Cart expired' }),
      });
  
      await expect(getCart(1)).rejects.toThrow('Cart expired');
    });
  
    it('addItemToCart sends correct request body', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1, items: [], subtotal: 10, discount: 0, total: 10 }),
      });
  
      await addItemToCart(1, 2, 3);
  
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cart/1/items'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            productId: 2,
            quantity: 3,
          }),
        })
      );
    });
  
    it('updateCartItem returns updated cart', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1, items: [], subtotal: 20, discount: 0, total: 20 }),
      });
  
      const result = await updateCartItem(1, 2, 5);
  
      expect(result.total).toBe(20);
    });
  
    it('removeCartItem returns updated cart', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1, items: [], subtotal: 0, discount: 0, total: 0 }),
      });
  
      const result = await removeCartItem(1, 2);
  
      expect(result.subtotal).toBe(0);
    });
  
    it('checkoutCart returns checkout response', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Checkout successful',
          order: { id: 1, items: [], subtotal: 100, discount: 10, total: 90 },
        }),
      });
  
      const result = await checkoutCart(1);
  
      expect(result.success).toBe(true);
      expect(result.order.total).toBe(90);
    });
  
    it('applyDiscount throws fallback message when response json cannot be read', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });
  
      await expect(applyDiscount(1, 'SAVE10')).rejects.toThrow(
        'Failed to apply discount'
      );
    });
  });