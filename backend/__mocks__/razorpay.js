
class RazorpayMock {
  constructor(options) {
    this.options = options;
    this.orders = {
      create: jest.fn().mockImplementation(async (opts) => {
        return {
          id: 'order_test_123',
          amount: opts.amount,
          currency: opts.currency,
          receipt: opts.receipt,
        };
      }),
    };
    this.payments = {
      fetch: jest.fn().mockResolvedValue({ method: 'card' }),
      refund: jest.fn().mockResolvedValue({
        id: 'refund_test_1',
        payment_id: 'pay_test_1',
        amount: 1000,
      }),
    };
  }
}

module.exports = RazorpayMock;
