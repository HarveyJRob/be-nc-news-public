const db = require("../db/connection.js");
afterAll(() => db.end());

const { checkExists, addPagination } = require("../utils/utils");

describe("checkExists", () => {
  test("returns a resolved promise for a existent and valid article_id", () => {
    const table = "articles";
    const column = "article_id";
    const value = 1;
    const returnValue = checkExists(table, column, value);
    expect(returnValue).toEqual(Promise.resolve(true));
  });
  // test("returns a rejected promise for none existent and valid article_id", () => {
  //   const table = "articles";
  //   const column = "article_id";
  //   const value = 1000;
  //   const returnValue = checkExists(table, column, value);
  //   expect(returnValue).toEqual(Promise.reject({ status: 404, msg: "Not found" }));
  // });
});

describe("addPagination", () => {
  test("returns a new object", () => {
    const results = { rows: [1] };
    const limit = 10;
    const p = 1;
    const returnValue = addPagination(results, limit, p);
    expect(results).not.toBe(returnValue);
  });
  test("does not mutate the input object", () => {
    const results = { rows: [{ 1: 1 }, { 2: 2 }, { 3: 3 }] };
    const limit = 10;
    const p = 1;
    addPagination(results, limit, p);
    expect(results).toEqual({ rows: [{ 1: 1 }, { 2: 2 }, { 3: 3 }] });
  });
  test("single rows array returns a new object with total_count, page, pageCount & post properties using default limit and p", () => {
    const results = { rows: [1] };
    const limit = 10;
    const p = 1;
    const returnValue = addPagination(results, limit, p);
    const expectedResult = {
      total_count: 1,
      page: 1,
      pageCount: 1,
      posts: [1],
    };
    expect(returnValue).toEqual(expectedResult);
  });
  test("multi-item rows array returns a new object with total_count, page, pageCount & post properties using default limit and p", () => {
    const results = { rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] };
    const limit = 10;
    const p = 1;
    const returnValue = addPagination(results, limit, p);
    const expectedResult = {
      total_count: 11,
      page: 1,
      pageCount: 2,
      posts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
    expect(returnValue).toEqual(expectedResult);
  });
  test("multi-item rows array returns a new object with total_count, page, pageCount & post properties using default limit and p", () => {
    const results = { rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] };
    const limit = 5;
    const p = 2;
    const returnValue = addPagination(results, limit, p);
    const expectedResult = {
      total_count: 11,
      page: 2,
      pageCount: 3,
      posts: [6, 7, 8, 9, 10],
    };
    expect(returnValue).toEqual(expectedResult);
  });
  test("multi-item rows array returns a new object with total_count, page, pageCount & post properties using default limit and p", () => {
    const results = { rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] };
    const limit = 5;
    const p = 4;
    const returnValue = addPagination(results, limit, p);
    const expectedResult = {
      total_count: 11,
      page: 3,
      pageCount: 3,
      posts: [11],
    };
    expect(returnValue).toEqual(expectedResult);
  });
});
