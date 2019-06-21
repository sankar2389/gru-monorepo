'use strict';

/**
 * Questions.js controller
 *
 * @description: A set of functions called "actions" for managing `Questions`.
 */

module.exports = {

  /**
   * Retrieve questions records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.questions.search(ctx.query);
    } else {
      return strapi.services.questions.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a questions record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.questions.fetch(ctx.params);
  },

  /**
   * Count questions records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.questions.count(ctx.query);
  },

  /**
   * Create a/an questions record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.questions.add(ctx.request.body);
  },

  /**
   * Update a/an questions record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.questions.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an questions record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.questions.remove(ctx.params);
  }
};
