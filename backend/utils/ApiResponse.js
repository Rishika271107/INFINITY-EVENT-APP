class ApiResponse {
  /**
   * @param {Object} param0
   * @param {string} param0.message Human‑readable message
   * @param {any} [param0.data] Payload returned to the client
   * @param {boolean} [param0.success=true] Success flag
   */
  constructor(options = {}) {
    const { message, data, success = true, ...rest } = options;
    this.success = success;
    if (message !== undefined) this.message = message;
    if (data !== undefined) this.data = data;
    Object.assign(this, rest);
  }
}

module.exports = ApiResponse;
