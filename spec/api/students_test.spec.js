const supertest = require("supertest");
const { startDBServer, stopDBServer } = require("../../server");
const app = require("../../app");

describe("lms", () => {
  const request = supertest(app);

  beforeAll(async () => {
    await startDBServer();
  });

  afterAll(async () => {
    await stopDBServer();
  });

  // get all students
  xit("should provide all students info", async () => {
    const student1 = await request.post("/students").send({
      name: "raj"
    });
    expect(student1.status).toBe(201);
    expect(student1.body).toBeDefined();
    console.log(student1.body);

    const student2 = await request.post("/students").send({
      name: "rahul"
    });
    expect(student2.status).toBe(201);
    expect(student2.body).toBeDefined();
    console.log(student2.body);
    const student3 = await request.post("/students").send({
      name: "priya"
    });
    expect(student3.status).toBe(201);
    expect(student3.body).toBeDefined();
    console.log(student3.body);
    const response = await request.get("/students").query({ name: "priya" });
    console.log(response.body);
    expect(response.status).toBe(200);
  });

  // get student by id
  xit("should provide the student info matched by id", async () => {
    const student1 = await request.post("/students").send({
      name: "paras"
    });
    expect(student1.status).toBe(200);
    expect(student1.body).toBeDefined();

    const unique_Id = student1.body.id;
    const response = await request.get("/students/" + unique_Id);
    expect(response.status).toBe(200);
  });

  //update student info by id
  xit("should update the student info matched by id", async () => {
    const student1 = await request.post("/students").send({
      name: "rahul"
    });
    expect(student1.status).toBe(201);
    expect(student1.body).toBeDefined();
    //console.log(student1.body);
    const unique_id = student1.body.id;
    console.log("hii");
    const response = await request.post("/students/" + unique_id).send({
      name: "raj"
    });
    //console.log(response.body);
    expect(response.status).toBe(201);
  });
});
