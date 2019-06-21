'use strict';

/**
 * Bid.js controller
 *
 * @description: A set of functions called "actions" for managing `Bid`.
 */

module.exports = {

  /**
   * Retrieve bid records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.bid.search(ctx.query);
    } else {
      return strapi.services.bid.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a bid record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.bid.fetch(ctx.params);
  },

  /**
   * Count bid records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.bid.count(ctx.query);
  },

  /**
   * Create a/an bid record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.bid.add(ctx.request.body);
  },

  /**
   * Update a/an bid record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.bid.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an bid record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.bid.remove(ctx.params);
  }
};
