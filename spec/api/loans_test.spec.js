const supertest = require("supertest");
const { startDBServer, stopDBServer } = require("../../server");
const app = require("../../app");

describe("lms ", () => {
  const request = supertest(app);

  beforeAll(async () => {
    await startDBServer();
  });

  afterAll(async () => {
    await stopDBServer();
  });

  // get all loans
  xit("should provide all loans info ", async () => {
    const book1 = await request.post("/books").send({
      author: "author1",
      title: "title1",
      isbn: "3255",
      stock: 8
    });

    const student1 = await request.post("/students").send({
      name: "rahul"
    });

    const loan1 = await request.post("/loans").send({
      //bookId: "627a55946ea4ef8a86ce578d",

      bookId: book1.body.id,
      studentId: student1.body.id,
      outDate: "2022-05-14"
    });
    //console.log(loan1.body);
    expect(loan1.status).toBe(201);
    expect(loan1.body).toBeDefined();

    // const bl = await request.get("/books/" + loan1.body.bookId);
    // console.log(bl.body);

    const book2 = await request.post("/books").send({
      author: "author2",
      title: "title2",
      isbn: "3256",
      stock: 2
    });
    //console.log(book2.body);
    const student2 = await request.post("/students").send({
      name: "raj"
    });
    // console.log(student2.body);
    const loan2 = await request.post("/loans").send({
      //bookId: "627a55946ea4ef8a86ce578d",

      bookId: book2.body.id,
      studentId: student2.body.id,
      outDate: "2022-05-15"
    });

    //console.log(loan2.body);
    expect(loan2.status).toBe(201);
    expect(loan2.body).toBeDefined();

    // const bl1 = await request.get("/books/" + loan2.body.bookId);
    // console.log(bl1.body);

    const response = await request.get("/loans").query();
    // console.log("---------------------------------");
    // console.log(response.body);
    // console.log("---------------------------------");
    expect(response.status).toBe(200);
  });

  // get loan by id
  xit("should provide the loan info  matched by id", async () => {
    const book1 = await request.post("/books").send({
      author: "author1",
      title: "title1",
      isbn: "3255",
      stock: 4
    });
    expect(book1.status).toBe(201);
    expect(book1.body).toBeDefined();
    console.log(book1.body);

    const student1 = await request.post("/students").send({
      name: "rahul"
    });
    expect(student1.status).toBe(201);
    expect(student1.body).toBeDefined();
    console.log(student1.body);

    const loan1 = await request.post("/loans").send({
      bookId: book1.body.id,
      studentId: student1.body.id,
      outDate: "2022-05-14"
    });
    expect(loan1.status).toBe(201);
    expect(loan1.body).toBeDefined();
    console.log(loan1.body);

    const unique_id = loan1.body.id;

    const response = await request.get("/loans/" + unique_id);
    console.log(response.body);

    expect(response.status).toBe(200);
  });

  // create new loan
  xit("should add the new loan", async () => {
    const book1 = await request.post("/books").send({
      author: "author1",
      title: "title1",
      isbn: "3255",
      stock: 7
    });
    expect(book1.status).toBe(201);
    ///console.log(book1.body);
    expect(book1.body).toBeDefined();

    const student1 = await request.post("/students").send({
      name: "rahul"
    });
    // console.log(student1.body);
    expect(book1.status).toBe(201);
    expect(book1.body).toBeDefined();

    const loan1 = await request.post("/loans").send({
      bookId: book1.body.id,
      studentId: student1.body.id,
      outDate: "2022-05-14"
      //returnDate:"2022-05-14"
    });

    expect(loan1.status).toBe(201);
    console.log(loan1.body);
  });

  // update loan  info by id  [should be updated]
  xit("should update the loan info matched by id", async () => {
    const book1 = await request.post("/books").send({
      author: "author1",
      title: "title1",
      isbn: "3255",
      stock: 4
    });
    expect(book1.status).toBe(201);
    expect(book1.body).toBeDefined();
    //console.log(book1.body);

    const student1 = await request.post("/students").send({
      name: "rahul"
    });
    expect(student1.status).toBe(201);
    expect(student1.body).toBeDefined();
    //console.log(student1.body);

    const loan1 = await request.post("/loans").send({
      bookId: book1.body.id,
      studentId: student1.body.id,
      outDate: "2022-05-14"
    });
    expect(loan1.status).toBe(201);
    expect(loan1.body).toBeDefined();
    //console.log(loan1.body);

    const unique_id = loan1.body.id;

    const response = await request.post("/loans/" + unique_id).send({
      outDate: "2022-05-18"
    });
    //console.log(response.body);
    expect(response.status).toBe(201);
  });

  //  mentioned return date when student returned the book
  xit("should mention return date on loans when books is return", async () => {
    const book1 = await request.post("/books").send({
      author: "author1",
      title: "title1",
      isbn: "3255",
      stock: 4
    });
    expect(book1.status).toBe(201);
    console.log(book1.body);

    const student1 = await request.post("/students").send({
      name: "rahul"
    });
    expect(student1.status).toBe(201);
    console.log(student1.body);

    const loan1 = await request.post("/loans").send({
      bookId: book1.body.id,
      studentId: student1.body.id,
      outDate: "2022-05-14"
      //returnDate: 20 / 5 / 2022
    });
    expect(loan1.status).toBe(201);
    console.log(loan1.body);

    const response = await request.post("/loans/return/" + loan1.body.id).send({
      returnDate: "2022-06-13"
    });
    console.log(response.body);
    expect(response.status).toBe(200);
  });

  // return loans listed between start_date and end_date
  it("should return loans listed between given dates", async () => {
    const book1 = await request.post("/books").send({
      author: "author1",
      title: "title1",
      isbn: "3255",
      stock: 4
    });
    expect(book1.status).toBe(201);

    const student1 = await request.post("/students").send({
      name: "rahul"
    });
    expect(student1.status).toBe(201);

    const loan1 = await request.post("/loans").send({
      bookId: book1.body.id,
      studentId: student1.body.id,
      outDate: "2022-05-14",
      returnDate: "2022-05-29"
    });
    expect(loan1.status).toBe(201);
    console.log(loan1.body);

    const book2 = await request.post("/books").send({
      author: "author2",
      title: "title2",
      isbn: "3252",
      stock: 4
    });
    expect(book2.status).toBe(201);

    const student2 = await request.post("/students").send({
      name: "raj"
    });
    expect(student2.status).toBe(201);

    const loan2 = await request.post("/loans").send({
      bookId: book2.body.id,
      studentId: student2.body.id,
      outDate: "2022-05-18",
      returnDate: "2022-06-08"
    });
    expect(loan2.status).toBe(201);
    console.log(loan2.body);

    const response = await request.get("/loans").query({
      start_date: "2022-05-12",
      end_date: "2022-05-16"
    });

    console.log(response.body);
    expect(response.status).toBe(200);
  });

  // delete loan by id
  xit("should delete the loan", async () => {
    const book1 = await request.post("/books").send({
      author: "author1",
      title: "title1",
      isbn: "3255",
      stock: 4
    });
    expect(book1.status).toBe(201);
    expect(book1.body).toBeDefined();
    //console.log(book1.body);

    const student1 = await request.post("/students").send({
      name: "rahul"
    });
    expect(student1.status).toBe(201);
    expect(student1.body).toBeDefined();
    //console.log(student1.body);
    const loan1 = await request.post("/loans").send({
      bookId: book1.body.id,
      studentId: student1.body.id,
      outDate: "2022-05-14"
      //returnDate: 20 / 5 / 2022
    });
    expect(loan1.status).toBe(201);
    expect(loan1.body).toBeDefined();
    //console.log(loan1.body);

    const unique_id = loan1.body.id;

    const response = await request.delete("/loans/" + unique_id);
    // const l = await request.get("/books/" + book1.body.id);
    // console.log(l.body);
    console.log("loan is deleted ");
    expect(response.status).toBe(200);
  });
});
