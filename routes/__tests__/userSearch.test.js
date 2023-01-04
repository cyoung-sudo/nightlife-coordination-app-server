//----- Imports
const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const app = new express();
require("dotenv").config({ path: "./config.env" });
const userSearchRoutes = require("../userSearch");

//----- Middleware
app.use(express.json()); // needed to test POST requests
app.use("/", userSearchRoutes);

//----- Routes
app.use(require("../userSearch"));

describe("----- User-Search Routes -----", () => {
  beforeEach(done => {
    mongoose.connect(process.env.ATLAS_TESTING_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    })
    .then(() => {
      // Clear initial data
      const UserSearch = mongoose.model("UserSearch");
      return UserSearch.deleteMany({})
    })
    .then(() => done());
  }, 20000); // Increased timeout to handle slow connection
  
  afterEach(done => {
    // Clear test data
    const UserSearch = mongoose.model("UserSearch");
    UserSearch.deleteMany({})
    .then(() => mongoose.connection.close())
    .then(() => done());
  }, 20000);

  describe("/api/userSearch", () => {
    //----- Test 1 -----
    it("(POST) successfully creates a user-search", done => {
      // Create user-business
      request(app)
      .post("/api/userSearch")
      .send({
        userId: mongoose.Types.ObjectId("100000000000000000000000"),
        term: "sushi",
        location: "nyc",
        price: 1,
        open: true
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        done();
      });
    });
  });

  describe("/api/userSearch/user", () => {
    //----- Test 2 -----
    it("(POST) successfully retrieves user-search for user", done => {
      // Create user-business
      request(app)
      .post("/api/userSearch")
      .send({
        userId: mongoose.Types.ObjectId("100000000000000000000000"),
        term: "sushi",
        location: "nyc",
        price: 1,
        open: true
      })
      .end((err, res) => {
        if(err) return done(err);
        // Retrieve user-business for user
        request(app)
        .post("/api/userSearch/user")
        .send({
          userId: mongoose.Types.ObjectId("100000000000000000000000")
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.statusCode).toBe(200);
          expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
          expect(res.body.success).toBeDefined();
          expect(res.body.success).toBe(true);
          expect(res.body.userSearch).toBeDefined();
          expect(typeof res.body.userSearch).toBe("object");
          done();
        });
      });
    });

    //----- Test 3 -----
    it("(DELETE) successfully delete user-search for user", done => {
      // Create user-business
      request(app)
      .post("/api/userSearch")
      .send({
        userId: mongoose.Types.ObjectId("100000000000000000000000"),
        term: "sushi",
        location: "nyc",
        price: 1,
        open: true
      })
      .end((err, res) => {
        if(err) return done(err);
        // Delete user-business for user
        request(app)
        .delete("/api/userSearch/user")
        .send({
          userId: mongoose.Types.ObjectId("100000000000000000000000")
        })
        .end((err, res) => {
          if(err) return done(err);
          // Retrieve user-business for user
          request(app)
          .post("/api/userSearch/user")
          .send({
            userId: mongoose.Types.ObjectId("100000000000000000000000")
          })
          .end((err, res) => {
            if(err) return done(err);
            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(res.body.success).toBeDefined();
            expect(res.body.success).toBe(false);
            done();
          });
        });
      });
    });
  });
});