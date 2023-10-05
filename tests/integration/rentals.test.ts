
import { cleanDb } from "../utils"
import supertest from "supertest";
import app from "app";
import prisma from "database";
import { createRandomMovie, createRandomUser, createRental } from "../factories/rentals-fectorys";


beforeEach(async () => {
  await cleanDb();
});

const api = supertest(app);



describe("get /rentals tests", () => {

  it("Retorar 200, com todos os alugueis", async () => {
    const userOne = await createRandomUser();
    const userTwo = await createRandomUser();
    const movieOne = await createRandomMovie(false);
    const movieTwo = await createRandomMovie(false);
    const movieThree = await createRandomMovie(false);
    await createRental(userOne.id, [movieOne.id, movieTwo.id]);
    await createRental(userTwo.id, [movieThree.id]);
    const { status, body } = await api.get("/rentals");
    expect(body).toHaveLength(2);
    expect(body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        date: expect.any(String),
        endDate: expect.any(String),
        userId: userOne.id,
        closed: false
      })
    ]));
    expect(status).toBe(200);
  })

  it("Retorar 200, sem nenhum aluguel", async () => {
    const { status, body } = await api.get("/rentals");
    expect(body).toHaveLength(0);
    expect(body).toEqual([]);
    expect(status).toBe(200);
  })
})

describe("get /rentals/:id tests", () => {
  it("Retornar 200, com um alugel especifico pelo id", async () => {
    const userOne = await createRandomUser();
    const movieOne = await createRandomMovie(false);
    const movieTwo = await createRandomMovie(false);
    const rental = await createRental(userOne.id, [movieOne.id, movieTwo.id]);
    const { status, body } = await api.get(`/rentals/${rental.id}`);
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        date: expect.any(String),
        endDate: expect.any(String),
        userId: userOne.id,
        closed: false
      }));
    expect(status).toBe(200);
  })

  it("Retornar 404, se o aliguel não existit", async () => {
    const { status } = await api.get("/rentals/1");
    expect(status).toBe(404);
  })
})

describe("post /rentals tests", () => {
  it("Retornar 201, se o que foi enviado pelo usuario é valido", async () => {
    const userOne = await createRandomUser();
    const movieOne = await createRandomMovie(false);
    const movieTwo = await createRandomMovie(false);
    const { status } = await api.post(`/rentals`).send({
      userId: userOne.id,
      moviesId: [movieOne.id, movieTwo.id]
    });
    expect(status).toBe(201);
    const rentals = await prisma.rental.findMany();
    expect(rentals).toHaveLength(1);
    expect(rentals).toEqual([
      {
        id: expect.any(Number),
        date: expect.any(Date),
        endDate: expect.any(Date),
        userId: userOne.id,
        closed: false
      }]);
  })

  it("Retornar 201, se o que foi enviado pelo usuario não é valido", async () => {
    const { status } = await api.post(`/rentals`).send({});
    expect(status).toBe(422);
  })
})

describe("post /rentals/finish tests", () => {
  it("Retornar 200, se o body for valido", async () => {
    const userOne = await createRandomUser();
    const movieOne = await createRandomMovie(false);
    const movieTwo = await createRandomMovie(false);
    const rental = await createRental(userOne.id, [movieOne.id, movieTwo.id]);
    const { status, body } = await api.post(`/rentals/finish`).send({
      rentalId: rental.id
    });
    expect(status).toBe(200);
    const rentals = await prisma.rental.findMany();
    expect(rentals).toEqual([
      {
        id: expect.any(Number),
        date: expect.any(Date),
        endDate: expect.any(Date),
        userId: userOne.id,
        closed: true
      }]);
  })

})
