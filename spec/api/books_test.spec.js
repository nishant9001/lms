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

  // check isbn is provided or not
  xit("should throw an error if isbn is not provided", async () => {
    const response = await request.post("/books").send({
      title: "westcoach",
      author: "rahul",
      stock: 5
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("isbn should be there");
  });

  // check author is provided or not
  xit("should throw an error if author is not provided", async () => {
    const response = await request.post("/books").send({
      title: "westcoach",
      isbn: "4560",
      stock: 5
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("author should be provided");
  });

  //check title is provided or not
  xit("should throw an error when title is not provided ", async () => {
    const response = await request.post("/books").send({
      author: "tom",
      isbn: "2322",
      stock: 5
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("title should be provided");
  });

  // check stock is provided or not
  xit("should throw an error when stock is not provided", async () => {
    const response = await request.post("/books").send({
      author: "author1",
      title: "title1",
      isbn: "isbn1"
    });
    // console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });

  // throw an error when title length is less than 3
  xit("should throw an error when title is less than 3 characters ", async () => {
    const response = await request.post("/books").send({
      title: "Th",
      author: "tom",
      isbn: "e263735723273",
      stock: 4
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "title length must be at least 3 characters long"
    );
  });

  //throw an error when stock value is less than 1
  xit("should throw an error when stock is less than 1 ", async () => {
    const book1 = await request.post("/books").send({
      author: "author1",
      title: "title1",
      isbn: "isbn1",
      stock: 0
    });
    expect(book1.status).toBe(400);
    expect(book1.body).toBeDefined();
  });

  // add the new book  []
  xit("should add the new book ", async () => {
    const book1 = await request.post("/books").send({
      author: "thanks you",
      isbn: "123",
      title: "why me",
      stock: 4
    });
    expect(book1.status).toBe(201);
    // console.log(book1.body);
    expect(book1.body).toBeDefined();
  });

  // get all books
  xit("should get all the books", async () => {
    const book_1 = await request.post("/books").send({
      author: "author1",
      title: "title1",
      isbn: "isbn1",
      stock: 4
    });
    //const book1_id = book_1.body.id;

    const book_2 = await request.post("/books").send({
      author: "author2",
      title: "title2",
      isbn: "isbn2",
      stock: 6
    });

    const response = await request
      .get("/books")
      .query({ author: "author1", isbn: "isbn2" });
    if (response.body.length === 0) {
      console.log("there is no matching books");
    }
    //console.log(response.body);
    expect(response.status).toBe(200);
  });

  // get book according to the id
  xit("should get book acording to the id ", async () => {
    const response = await request.post("/books").send({
      author: "gary",
      title: "city life",
      isbn: "1254",
      stock: 6
    });

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    const unique_id = response.body.id;
    const response1 = await request.get("/books/" + unique_id);
    //console.log(response1.body);
    expect(response1.status).toBe(200);
  });

  // check Isbn should be different
  xit("should throw an error if Isbn is repeated", async () => {
    const response = await request.post("/books").send({
      author: "tom",
      isbn: "2213",
      title: "hello",
      stock: 6
    });
    expect(response.status).toBe(201);
    //console.log(response.body);
    expect(response.body).toBeDefined();

    const response2 = await request.post("/books").send({
      author: "thomas",
      title: "the pool",
      isbn: "2213",
      stock: 6
    });
    //console.log(response2.body);
    expect(response2.status).toBe(400);
  });

  // update author name with the "id"
  xit("should update the author by id", async () => {
    const response = await request.post("/books").send({
      author: "rahul",
      title: "heroes",
      isbn: "5555",
      stock: 6
    });
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();

    const unique_id = response.body.id;
    const responsenew = await request.post("/books/" + unique_id).send({
      author: "raj"
    });

    expect(responsenew.status).toBe(200);
    //expect(responsenew.body.author).toBe("raj");
    //expect(responsenew.body.id).toBe(unique_id);
  });

  // update title of the book with the "id"
  xit("should update the title of the book by id", async () => {
    const response = await request.post("/books").send({
      author: "rakul",
      title: "titans",
      isbn: "5005",
      stock: 6
    });
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();

    const unique_id = response.body.id;
    const responsenew = await request.post("/books/" + unique_id).send({
      title: "rise and fall"
    });
    expect(responsenew.status).toBe(200);
    expect(responsenew.body.title).toBe("rise and fall");
  });

  // update isbn by id
  xit("should update the isbn by id", async () => {
    const response = await request.post("/books").send({
      author: "suresh",
      title: "titans and demons",
      isbn: "5105",
      stock: 6
    });
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();

    const unique_id = response.body.id;
    const responsenew = await request.post("/books/" + unique_id).send({
      isbn: "5105"
    });

    expect(responsenew.status).toBe(200);

    expect(response.body.isbn).toBe("5105");
    expect(responsenew.body.id).toBe(unique_id);
    // expect(response.body.message).toBe("isbn is updated");
  });

  // should increase the stock of the book if it's already available
  xit("should increase the stock the book if it's already availaible", async () => {
    const book1 = await request.post("/books").send({
      author: "author1",
      title: "title1",
      isbn: "isbn1",
      stock: 4
    });
    expect(book1.status).toBe(201);
    console.log(book1.body);

    const book2 = await request.post("/books/increase").send({
      author: "author2",
      title: "title2",
      isbn: "isbn1",
      stock: 4
    });
    expect(book2.status).toBe(200);
    console.log(book2.body);
  });

  // update stock by book Id
  xit("should update stock of a book by id", async () => {
    const book1 = await request.post("/books").send({
      author: "suresh",
      title: "titans and demons",
      isbn: "5105",
      stock: 6
    });
    expect(book1.status).toBe(201);
    const unique_id = book1.body.id;

    const response = await request.post("/books/" + unique_id).send({
      author: "suraj",
      title: "d demons",
      isbn: "5132",
      stock: 9
    });
    expect(response.status).toBe(200);
  });
  // update all properties of book with the "id"
  xit("should update all the book properties by id ", async () => {
    const response = await request.post("/books").send({
      author: "thank you",
      isbn: "1238",
      title: "why",
      stock: 7
    });
    //console.log(response.body);
    console.log(JSON.stringify(response.body));
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    const uniqueid = response.body.id;
    // console.log(uniqueid);
    const responsenew = await request.post("/books/" + uniqueid).send({
      title: "joy and freedom",
      author: "harsh",
      stock: 8
    });
    //console.log(responsenew.body);
    expect(responsenew.status).toBe(200);
    //console.log(JSON.stringify(responsenew.body));
    // expect(responsenew.body.message).toBe("books properties is updated");
  });

  // delete book by id
  xit("should delete the book matched by id", async () => {
    const book1 = await request.post("/books").send({
      author: "suresh",
      title: "titans and demons",
      isbn: "5105",
      stock: 9
    });
    expect(book1.status).toBe(201);
    expect(book1.body).toBeDefined();
    // console.log(book1.body);
    const unique_id = book1.body.id;

    const response = await request.delete("/books/" + unique_id);
    //console.log(book1.body);
    //const responsenew = await request.get("/books/" + unique_id);
    // console.log(responsenew.body);

    expect(response.status).toBe(200);
  });
});
