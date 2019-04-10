'use strict';

/**
 * Groups.js controller
 *
 * @description: A set of functions called "actions" for managing `Groups`.
 */

module.exports = {

  /**
   * Retrieve groups records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.groups.search(ctx.query);
    } else {
      return strapi.services.groups.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a groups record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.groups.fetch(ctx.params);
  },

  /**
   * Count groups records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.groups.count(ctx.query);
  },

  /**
   * Create a/an groups record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.groups.add(ctx.request.body);
  },

  /**
   * Update a/an groups record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.groups.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an groups record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.groups.remove(ctx.params);
  }
};
