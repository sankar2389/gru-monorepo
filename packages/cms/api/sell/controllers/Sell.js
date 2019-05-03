'use strict';

/**
 * Sell.js controller
 *
 * @description: A set of functions called "actions" for managing `Sell`.
 */

module.exports = {

  /**
   * Retrieve sell records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.sell.search(ctx.query);
    } else {
      return strapi.services.sell.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a sell record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.sell.fetch(ctx.params);
  },

  /**
   * Count sell records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.sell.count(ctx.query);
  },

  /**
   * Create a/an sell record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.sell.add(ctx.request.body);
  },

  /**
   * Update a/an sell record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.sell.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an sell record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.sell.remove(ctx.params);
  }
};
