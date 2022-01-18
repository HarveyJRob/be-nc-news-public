const db = require("../db/connection.js");
afterAll(() => db.end());

const { checkExists, checkTopic, addPagination } = require("../utils/utils");

describe("checkExists", () => {
  test("returns true for an existent and valid article_id", () => {
    const valueToBeChecked = 1;
    return checkExists("articles", "article_id", valueToBeChecked).then((data) => {
      expect(data).toBe(true);
    });
  });
  test("returns a rejected promise if value doesn't exist in db", () => {
    const valueToBeChecked = 1000;
    return expect(checkExists("articles", "article_id", valueToBeChecked)).rejects.toEqual({
      status: 404,
      msg: "Not found",
    });
  });
});

describe("checkTopic", () => {
  test("returns an array of all topics if no argument provided", () => {
    return checkTopic().then((data) => {
      expect(data).toHaveLength(3);
      expect(data).toContain("mitch");
      expect(data).toContain("cats");
      expect(data).toContain("paper");
    });
  });
  test("returns an array of all topics if argument exists in db (case insensitive)", () => {
    return checkTopic("cats").then((data) => {
      expect(data).toHaveLength(3);
      expect(data).toContain("mitch");
      expect(data).toContain("cats");
      expect(data).toContain("paper");
    });
  });
  test("returns an array of all topics if argument exists in db (case insensitive)", () => {
    return checkTopic("CATS").then((data) => {
      expect(data).toHaveLength(3);
      expect(data).toContain("mitch");
      expect(data).toContain("cats");
      expect(data).toContain("paper");
    });
  });
  test("returns a rejected promise if provided argument doesn't exist in db", () => {
    return expect(checkTopic("dogs")).rejects.toEqual({ status: 400, msg: "Bad request" });
  });
});

describe("addPagination", () => {
  test("returns a new object", () => {
    const results = [1];
    const limit = 10;
    const p = 1;
    const returnValue = addPagination("articles", results, limit, p);
    expect(results).not.toBe(returnValue);
  });
  test("does not mutate the input object", () => {
    const results = [{ 1: 1 }, { 2: 2 }, { 3: 3 }];
    const limit = 10;
    const p = 1;
    addPagination("articles", results, limit, p);
    expect(results).toEqual([{ 1: 1 }, { 2: 2 }, { 3: 3 }]);
  });
  test("single rows array returns a new object with total_count, page, pageCount & post properties using default limit and p", () => {
    const results = [1];
    const limit = 10;
    const p = 1;
    const returnValue = addPagination("articles", results, limit, p);
    const expectedResult = {
      total_count: 1,
      page: 1,
      pageCount: 1,
      articles: [1],
    };
    expect(returnValue).toEqual(expectedResult);
  });
  test("multi-item rows array returns a new object with total_count, page, pageCount & post properties using default limit and p", () => {
    const results = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const limit = 10;
    const p = 1;
    const returnValue = addPagination("articles", results, limit, p);
    const expectedResult = {
      total_count: 11,
      page: 1,
      pageCount: 2,
      articles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
    expect(returnValue).toEqual(expectedResult);
  });
  test("multi-item rows array returns a new object with total_count, page, pageCount & post properties using default limit and p", () => {
    const results = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const limit = 5;
    const p = 2;
    const returnValue = addPagination("articles", results, limit, p);
    const expectedResult = {
      total_count: 11,
      page: 2,
      pageCount: 3,
      articles: [6, 7, 8, 9, 10],
    };
    expect(returnValue).toEqual(expectedResult);
  });
  test("multi-item rows array returns a new object with total_count, page, pageCount & post properties using default limit and p", () => {
    const results = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const limit = 5;
    const p = 4;
    const returnValue = addPagination("articles", results, limit, p);
    const expectedResult = {
      total_count: 11,
      page: 3,
      pageCount: 3,
      articles: [11],
    };
    expect(returnValue).toEqual(expectedResult);
  });
});
