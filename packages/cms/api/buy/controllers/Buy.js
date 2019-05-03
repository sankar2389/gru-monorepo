'use strict';

/**
 * Buy.js controller
 *
 * @description: A set of functions called "actions" for managing `Buy`.
 */

module.exports = {

  /**
   * Retrieve buy records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.buy.search(ctx.query);
    } else {
      return strapi.services.buy.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a buy record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.buy.fetch(ctx.params);
  },

  /**
   * Count buy records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.buy.count(ctx.query);
  },

  /**
   * Create a/an buy record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const buyordr = await strapi.services.buy.add(ctx.request.body);
    await strapi.io.emit('buy', JSON.stringify({ message: buyordr }));
    return buyordr;
  },

  /**
   * Update a/an buy record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.buy.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an buy record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.buy.remove(ctx.params);
  }
};
