
exports.up = function(knex, Promise) {
  return knex.schema.table('cards', function(table) {
    table.dateTime('dueDate').defaultTo(null)
    table.boolean('complete').defaultTo(false)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('cards', function(table) {
    table.dropColumn('dueDate');
    table.dropColumn('complete');
  })
};
